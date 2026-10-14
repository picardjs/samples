# Picard.js with Nuxt (SSR)

A Nuxt 4 application that renders micro frontends on the server and resumes them in the browser, next to Vue's own hydration.

## What Picard.js Does Here

Nuxt renders the page with Vue on the server and hydrates it in the browser. Picard.js adds a step on the server. Once Nuxt has produced the HTML, Picard.js renders the micro frontends into the `pi-component` elements and adds the styles, the state, and the islands script. In the browser, the islands script hydrates `pi-ssr-html` and renders the client-only micro frontends of the demo feed (`server="none"`).

Vue's hydration and Picard.js don't conflict: on the client, Vue sees empty `pi-component` elements (custom elements whose content it doesn't manage), so it leaves their server-rendered content alone.

## How It Is Integrated

**1. A Nitro plugin.** Nuxt's server engine, Nitro, provides hooks for exactly this. [`server/plugins/picard.ts`](./server/plugins/picard.ts) uses two of them:

```ts
const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js',
})

export default defineNitroPlugin((nitroApp) => {
  // places the styles and the state / islands script of Picard.js
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.push('<pi-part name="style"></pi-part>')
    html.bodyAppend.push('<pi-part name="script"></pi-part>')
  })

  // renders the micro frontends into the pi-component elements
  nitroApp.hooks.hook('render:response', async (response) => {
    if (typeof response.body === 'string') {
      response.body = await picard.decorate(response.body)
    }
  })
})
```

`render:html` adds the `pi-part` placeholders to the document Nuxt is building. `render:response` gets the finished HTML, which Picard.js decorates.

**2. Serve the islands script.** [`server/routes/picard/[file].ts`](./server/routes/picard/[file].ts):

```ts
export default defineEventHandler((event) => {
  const content = getIslandsFile(getRouterParam(event, 'file') || '')

  if (content === undefined) {
    throw createError({ statusCode: 404 })
  }

  setResponseHeader(event, 'content-type', 'text/javascript')
  return content
})
```

**3. Tell Vue about custom elements.** [`nuxt.config.ts`](./nuxt.config.ts):

```ts
vue: {
  compilerOptions: {
    isCustomElement: (tag) => tag.startsWith('pi-'),
  },
},
```

**4. Use the components.** [`app/app.vue`](./app/app.vue):

```html
<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
<pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
```

## Good to Know

- Client-side navigations in Nuxt render the next page with Vue in the browser, so its micro frontends are rendered there too. Only full page loads get server-rendered micro frontends.
- Binding data (`:data="JSON.stringify(value)"`) works after hydration as well: Picard.js accepts the JSON string and updates the component.

## Running

```sh
npm install
npm run dev
```

For production:

```sh
npm run build
npm run preview
```

Then open `http://localhost:3000`.

See [Vue SPA](../../vue/spa/) for the client-only variant.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
