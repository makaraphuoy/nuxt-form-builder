import { upsertForm } from "./_store";
import type { JSONFormConfig } from "~/utils/form-schema";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ config: JSONFormConfig; name?: string }>(event);
  if (!body?.config?.id) {
    throw createError({ statusCode: 400, message: "config.id is required" });
  }
  const entry = await upsertForm(body.config, body.name);
  return { form: entry };
});
