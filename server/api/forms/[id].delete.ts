import { deleteStoredForm } from "./_store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const deleted = await deleteStoredForm(id);
  if (!deleted) {
    throw createError({ statusCode: 404, message: `Form "${id}" not found` });
  }
  return { success: true };
});
