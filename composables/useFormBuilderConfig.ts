/**
 * Global config for the form builder layer — CLIENT SIDE.
 *
 * All external API calls go through the server-side proxy at /api/proxy/*.
 * Secrets (API keys, tokens, external base URL) live in server env vars only:
 *
 *   NUXT_FORM_BUILDER_API_BASE   = https://api.example.com
 *   NUXT_FORM_BUILDER_API_KEY    = secret-key
 *   NUXT_FORM_BUILDER_API_TOKEN  = bearer-token
 *
 * Consumer projects can override this composable in their own project to add
 * dynamic client-side headers (e.g. user Bearer token from an auth store):
 *
 *   // composables/useFormBuilderConfig.ts  (overrides the layer's version)
 *   export function useFormBuilderConfig() {
 *     const auth = useAuthStore()
 *     return {
 *       proxyBase: '/api/proxy',
 *       headers: computed(() => ({
 *         Authorization: `Bearer ${auth.token}`,
 *       })),
 *     }
 *   }
 */

export interface FormBuilderConfig {
  /** Proxy prefix used by all client-side API calls. Default: "/api/proxy" */
  proxyBase: string;
  /** Optional client-side headers (e.g. user Bearer token). Non-sensitive only. */
  headers?: Record<string, string>;
}

export function useFormBuilderConfig(): FormBuilderConfig {
  return {
    proxyBase: "/api/proxy",
    headers: {},
  };
}
