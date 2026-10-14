import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // the pi-* elements are custom elements provided by Picard.js
          isCustomElement: (tag) => tag.startsWith('pi-'),
        },
      },
    }),
  ],
})
