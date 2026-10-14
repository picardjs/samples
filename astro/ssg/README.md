# Picard.js with Astro (SSG)

An Astro 7 site generated statically. The micro frontends are rendered when the site is built and resumed in the browser, with no server at runtime.

## What Picard.js Does Here

Astro renders each page to HTML at build time. Picard.js plugs into that process: an Astro middleware sends every generated page through `picard.decorate`, which renders the micro frontends into the `pi-component` elements. The islands script that resumes them is generated as static files next to the pages. The result in `dist/` is plain HTML and JavaScript, so any static host can serve it.

In the browser, the islands script hydrates `pi-ssr-html`, which was rendered at build time, and renders the client-only micro frontends of the demo feed (`server="none"`).

## How It Is Integrated

**1. A middleware decorating the pages.** [`src/middleware.ts`](./src/middleware.ts). Astro runs middleware when it generates static pages, and per request in `astro dev`:

```ts
const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js',
});

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  if (!response.headers.get('content-type')?.includes('text/html')) {
    return response;
  }

  const html = await picard.decorate(await response.text());
  return new Response(html, { status: response.status, headers: response.headers });
});
```

**2. Generate the islands script.** [`src/pages/picard/[file].ts`](./src/pages/picard/[file].ts) is a static endpoint. `getStaticPaths` lists the files of the islands script, so Astro writes each of them to `dist/picard/`:

```ts
export const getStaticPaths = (() =>
  getIslandsFileNames().map((file) => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(getIslandsFile(params.file!), {
    headers: { 'content-type': 'text/javascript' },
  });
```

**3. Place the elements.** [`src/pages/index.astro`](./src/pages/index.astro):

```html
<head>
  <pi-part name="style"></pi-part>
</head>
<body>
  <pi-component name="column" source="mf-simple-html" server="none"></pi-component>
  <pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
  <pi-part name="script"></pi-part>
</body>
```

## Good to Know

- **Astro has islands, too.** Astro's islands are framework components hydrated by Astro. Picard.js's islands are micro frontends hydrated by Picard.js. Both can be on the same page because neither touches the other's elements.
- The micro frontends are rendered with the data known at build time. If a micro frontend gets a new version, the site has to be rebuilt to include its new server-rendered markup. Client-only micro frontends always load the latest version from the feed.

## Running

Requires Node.js 22.12 or later.

```sh
npm install
npm run dev
```

Then open `http://localhost:4321`. For the static build:

```sh
npm run build
npm run preview
```

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
