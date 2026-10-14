# Picard.js with Next.js (SSR)

A Next.js 16 application (App Router, Cache Components) that renders micro frontends with React Server Components, streams them to the browser, and resumes them there.

## What Picard.js Does Here

Next.js streams its HTML, and there's no single point where the whole document passes by as a string. So instead of decorating the page afterwards, each micro frontend is rendered by its own async Server Component. That component asks Picard.js for the server-rendered markup of one `pi-component`. Because the components sit in `Suspense` boundaries, the rest of the page doesn't wait for them; they stream in once they're ready.

In the browser, Picard.js's islands script resumes the micro frontends: `pi-ssr-html` is hydrated, and the client-only micro frontends of the demo feed (`server="none"`) are rendered.

## How It Is Integrated

**1. Server Components for Picard.js.** [`lib/picard.tsx`](./lib/picard.tsx) initializes `picard-js/node` and exports two components. `PicardComponent` renders one component of a micro frontend:

```tsx
export async function PicardComponent({ name, source, data, server }: PicardComponentProps) {
  await connection();
  const attributes = [
    `name="${escapeAttribute(name)}"`,
    `source="${escapeAttribute(source)}"`,
    data !== undefined && `data="${escapeAttribute(JSON.stringify(data))}"`,
    server && `server="${server}"`,
  ].filter(Boolean);
  const html = await picard.decorate(`<pi-component ${attributes.join(" ")}></pi-component>`);
  return <Html html={html} />;
}
```

`PicardScript` renders the state and the islands script (`<pi-part name="script">`). `await connection()` opts out of prerendering, so the components render per request. The markup goes in through `dangerouslySetInnerHTML` inside a `display: contents` wrapper, so React never touches what Picard.js owns:

```tsx
function Html({ html }: { html: string }) {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}
```

**2. Use them in pages.** [`app/page.tsx`](./app/page.tsx):

```tsx
<Suspense>
  <PicardComponent name="ssr-counter" source="pi-ssr-html" data={{ start: 5 }} />
</Suspense>
<Suspense>
  <PicardComponent name="counter" source="pi-simple-html" server="none" />
</Suspense>
```

**3. Add the islands script.** [`app/layout.tsx`](./app/layout.tsx) places it at the end of the body:

```tsx
<body>
  {children}
  <Suspense>
    <PicardScript />
  </Suspense>
</body>
```

**4. Serve the islands script.** [`app/picard/[file]/route.ts`](./app/picard/[file]/route.ts) is a route handler returning `getIslandsFile(file)`.

**5. Keep `picard-js` out of the server bundle.** [`next.config.ts`](./next.config.ts):

```ts
serverExternalPackages: ["picard-js"],
```

Picard.js loads micro frontends at runtime, which a bundled copy can't do reliably.

## Good to Know

- **Streaming moves elements.** React inserts streamed `Suspense` content into a hidden container first and moves it into place afterwards. Picard.js keeps an already resumed micro frontend when its element is moved, so it isn't rendered twice.
- There's no `<pi-part name="style">`: the head is rendered before the micro frontends are known. The islands script adds the styles from the state instead, so server-rendered content can show unstyled for a moment. The [React Router](../../react-router/ssr/) sample streams the style part into the body to avoid that.
- Because the Server Components render per request, a client-side navigation also gets server-rendered (and then hydrated) micro frontends for the next page.

## Running

Requires Node.js 20.9 or later.

```sh
npm install
npm run dev
```

For production:

```sh
npm run build
npm start
```

Then open `http://localhost:3000`.

See [React Router](../../react-router/ssr/) for another streaming React framework.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
