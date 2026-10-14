# Picard.js with SvelteKit (SSR)

A SvelteKit 3 application (`adapter-node`) that renders micro frontends on the server and resumes them in the browser.

## What Picard.js Does Here

SvelteKit renders the page on the server, and Picard.js then renders the micro frontends into the `pi-component` elements of that HTML. SvelteKit offers a hook made for this kind of post-processing: `transformPageChunk` in `hooks.server.ts`. In the browser, Picard.js's islands script hydrates `pi-ssr-html` and renders the client-only micro frontends of the demo feed (`server="none"`).

## How It Is Integrated

**1. Initialize Picard.js on the server.** [`src/lib/server/picard.ts`](./src/lib/server/picard.ts). The `server` folder keeps it out of the client bundle:

```ts
export const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js'
});
```

**2. Decorate the page in the server hook.** [`src/hooks.server.ts`](./src/hooks.server.ts):

```ts
export const handle: Handle = async ({ event, resolve }) => {
  let html = '';

  return resolve(event, {
    async transformPageChunk(chunk) {
      // streamed pages come in multiple chunks - the micro frontends are rendered into the whole page
      html += chunk.html;
      return chunk.done ? picard.decorate(html) : '';
    }
  });
};
```

A streamed page (e.g., with promises returned from a `load` function) arrives in several chunks. The hook collects them and decorates the complete page with the last one.

**3. Place the parts.** [`src/app.html`](./src/app.html):

```html
<head>
  <pi-part name="style"></pi-part>
  %sveltekit.head%
</head>
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
  <pi-part name="script"></pi-part>
</body>
```

**4. Serve the islands script.** [`src/routes/picard/[file]/+server.ts`](./src/routes/picard/[file]/+server.ts) returns `getIslandsFile(params.file)`.

**5. Use the components.** [`src/routes/+page.svelte`](./src/routes/+page.svelte):

```svelte
<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
<pi-component name="ssr-counter" source="pi-ssr-html" data={'{"start":5}'}></pi-component>
```

## Good to Know

- Svelte interprets curly braces in attribute values, so JSON data is passed as an expression: `data={'{"start":5}'}`.
- In the browser, Svelte sets `data` as a string *property* on the hydrated element. Picard.js treats a string as serialized JSON, so the component gets `{ start: 5 }`.
- A full page load gets server-rendered micro frontends. Client-side navigations (SvelteKit's router) render the next page in the browser, so its micro frontends are rendered there. Try the *About* page both ways.
- Collecting the chunks gives up streaming for pages with micro frontends. To keep streaming, decorate individual parts instead, as the [React Router](../../react-router/ssr/) sample does.

## Running

```sh
npm install
npm run dev
```

For production:

```sh
npm run build
node build
```

Then open `http://localhost:5173` (development) or `http://localhost:3000` (production).

See [Svelte SPA](../../svelte/spa/) for the client-only variant.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
