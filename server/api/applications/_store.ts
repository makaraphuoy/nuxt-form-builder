/**
 * Application store using Nitro's built-in KV storage.
 * Data is persisted to .data/db/ in dev — survives hot reloads and server restarts.
 * In production, swap the driver in nitro.storage config (Redis, D1, etc.)
 */

export interface Application {
  id: string;
  formId: string;
  serviceCode?: string;
  formTitle: string;
  status: "draft" | "submitted";
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_BASE = "db:applications";

function key(id: string) {
  return `${STORAGE_BASE}:${id}`;
}

let seq = 1;

export async function createApplication(
  payload: Omit<Application, "id" | "createdAt" | "updatedAt">,
): Promise<Application> {
  const id = `app-${Date.now()}-${seq++}`;
  const now = new Date().toISOString();
  const app: Application = { id, ...payload, createdAt: now, updatedAt: now };
  await useStorage().setItem(key(id), app);
  return app;
}

export async function getApplication(id: string): Promise<Application | null> {
  return useStorage().getItem<Application>(key(id));
}

export async function updateApplication(
  id: string,
  patch: Partial<Pick<Application, "data" | "status">>,
): Promise<Application | null> {
  const app = await getApplication(id);
  if (!app) return null;
  const updated = { ...app, ...patch, updatedAt: new Date().toISOString() };
  await useStorage().setItem(key(id), updated);
  return updated;
}

export async function deleteApplication(id: string): Promise<boolean> {
  const exists = await getApplication(id);
  if (!exists) return false;
  await useStorage().removeItem(key(id));
  return true;
}

export async function listApplications(): Promise<Application[]> {
  const keys = await useStorage().getKeys(STORAGE_BASE);
  const items = await Promise.all(
    keys.map((k) => useStorage().getItem<Application>(k)),
  );
  return (items.filter(Boolean) as Application[]).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
