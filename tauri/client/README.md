# Picard.js with Tauri

A Tauri 2 desktop app with a vanilla TypeScript frontend (Vite) that shows micro frontends loaded from the internet.

## What Picard.js Does Here

Tauri renders the frontend in the operating system's webview (WebView2, WKWebView, or WebKitGTK). Picard.js runs there like on any website: it fetches the `picard-demos` feed and renders three micro frontends into the `pi-component` elements: Module Federation (`mf-simple-html`), Native Federation (`nfsimplehtml`), and a pilet (`pi-simple-html`). The Rust side of the app isn't involved.

## How It Is Integrated

**1. Initialize Picard.js.** [`src/main.ts`](./src/main.ts) is bundled by Vite together with `picard-js/client`:

```ts
import { initializePicard } from "picard-js/client";

initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
});
```

**2. Place the components.** In [`index.html`](./index.html):

```html
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

**3. Allow remote code.** Tauri can enforce a Content Security Policy. [`src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json) leaves it unset (`"csp": null`), so the webview may load the micro frontends from their origins.

## Good to Know

- If you configure a CSP, allow the origins of the feed and the micro frontends (`script-src`, `connect-src`, `style-src`) and `blob:` scripts (`script-src blob:`). Picard.js evaluates ES modules with shared dependencies via `blob:` URLs.
- The app's origin is `tauri://localhost` (macOS, Linux) or `http://tauri.localhost` (Windows), so the micro frontends must be served with CORS headers, like the demo feed is.

## Running

Requires Rust and the [Tauri prerequisites](https://tauri.app/start/prerequisites/).

```sh
npm install
npm run tauri dev
```

`npm run tauri build` creates the installers. `npm run dev` runs only the frontend in the browser (`http://localhost:1420`).

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
