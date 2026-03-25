<script setup lang="ts">
definePageMeta({ title: "Edit Application" });

const route = useRoute();
const router = useRouter();
const toast = useToast();

const appId = route.params.id as string;
const isLocalApp = isLocalApplicationId(appId);

// 1. Load application — localStorage or API
const { getApplication, updateApplication: updateLocalApp } = useApplicationStorage();
const localApp = ref<any>(null);
onMounted(() => { if (isLocalApp) localApp.value = getApplication(appId); });

const { data: appRes, pending: appPending, error: appError } = isLocalApp
  ? { data: ref(null), pending: ref(false), error: ref(null) }
  : await useFetch<{ application: any }>(`/api/applications/${appId}`);

const application = computed(() => isLocalApp ? localApp.value : appRes.value?.application);
const formId = computed(() => application.value?.formId);

// 2. Resolve form config from Nitro storage via /api/forms/[id]
const { runtimeConfig, pending: formPending, error: formError } =
  useFormConfig(formId);

const pending = computed(() => appPending.value || formPending.value);
const error = computed(() => (isLocalApp ? (!localApp.value && !formPending.value ? new Error("Not found") : null) : appError.value || formError.value));

// 3. Build initialValues — WizardRenderer expects { [pageId]: { fieldName: value } }
//    FormRenderer expects flat { fieldName: value }
//    The application stores flat data, so we need to spread it into each page.
const initialValues = computed(() => {
  if (!application.value?.data || !runtimeConfig.value) return undefined;

  const flat = application.value.data as Record<string, any>;

  // WizardRenderer stores data as formData[pageId][sectionId] = { fieldName: value }
  // so initialValues must match that shape.
  const byPage: Record<string, Record<string, any>> = {};
  for (const page of runtimeConfig.value.pages) {
    if (page.sections?.length) {
      byPage[page.id] = {};
      for (const section of page.sections) {
        byPage[page.id][section.id] = flat;
      }
    } else {
      // flat page (no sections) — WizardRenderer uses formData[pageId] directly
      byPage[page.id] = flat;
    }
  }
  return byPage;
});

const isSubmitting = ref(false);

async function update(data: Record<string, any>, status: "submitted" | "draft") {
  isSubmitting.value = true;
  try {
    if (isLocalApp) {
      updateLocalApp(appId, { data, status });
      localApp.value = getApplication(appId); // refresh local ref
    } else {
      await $fetch(`/api/applications/${appId}`, { method: "PUT", body: { data, status } });
    }
    toast.add({
      title: status === "draft" ? "Draft saved" : "Application updated!",
      color: status === "draft" ? "info" : "success",
      icon: status === "draft" ? "i-heroicons-document" : "i-heroicons-check-circle",
    });
    router.push("/dynamic?tab=applications");
  } catch (err: any) {
    toast.add({ title: "Update failed", description: err?.data?.statusMessage ?? "Unknown error", color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

const handleSubmit = (data: Record<string, any>) => update(data, "submitted");

async function handleSaveDraft(data: Record<string, any>) {
  isSubmitting.value = true;
  try {
    update(data, "draft");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <UContainer>
      <div class="max-w-3xl mx-auto">
        <div class="mb-6">
          <AppBackButton fallback="/applications" label="All Applications" />
        </div>

        <!-- Loading -->
        <div v-if="pending" class="space-y-4">
          <USkeleton class="h-10 w-64 rounded-lg" />
          <USkeleton class="h-96 w-full rounded-xl" />
        </div>

        <!-- Error -->
        <UCard v-else-if="error" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-circle" class="size-12 text-red-400 mx-auto mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Not found</h2>
          <p class="text-gray-500 text-sm mb-4">Application "{{ route.params.id }}" could not be loaded.</p>
          <UButton to="/applications" variant="outline">Go back</UButton>
        </UCard>

        <!-- Form pre-populated with existing data -->
        <template v-else-if="runtimeConfig && application">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-1">
              <UBadge
                :color="application.status === 'draft' ? 'warning' : 'success'"
                variant="soft"
              >
                {{ application.status === "draft" ? "Draft" : "Submitted" }}
              </UBadge>
              <span class="text-xs text-gray-400 font-mono">{{ application.id }}</span>
              <span v-if="application.serviceCode" class="text-xs text-gray-400 font-mono">
                · {{ application.serviceCode }}
              </span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">
              Edit: {{ application.formTitle }}
            </h1>
            <p class="text-xs text-gray-400 mt-1">
              Last updated: {{ new Date(application.updatedAt).toLocaleString() }}
            </p>
          </div>

          <!-- Wizard with pre-populated initialValues -->
          <V2WizardRenderer
            :config="runtimeConfig"
            :initial-values="initialValues"
            :submitting="isSubmitting"
            @submit="handleSubmit"
          >
            <template #extra-actions="{ data }">
              <UButton
                variant="outline"
                color="neutral"
                :loading="isSubmitting"
                @click="handleSaveDraft(data)"
              >
                Save as Draft
              </UButton>
            </template>
          </V2WizardRenderer>
        </template>
      </div>
    </UContainer>
  </div>
</template>
