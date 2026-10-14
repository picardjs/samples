# Picard.js with React Router (Streaming SSR)

A React Router 8 application in framework mode (formerly Remix) that renders micro frontends on the server, *streams* them to the browser, and resumes them there.

## What Picard.js Does Here

React Router's loaders run on the server, and their promises can be streamed: the page is sent right away and the data follows when it resolves. This sample uses that for micro frontends. A loader returns `picard.decorate(...)` *without awaiting it*. The page renders immediately with a `Suspense` fallback, and the server-rendered micro frontend streams in once Picard.js has finished.

In the browser, the islands script hydrates `pi-ssr-html` and renders the client-only micro frontends of the demo feed (`server="none"`).

## How It Is Integrated

**1. Initialize Picard.js on the server.** [`app/picard.server.ts`](./app/picard.server.ts). The `.server` suffix keeps it out of the client bundle:

```ts
export const picard = initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
  interactive: true,
  scriptUrl: "/picard/picard.js",
});
```

**2. Loaders return the decorated HTML as a promise.** [`app/routes/home.tsx`](./app/routes/home.tsx):

```tsx
export function loader() {
  return {
    counter: picard.decorate('<pi-component name="ssr-counter" source="pi-ssr-html" data=\'{"start":5}\'></pi-component>'),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <PicardHtml html={loaderData.counter} />;
}
```

**3. Show it with `Suspense` and `Await`.** [`app/components/picard.tsx`](./app/components/picard.tsx):

```tsx
export function PicardHtml({ html }: { html: Promise<string> }) {
  return (
    <Suspense>
      <Await resolve={html}>
        {(content) => <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: content }} />}
      </Await>
    </Suspense>
  );
}
```

**4. Stream the styles and the islands script.** The root loader in [`app/root.tsx`](./app/root.tsx) decorates the two `pi-part` elements the same way:

```tsx
export function loader() {
  return {
    style: picard.decorate('<pi-part name="style"></pi-part>'),
    script: picard.decorate('<pi-part name="script"></pi-part>'),
  };
}

// in the Layout
<body>
  {data && <PicardHtml html={data.style} />}
  {/* ... */}
  <Scripts />
  {data && <PicardHtml html={data.script} />}
</body>
```

The style part goes at the start of the body, where `style` and `link` elements are allowed too. Streamed `Suspense` content can't be placed in the head.

**5. Serve the islands script.** The resource route [`app/routes/picard.$file.ts`](./app/routes/picard.$file.ts) (registered in [`app/routes.ts`](./app/routes.ts)) returns `getIslandsFile(params.file)`.

**6. Type the elements.** [`app/picard.d.ts`](./app/picard.d.ts) adds `pi-component`, `pi-slot`, and `pi-part` to React's JSX types, so client-only components can be written directly:

```tsx
<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
```

## Good to Know

- **Streaming moves elements.** React puts streamed `Suspense` content into a hidden container and moves it into place later. Picard.js keeps a resumed micro frontend when its element is moved, so it's neither unmounted nor rendered twice.
- **Client-side navigations** run the loaders on the server too, so the micro frontends of the next page are server-rendered and then hydrated in the browser. Try the *About* link.
- **Bots don't get streaming.** The default `entry.server` waits for the whole page when the user agent is a bot (`isbot`), which includes `curl` and headless browsers. Use a regular browser to see the streaming.

## Running

```sh
npm install
npm run dev
```

For production:

```sh
npm run build
npm start
```

Then open `http://localhost:5173` (development) or `http://localhost:3000` (production).

See [Next.js](../../next/ssr/) for streaming with React Server Components.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
