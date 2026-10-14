[![Picard.js Logo](https://picard.js.org/picard-logo-256.png)](https://picard.js.org)

# Picard.js Samples

Samples showing how [Picard.js](https://picard.js.org) brings micro frontends into all kinds of applications. They cover single-page apps, server-side rendering with streaming, static site generators, backends written in other languages, desktop and mobile apps, a browser extension, and unit tests.

- 🌐 Website and documentation: [picard.js.org](https://picard.js.org)
- 📦 Source code: [github.com/picardjs/picard](https://github.com/picardjs/picard)
- 📥 npm: [`picard-js`](https://www.npmjs.com/package/picard-js)

## Picard.js in a Nutshell

Picard.js is a micro frontend orchestrator: it loads micro frontends and mounts and unmounts the components they expose. It works the same way with any framework, because it only uses custom elements:

```html
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

`name` is the component and `source` is the micro frontend exposing it. The micro frontends are usually listed in a *feed*, i.e., a micro frontend discovery service. Picard.js loads micro frontends in several formats: pilets (Piral), Module Federation, and Native Federation. They can all be used side by side. Their components can follow Picard.js's own lifecycle, single-spa's, or be web components.

Picard.js can run in two places, and most samples use one of them:

**In the browser** (single-page apps, desktop and mobile apps). `picard-js/client` (or the plain browser script) defines the `pi-*` elements, which render their components as soon as they are in the DOM:

```ts
import { initializePicard } from 'picard-js/client';

initializePicard({ feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos' });
```

**On the server** (SSR and SSG). `picard-js/node` *decorates* HTML. It renders the components into the `pi-component` elements and replaces the `pi-part` elements with the styles (`<pi-part name="style">`) and with the state and the *islands script* (`<pi-part name="script">`). In the browser the islands script resumes the components: server-rendered ones are hydrated, and the others are rendered on the client.

```ts
import { getIslandsFile, initializePicard } from 'picard-js/node';

const picard = initializePicard({ feed, interactive: true, scriptUrl: '/picard/picard.js' });
const html = await picard.decorate(pageHtml); // e.g., in a middleware
const file = getIslandsFile('picard.js'); // served at /picard/:file
```

So integrating Picard.js on the server comes down to two questions: *where can I get at the HTML?* and *how do I serve the islands script?* Each framework answers them differently, and that's what the SSR and SSG samples show.

## The Samples

| Sample | Stack | Rendering | Where Picard.js is integrated | What it shows |
|---|---|---|---|---|
| [Angular SPA](./angular/spa/) | Angular 19 | Client | `main.ts` next to `bootstrapApplication` | `CUSTOM_ELEMENTS_SCHEMA` |
| [Angular SSR](./angular/ssr/) | Angular 19, Express | Server | `server.ts` decorates the response of the Angular engine | Angular hydration and Picard.js side by side |
| [ASP.NET Core](./aspnet/ssr/) | .NET 10, Razor Pages | Server | a middleware calls the [decorator service](./shared/picard-decorator/) | Server rendering from a backend not written in JavaScript |
| [Astro](./astro/ssg/) | Astro 7 | Static | middleware and a static endpoint for the islands script | Rendering at build time |
| [Browser extension](./extension/mv3/) | Chromium, Manifest V3 | Client | browser script and micro frontends bundled into the extension | A strict CSP without remote code |
| [Bun](./bun/ssr/) | Bun | Server | `Bun.serve` routes | Server-rendered ES modules (Native Federation) without flags |
| [Capacitor](./capacitor/app/) | Capacitor 8, Vite | Client | `picard-js/client` with a combined feed | Micro frontends bundled with the app and loaded from the internet |
| [Deno](./deno/ssr/) | Deno 2 | Server | `Deno.serve` with an `npm:` import | Server-rendered ES modules, minimal permissions |
| [Electron](./electron/client/) | Electron 35 | Client | browser script in the renderer's `index.html` | Picard.js in a `file://` page |
| [Hotwire Turbo](./turbo/ssr/) | Express, Turbo 8 | Server | each Express route decorates its page | Unmounting and resuming when Turbo swaps the `body` |
| [htmx](./htmx/ssr/) | Python, FastAPI, htmx 2 | Server | a Starlette middleware calls the [decorator service](./shared/picard-decorator/) | Server-rendered HTML fragments swapped in by htmx |
| [Hugo](./hugo/ssg/) | Hugo | Static | the [decorator CLI](./shared/picard-decorator/) runs after `hugo` | A static site generator not written in JavaScript |
| [Next.js](./next/ssr/) | Next.js 16, App Router | Server (streaming) | async Server Components in `Suspense` | Streaming SSR with React Server Components |
| [Nuxt](./nuxt/ssr/) | Nuxt 4 | Server | a Nitro plugin (`render:html` and `render:response`) | Vue hydration and Picard.js side by side |
| [Qwik](./qwik/ssg/) | Qwik City 1 | Static | `server$` function in a component | Resumability and Picard.js's islands |
| [React SPA](./react/spa/) | React 19, Vite | Client | `main.tsx` | Typing `pi-component` for JSX |
| [React Native](./react-native/app/) | Expo 57 | Client | a WebView (iOS, Android) and the DOM (web) | Apps without a DOM |
| [React Router](./react-router/ssr/) | React Router 8 (framework mode) | Server (streaming) | loaders return promises, rendered with `Await` | Streaming micro frontends in a second React framework |
| [Rsbuild](./rsbuild/mf/) | Rsbuild 2, Module Federation | Client | `bootstrap.ts` of a Module Federation host | A bundler's Module Federation runtime and Picard.js sharing remotes |
| [SolidStart](./solid/ssr/) | SolidStart 2 | Server | a middleware decorating the streamed page | Signals bound to the `data` of a micro frontend |
| [Svelte SPA](./svelte/spa/) | Svelte 5, Vite | Client | `main.ts` | Custom elements without configuration |
| [SvelteKit](./sveltekit/ssr/) | SvelteKit 3 | Server | `transformPageChunk` in `hooks.server.ts` | Decorating streamed chunks |
| [Tauri](./tauri/client/) | Tauri 2, Vite | Client | `main.ts` | Picard.js in a native webview |
| [Vitest](./vitest/testing/) | Vitest 5, jsdom, happy-dom | Tests | the page under test starts `picard-js/client` | Unit testing pages that use micro frontends |
| [Vue SPA](./vue/spa/) | Vue 3, Vite | Client | `main.ts` and `isCustomElement` | Telling the Vue compiler about custom elements |

*Client* means Picard.js renders the micro frontends in the browser. *Server* and *Static* mean they are rendered on the server or at build time and resumed in the browser.

## The Micro Frontends

All samples use the `picard-demos` feed (`https://feed.piral.cloud/api/v1/microfrontends/picard-demos`). Its micro frontends are framework-less on purpose, so each one exercises a different micro frontend format:

| Micro frontend | Format | Component | Rendering |
|---|---|---|---|
| `mf-simple-html` | Module Federation | `column` | Client only |
| `nfsimplehtml` | Native Federation | `column` | Client only |
| `pi-simple-html` | Pilet | `counter` | Client only |
| [`pi-ssr-html`](./shared/pi-ssr-html/) | Pilet | `ssr-counter` | Server and client (hydrated) |
| [`nf-ssr-html`](./shared/nf-ssr-html/) | Native Federation | `ssr-likes` | Server and client (hydrated) |

On the server, components that can only be rendered on the client are marked with `server="none"`, so the islands script renders them in the browser instead.

### Shared Code

- [`shared/pi-ssr-html`](./shared/pi-ssr-html/): the source of the `pi-ssr-html` pilet
- [`shared/nf-ssr-html`](./shared/nf-ssr-html/): the source of the `nf-ssr-html` Native Federation micro frontend
- [`shared/picard-decorator`](./shared/picard-decorator/): a small Node.js tool rendering micro frontends into HTML produced by something other than a Node.js server, as an HTTP service (`serve`) or a build step (`build`)

## Running a Sample

Each sample has its own README explaining what Picard.js does there, where exactly it is integrated, and how to run it. Most samples only need:

```sh
cd <sample>
npm install
npm run dev # or npm start
```

The samples require Node.js 22 or later (Node.js 24 recommended) and `picard-js` 0.3.0-pre.35 or later. Samples using other runtimes or languages (Bun, Deno, .NET, Python, Hugo, Rust) list their requirements in their README.
