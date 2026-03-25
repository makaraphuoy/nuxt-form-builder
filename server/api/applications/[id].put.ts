/**
 * PUT /api/applications/:id
 */
import { updateApplication } from "./_store";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const body = await readBody(event);

  if (!body?.data || typeof body.data !== "object")
    throw createError({ statusCode: 400, statusMessage: "data is required" });

  const app = await updateApplication(id, {
    data: body.data,
    status: body.status === "draft" ? "draft" : "submitted",
  });

  if (!app)
    throw createError({ statusCode: 404, statusMessage: `Application "${id}" not found` });

  return { success: true, application: app };
});
