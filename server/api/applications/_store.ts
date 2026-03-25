/**
 * In-memory application store (simulates a database).
 * In production, replace with a real DB (Prisma, Drizzle, etc.).
 */

export interface Application {
  id: string;
  formId: string;
  serviceCode?: string;
  formTitle: string;
  status: "draft" | "submitted";
  data: Record<string, any>; // flat field values keyed by field name
  createdAt: string;
  updatedAt: string;
}

// Module-level store persists across requests within the same server process
const applications = new Map<string, Application>();

let seq = 1;

export function createApplication(payload: Omit<Application, "id" | "createdAt" | "updatedAt">): Application {
  const id = `app-${Date.now()}-${seq++}`;
  const now = new Date().toISOString();
  const app: Application = { id, ...payload, createdAt: now, updatedAt: now };
  applications.set(id, app);
  return app;
}

export function getApplication(id: string): Application | undefined {
  return applications.get(id);
}

export function updateApplication(id: string, patch: Partial<Pick<Application, "data" | "status">>): Application | undefined {
  const app = applications.get(id);
  if (!app) return undefined;
  Object.assign(app, patch, { updatedAt: new Date().toISOString() });
  return app;
}

export function listApplications(): Application[] {
  return [...applications.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
