# Picard.js with Hotwire Turbo (SSR)

A plain Express 5 server with server-rendered pages and [Turbo Drive](https://turbo.hotwired.dev) for navigation. It shows how micro frontends survive Turbo replacing the page's `body`.

## What Picard.js Does Here

Every page is rendered on the server, and Picard.js renders its micro frontends into it. In the browser the islands script resumes them: `pi-ssr-html` is hydrated, and the client-only micro frontends of the demo feed (`server="none"`) are rendered.

Turbo Drive then makes the site feel like a single-page app. On a link click it fetches the next page and *swaps the `body`* instead of loading it from scratch. For Picard.js that's a stress test:

1. The `pi-component` elements of the old page are removed, so their micro frontends are **unmounted**.
2. The new page's `pi-component` elements arrive with server-rendered content, so they're **resumed**: `pi-ssr-html` is hydrated again and the others are rendered.

The islands script is loaded only once. It stays active across the swaps and handles the new elements like any others.

## How It Is Integrated

Everything is in [`server.mjs`](./server.mjs):

**1. Initialize Picard.js.**

```js
const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js',
});
```

**2. Decorate each page.** A tiny template engine puts each view into the layout, and the result goes through `picard.decorate`:

```js
for (const [path, page] of Object.entries(pages)) {
  app.get(path, async (_req, res, next) => {
    try {
      res.type('html').send(await picard.decorate(await renderPage(page)));
    } catch (error) {
      next(error);
    }
  });
}
```

**3. Serve the islands script.**

```js
app.get('/picard/:file', (req, res) => {
  const content = getIslandsFile(req.params.file);
  // 404 or the content as text/javascript
});
```

**4. The layout.** [`views/layout.html`](./views/layout.html) loads Turbo and contains the `pi-part` elements. The pages ([`views/index.html`](./views/index.html), [`views/more.html`](./views/more.html), [`views/about.html`](./views/about.html)) contain the `pi-component` elements:

```html
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.23/dist/turbo.es2017-esm.js"></script>
  <pi-part name="style"></pi-part>
</head>
<body>
  <nav>...</nav>
  <div class="container">{{content}}</div>
  <pi-part name="script"></pi-part>
</body>
```

## Good to Know

- **Links stay Turbo's.** Picard.js only intercepts link clicks for its own client-side routing, i.e., when the page has a `<pi-slot rel="router">`. Otherwise the browser, or Turbo, handles navigation.
- **Turbo's cache.** Turbo takes a snapshot of a page for its cache *after* leaving it, when Picard.js has already unmounted the micro frontends. A page restored from the cache (e.g., going back) therefore renders its micro frontends in the browser. When Turbo then fetches the fresh page, they're server-rendered and hydrated again.
- The islands script keeps the state of the first page it was loaded with. Pages share the same feed, so that state already covers every page's micro frontends.

## Running

```sh
npm install
npm start
```

Then open `http://localhost:3000`, click a counter, and navigate between *Home*, *More*, and *About*.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
