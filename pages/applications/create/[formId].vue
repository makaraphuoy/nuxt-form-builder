<script setup lang="ts">
definePageMeta({ title: "New Application" });

const route = useRoute();
const router = useRouter();
const toast = useToast();

// All forms now live in Nitro storage — always resolved via /api/forms/[id]
const { jsonConfig, runtimeConfig, pending, error: hasError } =
  useFormConfig(computed(() => route.params.formId as string));

const isSubmitting = ref(false);

async function submit(data: Record<string, any>, status: "submitted" | "draft") {
  isSubmitting.value = true;
  try {
    const payload = {
      formId: jsonConfig.value!.id,
      serviceCode: jsonConfig.value!.service_code,
      formTitle: jsonConfig.value!.title,
      data,
      status,
    };

    const res = await $fetch<{ application: any }>("/api/applications", {
      method: "POST",
      body: payload,
    });

    toast.add({
      title: status === "draft" ? "Draft saved" : "Application submitted!",
      description: `ID: ${res.application.id}`,
      color: status === "draft" ? "info" : "success",
      icon: status === "draft" ? "i-heroicons-document" : "i-heroicons-check-circle",
    });
    router.push("/dynamic?tab=applications");
  } catch (err: any) {
    toast.add({ title: "Failed", description: err?.data?.statusMessage ?? "Unknown error", color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

const handleSubmit = (data: Record<string, any>) => submit(data, "submitted");
const handleSaveDraft = (data: Record<string, any>) => submit(data, "draft");
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <UContainer>
      <div class="max-w-3xl mx-auto">
        <div class="mb-6">
          <AppBackButton fallback="/dynamic" label="My Workspace" />
        </div>

        <!-- Loading -->
        <div v-if="pending" class="space-y-4">
          <USkeleton class="h-10 w-64 rounded-lg" />
          <USkeleton class="h-96 w-full rounded-xl" />
        </div>

        <!-- Not found -->
        <UCard v-else-if="hasError" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-circle" class="size-12 text-red-400 mx-auto mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-1">Form not found</h2>
          <p class="text-gray-500 text-sm mb-4">No form found for "{{ route.params.formId }}".</p>
          <UButton to="/dynamic" variant="outline">Go back</UButton>
        </UCard>

        <!-- Form -->
        <template v-else-if="runtimeConfig">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-1">
              <UBadge color="primary" variant="soft">New Application</UBadge>
              <span v-if="jsonConfig?.service_code" class="text-xs text-gray-400 font-mono">
                {{ jsonConfig.service_code }}
              </span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">{{ jsonConfig?.title }}</h1>
          </div>

          <!-- Wizard -->
          <V2WizardRenderer
            :config="runtimeConfig"
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
