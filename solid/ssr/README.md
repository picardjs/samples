# Picard.js with SolidStart (SSR)

A SolidStart 2 application (Vite and Nitro) that renders micro frontends on the server, resumes them in the browser, and updates them with Solid's fine-grained reactivity.

## What Picard.js Does Here

SolidStart streams the server-rendered page. A SolidStart middleware collects it and lets Picard.js render the micro frontends into the `pi-component` elements. In the browser, the islands script hydrates `pi-ssr-html` and renders the client-only micro frontends of the demo feed (`server="none"`).

Then Solid takes over. Solid has no virtual DOM: a signal is bound directly to the DOM it affects, including custom element attributes. On the home page, the `data` of the server-rendered counter is bound to a signal. When you change the input, Solid updates `data` on the `pi-component`, and Picard.js passes the new data to the micro frontend's `update` lifecycle. The component isn't rendered again.

## How It Is Integrated

**1. Initialize Picard.js.** [`src/picard.ts`](./src/picard.ts):

```ts
export const picard = initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
  interactive: true,
  scriptUrl: "/picard/picard.js",
});
```

**2. A middleware decorating the pages.** [`src/middleware.ts`](./src/middleware.ts):

```ts
export default createMiddleware([
  async (event, next) => {
    const response = await next();

    // pages set the content type on the event and return the (streamed) body
    if (event.res.headers.get("content-type")?.startsWith("text/html") && response instanceof Object && "body" in response) {
      const html = await new Response(response.body as BodyInit).text();
      event.res.headers.delete("content-length");
      return picard.decorate(html);
    }

    return response;
  },
]);
```

It's registered in [`vite.config.ts`](./vite.config.ts):

```ts
solidStart({
  middleware: "src/middleware.ts",
}),
```

**3. Place the parts.** [`src/entry-server.tsx`](./src/entry-server.tsx) defines the document:

```tsx
<head>
  <pi-part name="style"></pi-part>
  {assets}
</head>
<body>
  <div id="app">{children}</div>
  {scripts}
  <pi-part name="script"></pi-part>
</body>
```

**4. Serve the islands script.** [`src/routes/picard/[file].ts`](./src/routes/picard/[file].ts) is an API route returning `getIslandsFile(params.file)`.

**5. Bind a signal to a micro frontend.** [`src/routes/index.tsx`](./src/routes/index.tsx):

```tsx
const [start, setStart] = createSignal(5);

<input type="number" value={start()} onInput={(e) => setStart(e.currentTarget.valueAsNumber || 0)} />
<pi-component name="ssr-counter" source="pi-ssr-html" data={JSON.stringify({ start: start() })}></pi-component>
```

[`src/global.d.ts`](./src/global.d.ts) declares the `pi-*` elements for JSX.

## Good to Know

- Solid sets `data` as a string property. Picard.js treats strings as serialized JSON, and the `update` lifecycle of [`pi-ssr-html`](../../shared/pi-ssr-html/) resets the counter to the new start value.
- Collecting the stream gives up streaming for the decorated pages. For streaming micro frontends, see [React Router](../../react-router/ssr/) or [Next.js](../../next/ssr/).
- A full page load gets server-rendered micro frontends. Client-side navigations (Solid Router) render the next page in the browser, so its micro frontends are rendered there.

## Running

Requires Node.js 24.

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

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
