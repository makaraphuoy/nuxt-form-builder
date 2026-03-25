import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import { useFormStorage } from "~/composables/useFormStorage";
import { interpretConfig } from "~/utils/form-schema";
import { buildConfig } from "~/utils/form-serializer";
import { uid } from "~/utils/canvas-factories";
import type { CanvasField, CanvasPage } from "~/pages/builder/config";

export function useFormPersistence(params: {
  pages: Ref<CanvasPage[]>;
  formTitle: Ref<string>;
  formId: Ref<string>;
  serviceCode: Ref<string>;
  isMultiStep: Ref<boolean>;
  activePageIdx: Ref<number>;
  activeSectionIdx: Ref<number>;
  selectedId: Ref<string | null>;
  rightPanel: Ref<"field" | "row" | "section" | "page" | null>;
}) {
  const {
    pages, formTitle, formId, serviceCode,
    isMultiStep, activePageIdx, activeSectionIdx, selectedId, rightPanel,
  } = params;

  const { savedForms, saveForm, loadForm, deleteForm, refresh } = useFormStorage();
  const toast = useToast();
  const route = useRoute();

  const showPreview = ref(false);
  const showLoad = ref(false);
  const previewConfig = ref<ReturnType<typeof interpretConfig> | null>(null);
  const previewKey = ref(0);
  const isSaving = ref(false);

  async function save() {
    isSaving.value = true;
    try {
      await saveForm(
        buildConfig(pages.value, formId.value, formTitle.value, isMultiStep.value, serviceCode.value || undefined),
        formTitle.value,
      );
      toast.add({ title: "Saved!", color: "success", icon: "i-heroicons-check-circle" });
    } catch {
      toast.add({ title: "Save failed", color: "error", icon: "i-heroicons-x-circle" });
    } finally {
      isSaving.value = false;
    }
  }

  function _applyConfig(config: any) {
    formTitle.value = config.title;
    formId.value = config.id;
    serviceCode.value = config.service_code ?? "";
    isMultiStep.value = config.pages.length > 1;

    pages.value = config.pages.map((jp: any) => ({
      _id: jp.id,
      title: jp.title,
      description: jp.description,
      sections: jp.sections
        ? jp.sections.map((js: any) => ({
            _id: js.id,
            title: js.title ?? "Section",
            description: js.description,
            icon: js.icon,
            displayStyle: js.displayStyle,
            rows: js.rows?.length
              ? js.rows.map((jr: any) => ({
                  _id: jr.id,
                  layout: jr.layout ?? "auto",
                  cols: jr.cols,
                  gap: jr.gap ?? "md",
                  fields: jr.fields.map((f: any) => ({ ...f, _id: uid() }) as CanvasField),
                }))
              : js.fields?.length
                ? [{ _id: uid(), layout: "auto", gap: "md", fields: js.fields.map((f: any) => ({ ...f, _id: uid() }) as CanvasField) }]
                : [],
          }))
        : [{ _id: uid(), title: "Section 1", rows: jp.fields?.length
            ? [{ _id: uid(), layout: "auto", gap: "md", fields: (jp.fields ?? []).map((f: any) => ({ ...f, _id: uid() }) as CanvasField) }]
            : [] }],
    }));

    activePageIdx.value = 0;
    activeSectionIdx.value = 0;
    selectedId.value = null;
    rightPanel.value = null;
    showLoad.value = false;
  }

  async function loadSaved(id: string) {
    const entry = await loadForm(id);
    if (!entry) return;
    _applyConfig(entry.config);
  }

  function exportJson() {
    const json = JSON.stringify(
      buildConfig(pages.value, formId.value, formTitle.value, isMultiStep.value, serviceCode.value || undefined),
      null, 2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formId.value}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openPreview() {
    previewConfig.value = interpretConfig(
      buildConfig(pages.value, formId.value, formTitle.value, isMultiStep.value, serviceCode.value || undefined),
    );
    previewKey.value++;
    showPreview.value = true;
  }

  onMounted(() => {
    const id = route.query.load as string | undefined;
    if (id) loadSaved(id);
  });

  return {
    savedForms, refresh, deleteForm, isSaving,
    showPreview, showLoad, previewConfig, previewKey,
    save, loadSaved, exportJson, openPreview,
  };
}
