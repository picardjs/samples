# Picard.js with Capacitor

A Capacitor 8 app (Vite and TypeScript) that runs Picard.js inside the WebView of a native iOS or Android app. It shows micro frontends from the internet next to one bundled with the app.

## What Picard.js Does Here

Unlike the [React Native](../../react-native/app/) sample, the whole app is a web app here, so `picard-js/client` runs directly in the WebView. Capacitor serves the app from a local origin: `https://localhost` on Android and `capacitor://localhost` on iOS. That raises two questions this sample answers:

1. **Can micro frontends come from the device?** Yes. A micro frontend (`app-info`) is part of the app (`public/mfs/`) and listed in a local feed with a *relative* URL. Picard.js resolves it against the page, so it loads from the app's own origin and works offline.
2. **Can remote micro frontends be used, too?** Yes. The local feed is merged with the remote `picard-demos` feed. The remote micro frontends are loaded over HTTPS, which requires network access and CORS headers, since the app's origin is never theirs.

## How It Is Integrated

**1. Combine two feeds.** [`src/main.ts`](./src/main.ts) passes a function as the feed. Picard.js calls it once and uses the result:

```ts
const remoteFeed = 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos';
const localFeed = './feed.json';

initializePicard({
  async feed() {
    const [remote, local] = await Promise.all([loadJson(remoteFeed), loadJson(localFeed)]);
    return {
      ...remote,
      microFrontends: { ...remote.microFrontends, ...local.microFrontends },
    };
  },
});
```

**2. Describe the bundled micro frontend.** [`public/feed.json`](./public/feed.json) uses the same schema as the remote feed, but with a relative URL:

```json
"app-info": [
  {
    "url": "./mfs/app-info/index.js",
    "metadata": { "version": "1.0.0" },
    "extras": { "pilet": { "spec": "v2" }, "dependencies": {} }
  }
]
```

**3. The bundled micro frontend.** [`public/mfs/app-info/index.js`](./public/mfs/app-info/index.js) is a tiny pilet that shows the platform, the page's origin, and the URL it was loaded from (`_context.meta.url`). That makes it easy to check the origin handling on a device.

**4. Use the components.** `src/main.ts` renders the markup:

```html
<pi-component name="info" source="app-info"></pi-component>
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

[`capacitor.config.ts`](./capacitor.config.ts) points Capacitor to `dist`, which includes `feed.json` and `mfs/`.

## Good to Know

- A feed given as a function has no URL of its own, so relative URLs in it are resolved against the page, not against `feed.json`. Keep them relative to the page (here: `./mfs/...`).
- Updating a bundled micro frontend requires a new app release. Remote ones update without one, which is the point of mixing both.

## Running

In the browser:

```sh
npm install
npm run dev
```

On a device or emulator (requires the Android SDK or Xcode):

```sh
npm install @capacitor/android @capacitor/ios
npx cap add android # or ios
npm run sync
npx cap run android # or ios
```

The web layer has been tested in Chromium, also under `https://localhost` as used by the Android WebView. It hasn't been tested on a device.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
