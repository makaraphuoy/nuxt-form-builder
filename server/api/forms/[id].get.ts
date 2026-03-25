import { formTemplates } from "./_data";
import { getStoredForm } from "./_store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;

  // 1. Check builder-saved forms first (higher priority)
  const saved = await getStoredForm(id);
  if (saved) return saved.config;

  // 2. Fall back to static templates
  const template = formTemplates.find((f) => f.id === id);
  if (template) return template;

  throw createError({ statusCode: 404, message: `Form "${id}" not found` });
});
