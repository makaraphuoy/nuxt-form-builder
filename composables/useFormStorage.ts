import type { JSONFormConfig } from "~/utils/form-schema";

export interface SavedForm {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  config: JSONFormConfig;
}

export function useFormStorage() {
  const { data, refresh } = useFetch<{ forms: SavedForm[] }>("/api/forms", {
    default: () => ({ forms: [] }),
    transform: (res: any) => ({ forms: res.forms ?? [] }),
  });

  const savedForms = computed(() => data.value?.forms ?? []);

  async function saveForm(config: JSONFormConfig, name?: string): Promise<SavedForm> {
    const res = await $fetch<{ form: SavedForm }>("/api/forms", {
      method: "POST",
      body: { config, name: name ?? config.title },
    });
    await refresh();
    return res.form;
  }

  async function loadForm(id: string): Promise<SavedForm | null> {
    try {
      const config = await $fetch<JSONFormConfig>(`/api/forms/${id}`);
      // Wrap config in a SavedForm — _applyConfig only needs .config
      return { id: config.id, name: config.title, config, createdAt: "", updatedAt: "" };
    } catch {
      return null;
    }
  }

  async function deleteForm(id: string) {
    await $fetch(`/api/forms/${id}`, { method: "DELETE" });
    await refresh();
  }

  return { savedForms, saveForm, loadForm, deleteForm, refresh };
}
