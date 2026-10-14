# Picard.js with Svelte (SPA)

A Svelte 5 single-page application created with Vite. It shows micro frontends in a Svelte component.

## What Picard.js Does Here

Picard.js runs in the browser. It loads the `picard-demos` feed and renders the components of three micro frontends into the `pi-component` elements of the Svelte markup. The three use different formats: Module Federation (`mf-simple-html`), Native Federation (`nfsimplehtml`), and a pilet (`pi-simple-html`).

## How It Is Integrated

**1. Initialize Picard.js.** [`src/main.ts`](./src/main.ts):

```ts
import { initializePicard } from 'picard-js/client'

initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
})
```

**2. Use the elements.** [`src/App.svelte`](./src/App.svelte). Svelte recognizes elements with a dash in their name as custom elements, so no configuration is needed:

```svelte
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

## Good to Know

- Svelte interprets curly braces in attribute values. Pass JSON data as an expression: `data={JSON.stringify(value)}` or `data={'{"start":5}'}`.
- Svelte sets attributes of custom elements as properties when they exist, so `data` arrives as a string property. Picard.js treats strings as serialized JSON and updates the component whenever the value changes.

## Running

```sh
npm install
npm run dev
```

Then open `http://localhost:5173`.

See [SvelteKit](../../sveltekit/ssr/) for server-rendered Svelte.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
