# Picard.js in a Browser Extension (Manifest V3)

A Chromium extension (Manifest V3) whose page shows micro frontends rendered by Picard.js, with all code bundled into the extension.

## What Picard.js Does Here

Extension pages run under a strict Content Security Policy: `script-src 'self'`. Only code that ships with the extension may run, so there are no remote scripts, no inline scripts, and no `eval`. Browser stores require the same for review. Loading micro frontends from the internet is therefore off the table.

The sample turns this around: **the micro frontends are bundled at build time.** A build script downloads the micro frontends of the `picard-demos` feed into the extension and writes a local `feed.json` that references them with relative URLs. At runtime, Picard.js works as usual. It reads the feed and loads the micro frontends, just from `chrome-extension://` instead of the internet.

## How It Is Integrated

**1. The page.** [`src/page.html`](./src/page.html) loads the browser script of Picard.js from the extension. Because inline scripts are forbidden, the feed is given as an attribute:

```html
<script src="picard/picard.js" feed="feed.json"></script>

<pi-component name="column" source="mf-simple-html" fallback-template-id="not-bundled"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>

<template id="not-bundled">
  <p>This micro frontend is not part of the extension.</p>
</template>
```

**2. The build.** [`scripts/build.mjs`](./scripts/build.mjs) produces `dist/`:

- It copies `src/` (the manifest, the background service worker, and the page).
- It copies the browser variant of Picard.js (`node_modules/picard-js/dist/browser`) to `picard/`.
- It downloads each micro frontend of the feed into `mfs/<name>/`, including every file it references relatively (chunks, imports, styles), and rewrites the feed:

```js
microFrontends[name] = [{ ...definition, url: `./mfs/${name}/${definition.url.substring(base.length)}` }];
```

For a pilet, the entry module is the starting point. For a Native Federation micro frontend, it's the remote entry plus its exposed and shared modules.

**3. The extension.** [`src/manifest.json`](./src/manifest.json) declares an action, and [`src/background.js`](./src/background.js) opens the page when it's clicked:

```js
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('page.html') });
});
```

## Good to Know

- **Module Federation containers can't be bundled** this way. They load their chunks by names computed at runtime, which are only known from an `mf-manifest.json`, and `mf-simple-html` doesn't have one. The build skips it and the page shows the fallback template.
- **ES modules without `blob:`.** Picard.js normally evaluates ES modules (Native Federation) via `blob:` scripts, so it can resolve their shared dependencies. The extension's CSP forbids those. When a module has no shared dependencies to resolve, Picard.js falls back to a native `import()`. The console still shows the CSP violation of the first attempt.
- **Updates need a release.** Updating a micro frontend means rebuilding and republishing the extension, as the stores require for any code change.

## Running

```sh
npm install
npm run build
```

Then load the `dist` folder as an unpacked extension (`chrome://extensions`, developer mode) and click the extension's toolbar button.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
