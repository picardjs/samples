# Picard.js with React (SPA)

A React 19 single-page application created with Vite. It shows micro frontends inside React components.

## What Picard.js Does Here

Picard.js runs in the browser. It loads the `picard-demos` feed and renders the components of three micro frontends into the `pi-component` elements that React puts on the page. The three use different formats: Module Federation (`mf-simple-html`), Native Federation (`nfsimplehtml`), and a pilet (`pi-simple-html`). React owns the `pi-component` elements and Picard.js owns their content, so React never re-renders a micro frontend by accident.

## How It Is Integrated

**1. Initialize Picard.js once.** [`src/main.tsx`](./src/main.tsx) starts Picard.js before rendering the React tree:

```tsx
import { initializePicard } from "picard-js/client";

initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
});

createRoot(document.getElementById("root")!).render(<App />);
```

**2. Teach JSX about the element.** React accepts any custom element, but TypeScript needs to know its props. [`src/App.tsx`](./src/App.tsx) adds `pi-component` to the JSX intrinsic elements:

```tsx
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      ["pi-component"]: { name: string; source: string };
    }
  }
}
```

**3. Use it.** Again in [`src/App.tsx`](./src/App.tsx):

```tsx
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

## Good to Know

- When React unmounts a `pi-component` element (e.g., on a route change), Picard.js unmounts the micro frontend's component too.
- To pass data, set the `data` attribute to a JSON string (e.g., `data={JSON.stringify({ start: 5 })}`) and add `data?: string` to the typing. Picard.js updates the component when it changes.
- React 19 sets properties on custom elements where they exist. Picard.js accepts both: an object and a JSON string for `data`.

## Running

```sh
npm install
npm run dev
```

Then open `http://localhost:5173`.

See [Next.js](../../next/ssr/) and [React Router](../../react-router/ssr/) for server-rendered React, or [React Native](../../react-native/app/) for mobile.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
