/**
 * GET /api/applications/:id
 */
import { getApplication } from "./_store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const app = await getApplication(id);

  if (!app)
    throw createError({ statusCode: 404, statusMessage: `Application "${id}" not found` });

  return { application: app };
});
