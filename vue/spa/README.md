# Picard.js with Vue (SPA)

A Vue 3 single-page application created with Vite. It shows micro frontends in a single-file component.

## What Picard.js Does Here

Picard.js runs in the browser. It loads the `picard-demos` feed and renders the components of three micro frontends into the `pi-component` elements of the Vue template. The three use different formats: Module Federation (`mf-simple-html`), Native Federation (`nfsimplehtml`), and a pilet (`pi-simple-html`). Vue creates the elements and Picard.js fills them.

## How It Is Integrated

**1. Initialize Picard.js.** [`src/main.ts`](./src/main.ts) starts Picard.js next to the Vue app:

```ts
import { initializePicard } from 'picard-js/client'

initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
})

createApp(App).mount('#app')
```

**2. Tell the compiler about custom elements.** By default Vue tries to resolve `pi-component` as a Vue component and warns that it can't find one. [`vite.config.ts`](./vite.config.ts) marks all `pi-*` tags as custom elements:

```ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('pi-'),
    },
  },
})
```

**3. Use the elements.** In [`src/App.vue`](./src/App.vue):

```html
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

## Good to Know

- Bind data with `:data="JSON.stringify(value)"`. Vue sets it as a property, and Picard.js accepts both objects and JSON strings, then updates the component.
- `isCustomElement` is a compile-time option. With in-browser template compilation, set `app.config.compilerOptions.isCustomElement` instead.

## Running

```sh
npm install
npm run dev
```

Then open `http://localhost:5173`.

See [Nuxt](../../nuxt/ssr/) for server-rendered Vue.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
