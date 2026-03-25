/**
 * Client-side localStorage store for applications tied to local forms.
 * Mirrors the same shape as the server Application type.
 */

export interface LocalApplication {
  id: string;
  formId: string;
  serviceCode?: string;
  formTitle: string;
  status: "draft" | "submitted";
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  _local: true; // discriminator — always true for localStorage apps
}

const STORAGE_KEY = "esb-local-applications";
let _seq = 1;

function readAll(): LocalApplication[] {
  if (!import.meta.client) return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(apps: LocalApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

export function useApplicationStorage() {
  const applications = ref<LocalApplication[]>([]);

  function refresh() {
    applications.value = readAll().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  function createApplication(
    payload: Omit<LocalApplication, "id" | "createdAt" | "updatedAt" | "_local">,
  ): LocalApplication {
    const id = `local-app-${Date.now()}-${_seq++}`;
    const now = new Date().toISOString();
    const app: LocalApplication = { ...payload, id, createdAt: now, updatedAt: now, _local: true };
    const all = readAll();
    all.push(app);
    writeAll(all);
    refresh();
    return app;
  }

  function getApplication(id: string): LocalApplication | null {
    return readAll().find((a) => a.id === id) ?? null;
  }

  function updateApplication(
    id: string,
    patch: Partial<Pick<LocalApplication, "data" | "status">>,
  ): LocalApplication | null {
    const all = readAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    writeAll(all);
    refresh();
    return all[idx];
  }

  function deleteApplication(id: string): boolean {
    const all = readAll();
    const filtered = all.filter((a) => a.id !== id);
    if (filtered.length === all.length) return false;
    writeAll(filtered);
    refresh();
    return true;
  }

  onMounted(refresh);

  return { applications, refresh, createApplication, getApplication, updateApplication, deleteApplication };
}

/** True if this application ID belongs to localStorage */
export function isLocalApplicationId(id: string) {
  return id.startsWith("local-app-");
}
