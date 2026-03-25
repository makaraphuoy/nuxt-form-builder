<script setup lang="ts">
/**
 * BaseAvatarUpload
 *
 * Wraps Nuxt UI's UFileUpload with an auto-upload behaviour:
 *  1. User picks an image file → upload to /api/applications/files/upload
 *  2. Fetch the preview from /api/applications/files/:id/preview?type=image
 *  3. Convert the blob to a File object → pass to UFileUpload so it shows the thumbnail
 *
 * v-model value: the upload metadata object (id, original_file_name, …), or null.
 * The internal UFileUpload v-model is kept as a File so the preview renders.
 */
interface UploadData {
  id: string;
  original_file_name: string;
  path: string;
  file_name: string;
  file_etag: string;
  file_size: number;
  content_type: string;
  user_id: string;
  application_id: string | null;
}

interface Props {
  disabled?: boolean;
  accept?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  accept: "image/*",
});

const value = defineModel<UploadData | null>();

// Internal File kept purely for UFileUpload's thumbnail rendering
const previewFile = ref<File | null>(null);
const uploading = ref(false);
const uploadError = ref<string | null>(null);

/**
 * Hydrate the preview from an existing upload metadata object.
 * Called on mount and whenever the model value changes from outside
 * (e.g. when the edit page pre-populates field values).
 */
async function hydratePreview(data: UploadData | null | undefined) {
  if (!data?.id) {
    previewFile.value = null;
    return;
  }
  try {
    const res = await fetch(
      `/api/applications/files/${data.id}/preview?download=false&type=image`,
    );
    if (!res.ok) return;
    const blob = await res.blob();
    // Use the actual blob MIME type so UFileUpload always recognises it
    // (e.g. the static mock returns image/svg+xml regardless of original type)
    previewFile.value = new File([blob], data.original_file_name, {
      type: blob.type || data.content_type,
    });
  } catch {
    // Non-fatal: preview just won't show on edit
  }
}

// On mount: hydrate if a value is already set (edit mode)
onMounted(() => hydratePreview(value.value));

// If the parent swaps the value externally (e.g. after data loads async),
// re-hydrate — but only when the id actually changes to avoid re-fetching
// after our own upload writes back to value.
watch(
  () => value.value?.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) hydratePreview(value.value);
    if (!newId) previewFile.value = null;
  },
);

/**
 * Called when UFileUpload picks a new file.
 * We receive a File object (or null on clear).
 */
async function onFilePicked(file: File | null) {
  if (!file) {
    value.value = null;
    previewFile.value = null;
    return;
  }

  uploading.value = true;
  uploadError.value = null;

  try {
    // 1. Upload the file
    const form = new FormData();
    form.append("file", file);

    const uploadRes = await fetch("/api/applications/files/upload", {
      method: "POST",
      body: form,
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

    const json = await uploadRes.json();
    const data = json.data as UploadData;

    // 2. Fetch the preview blob so UFileUpload can display the thumbnail
    const previewRes = await fetch(
      `/api/applications/files/${data.id}/preview?download=false&type=image`,
    );
    if (previewRes.ok) {
      const blob = await previewRes.blob();
      previewFile.value = new File([blob], data.original_file_name, {
        type: blob.type || data.content_type,
      });
    } else {
      // Fall back to the original local file so preview still shows
      previewFile.value = file;
    }

    // 3. Emit the metadata to the parent form state
    value.value = data;
  } catch (err: any) {
    uploadError.value = err?.message ?? "Upload failed";
    // Keep showing the local file as preview even if upload failed
    previewFile.value = file;
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="relative">
      <UFileUpload
        :model-value="previewFile"
        :accept="accept"
        :disabled="disabled || uploading"
        @update:model-value="onFilePicked"
        class="h-52"
      />
      <!-- uploading overlay -->
      <div
        v-if="uploading"
        class="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70"
      >
        <UIcon name="i-heroicons-arrow-path" class="size-6 text-primary-500 animate-spin" />
      </div>
    </div>
    <p v-if="uploadError" class="text-xs text-red-500">{{ uploadError }}</p>
  </div>
</template>
