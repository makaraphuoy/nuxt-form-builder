<script setup lang="ts">
/**
 * BaseFileAttachment
 *
 * Drop-in replacement for a plain <input type="file">.
 * On file pick → POSTs to /api/applications/files/upload.
 * After upload → shows the filename card with View / Replace / Delete actions.
 *
 * v-model value shape: the `data` object from the upload response, or null.
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
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  accept: "*/*",
  disabled: false,
  multiple: false,
});

const value = defineModel<UploadData | null>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref<string | null>(null);

function openPicker() {
  if (props.disabled) return;
  fileInputRef.value?.click();
}

async function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploading.value = true;
  uploadError.value = null;

  try {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/applications/files/upload", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

    const json = await res.json();
    value.value = json.data as UploadData;
  } catch (err: any) {
    uploadError.value = err?.message ?? "Upload failed";
  } finally {
    uploading.value = false;
    // Reset input so the same file can be re-selected after delete
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
}

function viewFile() {
  if (!value.value) return;
  window.open(
    `/api/applications/files/${value.value.id}/preview?download=false`,
    "_blank",
  );
}

function replaceFile() {
  if (props.disabled) return;
  fileInputRef.value?.click();
}

function deleteFile() {
  value.value = null;
  uploadError.value = null;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function fileIcon(contentType: string) {
  if (contentType.startsWith("image/")) return "i-heroicons-photo";
  if (contentType === "application/pdf") return "i-heroicons-document-text";
  return "i-heroicons-paper-clip";
}
</script>

<template>
  <!-- Hidden native file input -->
  <input
    ref="fileInputRef"
    type="file"
    :accept="accept"
    :multiple="multiple"
    class="hidden"
    @change="onFileSelected"
  />

  <!-- Empty / upload state -->
  <div
    v-if="!value && !uploading"
    class="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-5 cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
    @click="openPicker"
  >
    <div class="flex flex-col items-center gap-1 text-center">
      <UIcon name="i-heroicons-arrow-up-tray" class="size-6 text-gray-400" />
      <span class="text-sm text-gray-500">Click to upload</span>
      <span v-if="accept !== '*/*'" class="text-xs text-gray-400">{{ accept }}</span>
    </div>
  </div>

  <!-- Uploading state -->
  <div
    v-else-if="uploading"
    class="flex items-center gap-3 w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50"
  >
    <UIcon name="i-heroicons-arrow-path" class="size-5 text-primary-500 animate-spin" />
    <span class="text-sm text-gray-500">Uploading…</span>
  </div>

  <!-- File card — shown after successful upload -->
  <div
    v-else-if="value"
    class="flex items-center gap-3 w-full border border-emerald-300 bg-emerald-50/40 rounded-lg px-4 py-3"
  >
    <UIcon
      :name="fileIcon(value.content_type)"
      class="size-5 text-emerald-600 shrink-0"
    />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-800 truncate">
        {{ value.original_file_name }}
      </p>
      <p class="text-xs text-gray-400">{{ formatBytes(value.file_size) }}</p>
    </div>

    <div class="flex items-center gap-1 shrink-0">
      <UButton
        size="xs"
        variant="ghost"
        color="primary"
        icon="i-heroicons-eye"
        :disabled="disabled"
        title="View"
        @click="viewFile"
      />
      <UButton
        size="xs"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-arrow-path"
        :disabled="disabled"
        title="Replace"
        @click="replaceFile"
      />
      <UButton
        size="xs"
        variant="ghost"
        color="error"
        icon="i-heroicons-trash"
        :disabled="disabled"
        title="Delete"
        @click="deleteFile"
      />
    </div>
  </div>

  <!-- Error state -->
  <p v-if="uploadError" class="mt-1 text-xs text-red-500">{{ uploadError }}</p>
</template>
