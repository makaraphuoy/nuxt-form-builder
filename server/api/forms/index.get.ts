import { formTemplates } from "./_data";
import { listStoredForms } from "./_store";

export default defineEventHandler(async () => {
  const stored = await listStoredForms();

  const templates = formTemplates
    .filter((t) => !stored.some((s) => s.id === t.id))
    .map(({ id, title, description, pages }) => ({
      id,
      title,
      description,
      pageCount: pages.length,
      isTemplate: true,
    }));

  const forms = stored.map((s) => ({
    id: s.id,
    name: s.name,
    title: s.config.title,
    description: s.config.description,
    pageCount: s.config.pages.length,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    isTemplate: false,
  }));

  return { forms, templates };
});
