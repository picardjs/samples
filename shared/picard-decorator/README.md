# picard-decorator: Picard.js for Any Backend

A small command line tool using `picard-js/node` to render micro frontends into HTML produced by something other than a Node.js server: an ASP.NET Core or Python backend, or a static site generator.

## Why It Exists

Server rendering micro frontends needs a JavaScript runtime, because the micro frontends are JavaScript. With a Node.js-based framework, Picard.js runs in-process (see the other SSR samples). Everything else needs Picard.js *next to* it. The decorator offers two ways:

- **As a service** (`serve`): the backend posts its HTML and gets it back decorated. Works for full pages and for fragments.
- **As a build step** (`build`): decorates all HTML files of a folder in place, e.g., the output of a static site generator.

Either way, the result is the same as with an in-process integration: the micro frontends are rendered into the `pi-component` elements, the `pi-part` elements are filled, and the islands script resumes everything in the browser.

## How It Works

[`cli.mjs`](./cli.mjs) initializes Picard.js once:

```js
const picard = initializePicard({
  feed: values.feed,
  interactive: true,
  scriptUrl,
});
```

**`serve`** starts an HTTP server with two endpoints:

- `POST /decorate` returns `picard.decorate(body)`.
- `GET /picard/<file>` returns `getIslandsFile(file)`, the islands script. Backends usually proxy `/picard/*` to it so the browser loads it from the page's origin.

**`build <dir>`** decorates every `.html` file in `<dir>` and writes the files of the islands script to where `--script-url` points (default: `<dir>/picard/`).

## Usage

```sh
npm install

npm start                     # or: node cli.mjs serve --port 5100
node cli.mjs build <dir>
```

Options:

- `--feed <url>`: the micro frontend discovery service (env: `PICARD_FEED`, default: the `picard-demos` feed)
- `--script-url <url>`: the URL of the islands script (default: `/picard/picard.js`)
- `--port <port>`: the port of the service (env: `PORT`, default: `5100`)

## Used By

- [ASP.NET Core](../../aspnet/ssr/): a middleware posting the HTML responses to `serve`
- [htmx](../../htmx/ssr/) (FastAPI): a middleware posting pages and htmx fragments to `serve`
- [Hugo](../../hugo/ssg/): `build public` after `hugo`

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
