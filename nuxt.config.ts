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
});
