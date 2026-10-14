# Picard.js with Deno (SSR)

A plain [Deno](https://deno.com) server (`Deno.serve`) that renders micro frontends on the server, including an ES module micro frontend, and resumes them in the browser.

## What Picard.js Does Here

Deno runs npm packages through `npm:` specifiers and implements the Node.js APIs that `picard-js/node` uses, so Picard.js runs on Deno unchanged. The page has three kinds of micro frontends:

- The micro frontends of the demo feed, which only render in the browser (`server="none"`).
- [`pi-ssr-html`](../../shared/pi-ssr-html/): a pilet, rendered on the server and hydrated in the browser.
- [`nf-ssr-html`](../../shared/nf-ssr-html/): a Native Federation micro frontend, i.e., plain ES modules, rendered on the server and hydrated in the browser.

For ES modules on the server Picard.js needs `vm.SourceTextModule`, which Node.js only offers with `--experimental-vm-modules`. Deno supports it out of the box. The component shows *"rendered on the server by render.js"*, so its imported module was evaluated on the server too.

## How It Is Integrated

**1. Import Picard.js.** [`deno.json`](./deno.json) maps the import to the npm package and defines the tasks:

```json
{
  "tasks": {
    "start": "deno run --allow-net --allow-read=. --allow-env main.ts"
  },
  "imports": {
    "picard-js/node": "npm:picard-js@^0.3.0-pre.35/node"
  }
}
```

**2. The server.** [`main.ts`](./main.ts):

```ts
import { getIslandsFile, initializePicard } from 'picard-js/node';

const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js',
});

const template = await Deno.readTextFile(new URL('./index.html', import.meta.url));
const islandsFile = new URLPattern({ pathname: '/picard/:file' });

Deno.serve({ port }, async (req) => {
  const url = new URL(req.url);
  const islands = islandsFile.exec(url);

  if (islands) {
    const content = getIslandsFile(islands.pathname.groups.file!);
    // 404 or the content as text/javascript
  }

  if (url.pathname === '/') {
    const html = await picard.decorate(template);
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  return new Response('Not found', { status: 404 });
});
```

[`index.html`](./index.html) is the page template with the `pi-part` and `pi-component` elements.

## Good to Know

- **Permissions.** Picard.js needs only network access (the feed and the micro frontends), read access to the template, and the environment (`PORT`). The task grants exactly that. Evaluating the micro frontends doesn't need write or run permissions.
- **Fresh releases.** Deno 2.9 doesn't install npm packages published less than 24 hours ago. To try a brand-new `picard-js` release, pass `--min-dep-age=0`.

## Running

Requires Deno 2.

```sh
deno task start
```

Then open `http://localhost:8000`.

See [Bun](../../bun/ssr/) for the same server on Bun.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
