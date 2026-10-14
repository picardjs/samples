// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vue: {
    compilerOptions: {
      // the pi-* elements are custom elements provided by Picard.js
      isCustomElement: (tag) => tag.startsWith('pi-'),
    },
  },
})
