/**
 * Builder-saved forms store using Nitro KV storage.
 * Persists to .data/db/forms/ — survives hot reloads & server restarts.
 */
import type { JSONFormConfig } from "~/utils/form-schema";

export interface SavedFormEntry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  config: JSONFormConfig;
}

const BASE = "db:forms";
const key = (id: string) => `${BASE}:${id}`;

export async function upsertForm(config: JSONFormConfig, name?: string): Promise<SavedFormEntry> {
  const existing = await useStorage().getItem<SavedFormEntry>(key(config.id));
  const now = new Date().toISOString();
  const entry: SavedFormEntry = {
    id: config.id,
    name: name ?? config.title,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    config,
  };
  await useStorage().setItem(key(config.id), entry);
  return entry;
}

export async function getStoredForm(id: string): Promise<SavedFormEntry | null> {
  return useStorage().getItem<SavedFormEntry>(key(id));
}

export async function deleteStoredForm(id: string): Promise<boolean> {
  const exists = await getStoredForm(id);
  if (!exists) return false;
  await useStorage().removeItem(key(id));
  return true;
}

export async function listStoredForms(): Promise<SavedFormEntry[]> {
  const keys = await useStorage().getKeys(BASE);
  const items = await Promise.all(keys.map((k) => useStorage().getItem<SavedFormEntry>(k)));
  return (items.filter(Boolean) as SavedFormEntry[]).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
