<script setup lang="ts">
definePageMeta({ title: "Applications" });

const { data, refresh } = await useFetch<{ applications: any[] }>("/api/applications");
const applications = computed(() => data.value?.applications ?? []);

// Refresh periodically so newly created apps appear
onMounted(() => refresh());
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <AppBackButton fallback="/" label="Home" />
        </div>

        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
            <p class="text-sm text-gray-400 mt-0.5">All created and draft applications</p>
          </div>
          <UButton to="/dynamic" variant="outline" leading-icon="i-heroicons-plus">
            New Application
          </UButton>
        </div>

        <!-- Empty -->
        <UCard v-if="applications.length === 0" class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="size-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 text-sm">No applications yet.</p>
          <UButton to="/dynamic" class="mt-4" variant="outline">Browse forms to apply</UButton>
        </UCard>

        <!-- List -->
        <div v-else class="space-y-3">
          <UCard
            v-for="app in applications"
            :key="app.id"
            class="hover:shadow-sm transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <UBadge
                    :color="app.status === 'draft' ? 'warning' : 'success'"
                    variant="soft"
                    size="sm"
                  >
                    {{ app.status === "draft" ? "Draft" : "Submitted" }}
                  </UBadge>
                  <span v-if="app.serviceCode" class="text-xs text-gray-400 font-mono">
                    {{ app.serviceCode }}
                  </span>
                </div>
                <p class="font-semibold text-gray-900 truncate">{{ app.formTitle }}</p>
                <p class="text-xs text-gray-400 font-mono mt-0.5">{{ app.id }}</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  Created {{ new Date(app.createdAt).toLocaleString() }}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0 ml-4">
                <UButton
                  :to="`/applications/edit/${app.id}`"
                  size="sm"
                  variant="outline"
                  leading-icon="i-heroicons-pencil-square"
                >
                  Edit
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
