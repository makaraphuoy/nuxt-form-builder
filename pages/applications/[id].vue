<script setup lang="ts">
import { interpretConfig } from "~/utils/form-schema";
import type { JSONFormConfig } from "~/utils/form-schema";

definePageMeta({ title: "View Application" });

const route = useRoute();

const { data: appRes, pending: appPending, error: appError } =
  await useFetch<{ application: any }>(`/api/applications/${route.params.id}`);

const application = computed(() => appRes.value?.application);
const formId = computed(() => application.value?.formId);

const { data: jsonConfig, pending: formPending } =
  await useFetch<JSONFormConfig>(() => `/api/forms/${formId.value}`, {
    watch: [formId],
  });

const pending = computed(() => appPending.value || formPending.value);

// Collect all field definitions from the JSON config for label lookup
const fieldMap = computed(() => {
  const map: Record<string, { label: string; component: string }> = {};
  for (const page of jsonConfig.value?.pages ?? []) {
    for (const section of page.sections ?? []) {
      for (const row of section.rows ?? []) {
        for (const field of row.fields ?? []) {
          map[field.name] = { label: field.label ?? field.name, component: field.component };
        }
      }
    }
  }
  return map;
});

const dataEntries = computed(() =>
  Object.entries(application.value?.data ?? {}).filter(([, v]) => v !== null && v !== undefined && v !== "")
);

function formatValue(val: any): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <UContainer>
      <div class="max-w-3xl mx-auto">
        <div class="mb-6">
          <AppBackButton fallback="/dynamic?tab=applications" label="Applications" />
        </div>

        <!-- Loading -->
        <div v-if="pending" class="space-y-4">
          <USkeleton class="h-10 w-64 rounded-lg" />
          <USkeleton class="h-64 w-full rounded-xl" />
        </div>

        <!-- Error -->
        <UCard v-else-if="appError" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-circle" class="size-12 text-red-400 mx-auto mb-3" />
          <p class="font-semibold text-gray-900 mb-1">Not found</p>
          <p class="text-sm text-gray-400 mb-4">Application "{{ route.params.id }}" does not exist.</p>
          <UButton to="/dynamic" variant="outline">Go back</UButton>
        </UCard>

        <template v-else-if="application">
          <!-- Header -->
          <div class="mb-8 flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <UBadge
                  :color="application.status === 'draft' ? 'warning' : 'success'"
                  variant="soft"
                >
                  {{ application.status === "draft" ? "Draft" : "Submitted" }}
                </UBadge>
                <span v-if="application.serviceCode" class="text-xs text-gray-400 font-mono">
                  {{ application.serviceCode }}
                </span>
              </div>
              <h1 class="text-2xl font-bold text-gray-900">{{ application.formTitle }}</h1>
              <p class="text-xs text-gray-400 font-mono mt-1">{{ application.id }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                Created {{ new Date(application.createdAt).toLocaleString() }} ·
                Updated {{ new Date(application.updatedAt).toLocaleString() }}
              </p>
            </div>
            <UButton
              :to="`/applications/edit/${application.id}`"
              size="sm"
              variant="outline"
              leading-icon="i-heroicons-pencil-square"
            >
              Edit
            </UButton>
          </div>

          <!-- Data -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clipboard-document-check" class="size-4 text-gray-400" />
                <h2 class="font-semibold text-gray-700">Submitted Data</h2>
              </div>
            </template>

            <div v-if="dataEntries.length === 0" class="text-center py-8 text-gray-400 text-sm">
              No data recorded.
            </div>

            <dl v-else class="divide-y divide-gray-100">
              <div
                v-for="[key, value] in dataEntries"
                :key="key"
                class="grid grid-cols-3 gap-4 py-3 text-sm"
              >
                <dt class="text-gray-500 font-medium truncate">
                  {{ fieldMap[key]?.label ?? key }}
                  <span class="block text-xs text-gray-300 font-mono mt-0.5">{{ key }}</span>
                </dt>
                <dd class="col-span-2 text-gray-900">
                  <pre
                    v-if="typeof value === 'object' && value !== null"
                    class="text-xs bg-gray-50 rounded p-2 overflow-auto"
                  >{{ JSON.stringify(value, null, 2) }}</pre>
                  <span v-else>{{ formatValue(value) }}</span>
                </dd>
              </div>
            </dl>
          </UCard>
        </template>
      </div>
    </UContainer>
  </div>
</template>
