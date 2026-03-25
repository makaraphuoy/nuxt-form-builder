/**
 * POST /api/applications
 */
import { createApplication } from "./_store";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body?.formId)
    throw createError({ statusCode: 400, statusMessage: "formId is required" });
  if (!body?.data || typeof body.data !== "object")
    throw createError({ statusCode: 400, statusMessage: "data is required" });

  const app = await createApplication({
    formId: body.formId,
    serviceCode: body.serviceCode,
    formTitle: body.formTitle ?? "Untitled Form",
    status: body.status === "draft" ? "draft" : "submitted",
    data: body.data,
  });

  return { success: true, application: app };
});
