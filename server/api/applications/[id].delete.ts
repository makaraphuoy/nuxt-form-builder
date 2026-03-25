/**
 * DELETE /api/applications/:id
 */
import { deleteApplication } from "./_store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const ok = await deleteApplication(id);

  if (!ok)
    throw createError({ statusCode: 404, statusMessage: `Application "${id}" not found` });

  return { success: true };
});
