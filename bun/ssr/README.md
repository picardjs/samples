# Picard.js with Bun (SSR)

A plain [Bun](https://bun.sh) server (`Bun.serve`) that renders micro frontends on the server, including an ES module micro frontend, and resumes them in the browser.

## What Picard.js Does Here

`picard-js/node` uses Node.js APIs, and Bun implements them, so Picard.js runs on Bun unchanged. The page has three kinds of micro frontends:

- The micro frontends of the demo feed, which only render in the browser (`server="none"`).
- [`pi-ssr-html`](../../shared/pi-ssr-html/): a pilet, rendered on the server and hydrated in the browser.
- [`nf-ssr-html`](../../shared/nf-ssr-html/): a Native Federation micro frontend, i.e., plain ES modules, rendered on the server and hydrated in the browser.

The last one is the interesting part. To evaluate ES modules on the server, Picard.js uses `vm.SourceTextModule`, an API that Node.js only offers with the `--experimental-vm-modules` flag. Bun supports it out of the box. The component shows *"rendered on the server by render.js"*, which proves that its module and the module it imports were linked and evaluated on the server.

## How It Is Integrated

Everything is in [`server.ts`](./server.ts):

```ts
import { getIslandsFile, initializePicard } from 'picard-js/node';

const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js',
});

const template = await Bun.file(new URL('./index.html', import.meta.url)).text();

Bun.serve({
  port,
  routes: {
    // the files of the islands script resuming the micro frontends in the browser
    '/picard/:file': (req) => {
      const content = getIslandsFile(req.params.file);
      // 404 or the content as text/javascript
    },
    // renders the micro frontends into the pi-* elements
    '/': async () => {
      const html = await picard.decorate(template);
      return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    },
  },
});
```

[`index.html`](./index.html) is the page template with the `pi-part` and `pi-component` elements:

```html
<pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
<pi-component name="ssr-likes" source="nf-ssr-html" data='{"likes":3}'></pi-component>
<pi-part name="script"></pi-part>
```

## Good to Know

- The template is decorated per request, so each page gets the current state of its micro frontends (e.g., data from the request could go into their `data` attributes first).
- `bun run typecheck` checks the server with TypeScript (Bun runs `.ts` files directly).

## Running

Requires Bun 1.2.3 or later (for the `routes` of `Bun.serve`).

```sh
bun install
bun start
```

Then open `http://localhost:3000`.

See [Deno](../../deno/ssr/) for the same server on Deno.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
