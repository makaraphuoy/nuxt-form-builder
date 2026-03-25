/**
 * GET /api/applications
 */
import { listApplications } from "./_store";

export default defineEventHandler(async () => {
  return { applications: await listApplications() };
});
