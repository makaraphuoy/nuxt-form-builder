/**
 * Universal proxy handler for external API calls.
 *
 * Routes:  /api/proxy/** → external API (if configured) OR local Nitro routes
 *
 * Config (server-side env vars — never exposed to browser):
 *   NUXT_FORM_BUILDER_API_BASE   = https://api.example.com
 *   NUXT_FORM_BUILDER_API_KEY    = secret-key   (added as X-API-Key header)
 *   NUXT_FORM_BUILDER_API_TOKEN  = bearer-token (added as Authorization header)
 *
 * If no NUXT_FORM_BUILDER_API_BASE is set, requests are handled by local
 * Nitro routes using an internal $fetch — no HTTP loop, no extra network hop.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const fb = config.formBuilder as {
    apiBase?: string;
    apiKey?: string;
    apiToken?: string;
  };

  // Strip /api/proxy prefix → downstream path e.g. /address/provinces
  const path = event.path.replace(/^\/api\/proxy/, "");

  // ── No external API configured → call local Nitro route directly ──────────
  // Using $fetch here avoids an HTTP self-request loop.
  if (!fb?.apiBase) {
    return $fetch(`/api${path}`, {
      query: getQuery(event),
      method: event.method as any,
      ...(["POST", "PUT", "PATCH"].includes(event.method)
        ? { body: await readBody(event).catch(() => undefined) }
        : {}),
    });
  }

  // ── External API configured → proxy with auth headers ────────────────────
  const targetUrl = `${fb.apiBase.replace(/\/$/, "")}${path}`;

  const extraHeaders: Record<string, string> = {};
  if (fb.apiKey) extraHeaders["X-API-Key"] = fb.apiKey;
  if (fb.apiToken) extraHeaders["Authorization"] = `Bearer ${fb.apiToken}`;

  return proxyRequest(event, targetUrl, {
    headers: extraHeaders,
    fetchOptions: { redirect: "follow" },
  });
});
