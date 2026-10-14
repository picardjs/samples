# Picard.js with Electron

An Electron 35 desktop app (Electron Forge) whose renderer shows micro frontends loaded from the internet.

## What Picard.js Does Here

The renderer is a plain HTML page loaded from the file system (`file://`). There's no bundler, so it uses the *browser script* of Picard.js: a single script that defines the `pi-*` elements and reads its configuration from its own attributes. Picard.js fetches the `picard-demos` feed over HTTPS and renders three micro frontends: Module Federation (`mf-simple-html`), Native Federation (`nfsimplehtml`), and a pilet (`pi-simple-html`).

## How It Is Integrated

**1. Load the browser script.** [`src/index.html`](./src/index.html) references the script from the installed `picard-js` package. The `feed` attribute replaces a call to `initializePicard`:

```html
<script
  src="../node_modules/picard-js/dist/browser/picard.js"
  feed="https://feed.piral.cloud/api/v1/microfrontends/picard-demos"></script>
```

**2. Place the components.** Further down in the same file:

```html
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

The main process ([`src/index.js`](./src/index.js)) only opens the window with `win.loadFile(...)`; it knows nothing about Picard.js.

## Good to Know

- The page's origin is `file://`, while the micro frontends come from `https://`. That works because the feed and its assets are served with CORS headers. Your own micro frontends need them too.
- `picard-js` is a regular dependency, so Electron Forge packages it (within the asar archive) and the relative script path also works in the packaged app.
- In production you'd usually add a Content Security Policy. It has to allow the origins of your micro frontends (scripts and `connect-src` for the feed) and `blob:` scripts, which Picard.js uses to evaluate ES modules with shared dependencies.

## Running

```sh
npm install
npm start
```

`npm run make` creates the installers for your platform.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
