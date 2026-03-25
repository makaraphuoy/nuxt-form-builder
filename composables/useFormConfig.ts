/**
 * Resolves a form config by ID from /api/forms/[id].
 * The server endpoint checks Nitro KV storage first, then static templates.
 */
import { interpretConfig } from "~/utils/form-schema";
import type { JSONFormConfig } from "~/utils/form-schema";

export function useFormConfig(formId: Ref<string | undefined> | string) {
  const id = computed(() => (typeof formId === "string" ? formId : formId.value));

  const { data: jsonConfig, pending, error } = useFetch<JSONFormConfig>(
    () => `/api/forms/${id.value}`,
    { watch: [id], immediate: computed(() => !!id.value) },
  );

  const runtimeConfig = computed(() =>
    jsonConfig.value ? interpretConfig(jsonConfig.value) : null,
  );

  return { jsonConfig, runtimeConfig, pending, error };
}
