<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFormStorage } from "~/composables/useFormStorage";
import { useConfirmModal } from "~/composables/useConfirmModal";
import { isLocalApplicationId } from "~/composables/useApplicationStorage";

definePageMeta({ title: "Dynamic Forms" });

const route = useRoute();
const { savedForms, deleteForm } = useFormStorage();
const modal = useConfirmModal();

const { data: appsRes, refresh: refreshApps } = await useFetch<{ applications: any[] }>("/api/applications");
const { applications: localApps, refresh: refreshLocalApps, deleteApplication: deleteLocalApp } = useApplicationStorage();

// Merge local + server applications, sorted by createdAt desc
const applications = computed(() =>
  [...localApps.value, ...(appsRes.value?.applications ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
);

onMounted(() => {
  refreshApps();
  refreshLocalApps();
});

// Support ?tab=applications in URL (e.g. back-link from view page)
const activeTab = ref((route.query.tab as string) ?? "forms");

const showFormPicker = ref(false);

const tabs = [
  { key: "forms", label: "My Forms", icon: "i-heroicons-document-text" },
  { key: "applications", label: "Applications", icon: "i-heroicons-clipboard-document-list" },
];

function confirmDelete(id: string, name: string) {
  modal.openConfirm({
    title: "Delete Form",
    description: `"${name}" will be permanently removed from your saved forms.`,
    icon: "i-heroicons-trash",
    confirmLabel: "Delete",
    onConfirm: async () => { await deleteForm(id); },
  });
}

function confirmDeleteApp(id: string, title: string) {
  modal.openConfirm({
    title: "Delete Application",
    description: `"${title}" will be permanently removed.`,
    icon: "i-heroicons-trash",
    confirmLabel: "Delete",
    onConfirm: async () => {
      if (isLocalApplicationId(id)) {
        deleteLocalApp(id);
      } else {
        await $fetch(`/api/applications/${id}`, { method: "DELETE" });
        refreshApps();
      }
    },
  });
}

function statusColor(status: string) {
  return status === "draft" ? "warning" : "success";
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <UContainer>
      <div class="max-w-3xl mx-auto">

        <!-- Header -->
        <div class="mb-8">
          <AppBackButton fallback="/" label="Home" />
          <h1 class="text-3xl font-bold text-gray-900 mt-4">My Workspace</h1>
          <p class="text-gray-500 text-sm mt-1">Manage your forms and submitted applications</p>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="activeTab === tab.key
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            @click="activeTab = tab.key"
          >
            <UIcon :name="tab.icon" class="size-4" />
            {{ tab.label }}
            <span
              class="ml-0.5 text-xs rounded-full px-1.5 py-0.5 font-mono"
              :class="activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'"
            >
              {{ tab.key === "forms" ? savedForms.length : applications.length }}
            </span>
          </button>
        </div>

        <!-- ── TAB: My Forms ── -->
        <template v-if="activeTab === 'forms'">
          <UCard v-if="savedForms.length === 0" class="text-center py-14">
            <UIcon name="i-heroicons-document-plus" class="size-12 text-gray-200 mx-auto mb-3" />
            <p class="font-semibold text-gray-700 mb-1">No saved forms yet</p>
            <p class="text-sm text-gray-400 mb-5">Use the visual builder to create your first form</p>
            <UButton to="/builder" leading-icon="i-heroicons-cursor-arrow-rays">Open Builder</UButton>
          </UCard>

          <div v-else class="space-y-3">
            <UCard
              v-for="form in savedForms"
              :key="form.id"
              class="hover:shadow-sm transition-shadow"
            >
              <div class="flex items-center justify-between">
                <NuxtLink :to="`/dynamic/${form.id}`" class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center shrink-0">
                    <UIcon name="i-heroicons-cursor-arrow-rays" class="size-5 text-warning-500" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ form.name }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <UBadge color="warning" variant="subtle" size="sm">Local</UBadge>
                      <span v-if="form.config?.service_code" class="text-xs text-gray-400 font-mono">
                        {{ form.config.service_code }}
                      </span>
                      <span class="text-xs text-gray-400">
                        {{ new Date(form.updatedAt).toLocaleDateString() }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>

                <div class="flex items-center gap-1.5 shrink-0 ml-3">
                  <UTooltip text="Apply (Create application)">
                    <UButton size="xs" variant="soft" color="primary"
                      icon="i-heroicons-paper-airplane" :to="`/applications/create/${form.id}`" />
                  </UTooltip>
                  <UTooltip text="Edit in Builder">
                    <UButton size="xs" variant="ghost" color="neutral"
                      icon="i-heroicons-pencil-square" :to="`/builder?load=${form.id}`" />
                  </UTooltip>
                  <UTooltip text="Delete">
                    <UButton size="xs" variant="ghost" color="error"
                      icon="i-heroicons-trash" @click.prevent="confirmDelete(form.id, form.name)" />
                  </UTooltip>
                </div>
              </div>
            </UCard>
          </div>

          <div class="mt-6 flex items-center justify-between border border-dashed border-gray-200 rounded-xl px-4 py-3">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-plus-circle" class="size-4 text-primary-400" />
              Build a new form from scratch
            </div>
            <UButton to="/builder" size="sm" variant="outline" trailing-icon="i-heroicons-arrow-right">
              Open Builder
            </UButton>
          </div>
        </template>

        <!-- ── TAB: Applications ── -->
        <template v-else-if="activeTab === 'applications'">

          <!-- Top action bar -->
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-500">
              {{ applications.length }} application{{ applications.length === 1 ? "" : "s" }}
            </p>
            <UButton size="sm" leading-icon="i-heroicons-plus" @click="showFormPicker = true">
              New Application
            </UButton>
          </div>

          <!-- Empty state -->
          <UCard v-if="applications.length === 0" class="text-center py-14">
            <UIcon name="i-heroicons-clipboard-document-list" class="size-12 text-gray-200 mx-auto mb-3" />
            <p class="font-semibold text-gray-700 mb-1">No applications yet</p>
            <p class="text-sm text-gray-400 mb-5">Pick a form from My Forms and click Apply</p>
            <UButton @click="activeTab = 'forms'" leading-icon="i-heroicons-document-text" variant="outline">
              Go to My Forms
            </UButton>
          </UCard>

          <!-- Application list -->
          <div v-else class="space-y-3">
            <UCard
              v-for="app in applications"
              :key="app.id"
              class="hover:shadow-sm transition-shadow"
            >
              <div class="flex items-center justify-between">
                <!-- Info -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <UBadge :color="statusColor(app.status)" variant="soft" size="sm">
                      {{ app.status === "draft" ? "Draft" : "Submitted" }}
                    </UBadge>
                    <span v-if="app.serviceCode" class="text-xs text-gray-400 font-mono">
                      {{ app.serviceCode }}
                    </span>
                  </div>
                  <p class="font-semibold text-gray-900 truncate">{{ app.formTitle }}</p>
                  <p class="text-xs text-gray-400 font-mono mt-0.5">{{ app.id }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ new Date(app.createdAt).toLocaleString() }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-1.5 shrink-0 ml-3">
                  <UTooltip text="View details">
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      icon="i-heroicons-eye"
                      :to="`/applications/${app.id}`"
                    />
                  </UTooltip>
                  <UTooltip text="Edit application">
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      icon="i-heroicons-pencil-square"
                      :to="`/applications/edit/${app.id}`"
                    />
                  </UTooltip>
                  <UTooltip text="Create new from same form">
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="primary"
                      icon="i-heroicons-document-duplicate"
                      :to="`/applications/create/${app.formId}`"
                    />
                  </UTooltip>
                  <UTooltip text="Delete">
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="error"
                      icon="i-heroicons-trash"
                      @click.prevent="confirmDeleteApp(app.id, app.formTitle)"
                    />
                  </UTooltip>
                </div>
              </div>
            </UCard>
          </div>
        </template>

      </div>
    </UContainer>

    <!-- Form Picker Modal -->
    <UModal v-model:open="showFormPicker" title="Pick a Form" description="Select a saved form to start a new application">
      <template #body>
        <!-- Empty -->
        <div v-if="savedForms.length === 0" class="text-center py-10">
          <UIcon name="i-heroicons-document-plus" class="size-10 text-gray-200 mx-auto mb-3" />
          <p class="text-sm text-gray-500 mb-4">No saved forms yet.</p>
          <UButton to="/builder" size="sm" variant="outline" @click="showFormPicker = false">
            Open Builder
          </UButton>
        </div>

        <!-- Form list -->
        <div v-else class="space-y-2">
          <NuxtLink
            v-for="form in savedForms"
            :key="form.id"
            :to="`/applications/create/${form.id}`"
            class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
            @click="showFormPicker = false"
          >
            <div class="w-9 h-9 rounded-lg bg-warning-50 flex items-center justify-center shrink-0 group-hover:bg-warning-100 transition-colors">
              <UIcon name="i-heroicons-cursor-arrow-rays" class="size-4 text-warning-500" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                {{ form.name }}
              </p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span v-if="form.config?.service_code" class="text-xs text-gray-400 font-mono">
                  {{ form.config.service_code }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ new Date(form.updatedAt).toLocaleDateString() }}
                </span>
              </div>
            </div>
            <UIcon name="i-heroicons-arrow-right" class="size-4 text-gray-300 group-hover:text-primary-400 shrink-0 transition-colors" />
          </NuxtLink>
        </div>
      </template>
    </UModal>
  </div>
</template>
