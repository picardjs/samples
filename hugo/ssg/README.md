# Picard.js with Hugo (SSG)

A [Hugo](https://gohugo.io) site whose micro frontends are rendered when the site is built and resumed in the browser. It shows how to use Picard.js with a static site generator that isn't written in JavaScript.

## What Picard.js Does Here

Hugo can't call JavaScript while it renders, so Picard.js runs as a **second build step**. After `hugo` has written the site to `public/`, the [`shared/picard-decorator`](../../shared/picard-decorator/) CLI decorates every HTML file in place. It renders the micro frontends into the `pi-component` elements, fills the `pi-part` elements, and writes the islands script to `public/picard/`. The result is still a plain static site.

In the browser, the islands script hydrates `pi-ssr-html`, which was rendered at build time, and renders the client-only micro frontends of the demo feed (`server="none"`).

## How It Is Integrated

**1. The build.** [`package.json`](./package.json) chains both steps:

```json
"build": "hugo --minify=false && node ../../shared/picard-decorator/cli.mjs build public"
```

The decorator CLI is a thin wrapper around `picard-js/node`. For each HTML file it does:

```js
await writeFile(file, await picard.decorate(html));
```

and afterwards writes every file from `getIslandsFileNames()` to `public/picard/`.

**2. The layout.** [`layouts/baseof.html`](./layouts/baseof.html) places the `pi-part` elements once for all pages:

```html
<head>
  <pi-part name="style"></pi-part>
</head>
<body>
  {{ block "main" . }}{{ end }}
  <pi-part name="script"></pi-part>
</body>
```

**3. Micro frontends in layouts.** [`layouts/home.html`](./layouts/home.html):

```html
<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
<pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
```

**4. Micro frontends in Markdown.** [`content/about.md`](./content/about.md) uses a `pi-component` right in the content:

```md
Micro frontends can also be placed in the Markdown content:

<div class="d-flex p-2 justify-content-center">
  <pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":42}'></pi-component>
</div>
```

That requires raw HTML in Markdown, enabled in [`hugo.toml`](./hugo.toml):

```toml
[markup.goldmark.renderer]
  unsafe = true
```

## Good to Know

- `--minify=false` keeps Hugo from minifying the HTML before Picard.js sees it. Minify afterwards if needed.
- `hugo server` serves the pages without the second step, so the micro frontends aren't rendered there. Use `npm run build && npm run preview`.
- The same approach works for any static site generator (Jekyll, Eleventy, MkDocs, ...): generate, then run the decorator CLI on the output folder.
- Picard.js only intercepts link clicks for its own client-side routing (a `<pi-slot rel="router">`), so the links between the pages work as usual.

## Running

Requires Hugo and Node.js.

```sh
(cd ../../shared/picard-decorator && npm install)
npm run build
npm run preview
```

Then open `http://localhost:1313`.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
