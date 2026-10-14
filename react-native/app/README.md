# Picard.js with React Native (Expo)

An Expo 57 (React Native) app showing micro frontends on iOS, Android, and the web, from a single code base.

## What Picard.js Does Here

Micro frontends are web code: they render into DOM elements. React Native has no DOM on iOS and Android, so Picard.js can't run in the app's JavaScript runtime. The sample therefore uses two strategies, chosen by Metro's platform-specific file extensions:

- **iOS and Android**: a `react-native-webview` hosts a small HTML page that runs Picard.js's browser script.
- **Web** (react-native-web): there is a DOM, so the `pi-component` elements are rendered directly and Picard.js's browser script is added to the page.

Both use the same markup and render the same three micro frontends: Module Federation (`mf-simple-html`), Native Federation (`nfsimplehtml`), and a pilet (`pi-simple-html`).

## How It Is Integrated

**1. Shared configuration.** [`components/picard.ts`](./components/picard.ts) defines the feed, the markup, and the URL of the browser script. The script URL uses the installed version of `picard-js`:

```ts
import { version } from 'picard-js/package.json';

export const feed = 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos';
export const scriptUrl = `https://unpkg.com/picard-js@${version}/dist/browser/picard.js`;

export const page = `<!DOCTYPE html>
<html>
<head>
<script src="${scriptUrl}" feed="${feed}"></script>
</head>
<body>${markup}</body>
</html>`;
```

**2. Native platforms.** [`components/MicroFrontends.tsx`](./components/MicroFrontends.tsx) renders that page in a WebView. The `baseUrl` gives the page a proper `https://` origin instead of `about:blank`:

```tsx
<WebView originWhitelist={['*']} source={{ html: page, baseUrl: 'https://localhost/' }} />
```

**3. Web.** [`components/MicroFrontends.web.tsx`](./components/MicroFrontends.web.tsx) inserts the markup and loads the browser script once:

```tsx
export default function MicroFrontends() {
  useEffect(loadPicard, []);
  // React must not touch the markup, which is owned by Picard.js
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
```

[`App.tsx`](./App.tsx) just renders `<MicroFrontends />`. Metro picks the right file per platform.

## Good to Know

- **Why not `picard-js/client`?** Metro can't bundle it: it loads ES modules from URLs only known at runtime (`import(url)`), which Metro doesn't support. The browser script sidesteps the bundler.
- The micro frontends in the WebView are isolated from the React Native app. To talk to them, use the WebView's messaging (`postMessage` / `onMessage`), e.g., from an event handler in a micro frontend.
- Each WebView is a separate browser context, so put all micro frontends of a screen into one WebView instead of one WebView per component.

## Running

```sh
npm install
npm start
```

Then open the app in Expo Go or an emulator, or press `w` for the web.

See [Capacitor](../../capacitor/app/) for running `picard-js/client` itself inside a native app's WebView.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
