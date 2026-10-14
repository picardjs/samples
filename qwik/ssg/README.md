# Picard.js with Qwik (SSG)

A Qwik City 1 site generated statically (static adapter). The micro frontends are rendered at build time and resumed in the browser.

## What Picard.js Does Here

Qwik doesn't hydrate: it *resumes* the application from the HTML and loads code only when you interact with it. Picard.js's islands script works similarly for micro frontends. It resumes the server-rendered ones (here: `pi-ssr-html`) and renders only those that can't be rendered on the server (`server="none"`).

Picard.js is called from Qwik components through a `server$` function. So it only ever runs on the server, here while the static pages are generated, and never becomes part of the client bundle.

## How It Is Integrated

**1. Initialize Picard.js on the server.** [`src/lib/picard.ts`](./src/lib/picard.ts):

```ts
export const picard = initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
  interactive: true,
  scriptUrl: "/picard/picard.js",
});
```

**2. Components rendering micro frontends.** [`src/components/picard/picard.tsx`](./src/components/picard/picard.tsx) wraps `picard.decorate` in a `server$` function and uses it in a task:

```tsx
const decorate = server$(async (markup: string) => {
  const { picard } = await import("~/lib/picard");
  return await picard.decorate(markup);
});

export const PicardComponent = component$<PicardComponentProps>(({ name, source, data, server }) => {
  const html = useSignal("");

  useTask$(async () => {
    // builds <pi-component name="..." source="..." data="..."> from the props
    html.value = await decorate(`<pi-component ${attributes.join(" ")}></pi-component>`);
  });

  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={html.value} />;
});
```

`PicardScript` does the same for `<pi-part name="script">`, i.e., the state and the islands script.

**3. Use them.** [`src/routes/index.tsx`](./src/routes/index.tsx) uses `PicardComponent` and [`src/root.tsx`](./src/root.tsx) places `PicardScript` at the end of the body:

```tsx
<PicardComponent name="counter" source="pi-simple-html" server="none" />
<PicardComponent name="ssr-counter" source="pi-ssr-html" data={{ start: 5 }} />
```

**4. Generate the islands script.** [`src/routes/picard/[file]/index.ts`](./src/routes/picard/[file]/index.ts) serves the files in development and lists them for the static generation:

```ts
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: getIslandsFileNames().map((file) => ({ file })),
  };
};
```

## Good to Know

- The markup is inserted with `dangerouslySetInnerHTML`. Qwik resumes instead of re-rendering, so it never touches the content Picard.js owns.
- The origin of the deployed site is configured in [`adapters/static/vite.config.ts`](./adapters/static/vite.config.ts).

## Running

```sh
npm install
npm start
```

Then open `http://localhost:5173`. For the static build:

```sh
npm run build
npm run preview
```

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
