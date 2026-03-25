// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/leaflet"],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
  },
  nitro: {
    storage: {
      // Persists to .data/db/ — survives hot reloads & server restarts
      db: { driver: "fs", base: "./.data/db" },
    },
  },

  //Form Builder global config 
  // Private (server-only) — set via env vars, never exposed to the browser:
  //   NUXT_FORM_BUILDER_API_BASE   = https://api.example.com
  //   NUXT_FORM_BUILDER_API_KEY    = secret-key
  //   NUXT_FORM_BUILDER_API_TOKEN  = bearer-token
  //
  // Public — available on client (non-sensitive only):
  //   NUXT_PUBLIC_FORM_BUILDER_PROXY_BASE = /api/proxy  (default, rarely changed)
  runtimeConfig: {
    formBuilder: {
      apiBase: "",    // NUXT_FORM_BUILDER_API_BASE
      apiKey: "",     // NUXT_FORM_BUILDER_API_KEY
      apiToken: "",   // NUXT_FORM_BUILDER_API_TOKEN
    },
    public: {},
  },
});
