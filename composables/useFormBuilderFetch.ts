/**
 * Fetch wrapper that routes all external API calls through the server-side proxy.
 * Headers from useFormBuilderConfig (e.g. user auth token) are merged in.
 */
export function useFormBuilderFetch() {
  const { proxyBase, headers } = useFormBuilderConfig();

  async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    // Strip leading /api if present — proxy already provides the /api prefix via local fallback
    const cleanPath = path.startsWith("/api/") ? path.slice(4) : path;
    const url = `${proxyBase}${cleanPath}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

    if (!res.ok) throw new Error(`[FormBuilder] ${res.status} — ${url}`);
    return res.json() as Promise<T>;
  }

  return { apiFetch, proxyBase };
}
