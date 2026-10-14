# pi-ssr-html: a Server-Renderable Pilet

A framework-less pilet (spec v2) exposing an `ssr-counter` component. It can be rendered on the server and hydrated in the browser, and that's what the SSR and SSG samples use to show server rendering. It's published to the `picard-demos` feed.

```html
<pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
```

## How a Component Supports Server Rendering

Picard.js components are objects with lifecycle functions. [`index.js`](./index.js) implements all four that matter for server rendering:

```js
var counter = {
  // on the server: returns the HTML of the component
  stringify: function (props) {
    return render(props.start || 0);
  },
  // in the browser: hydrates the server-rendered HTML or renders it
  mount: function (container, props, locals) {
    if (!locals.hydrate) {
      container.innerHTML = render(count);
    }
    // attach the event listeners to the (existing) button ...
  },
  // in the browser: new data, e.g., a changed data attribute
  update: function (props, locals) {
    locals.reset?.(props.start || 0);
  },
  unmount: function (container, locals) {
    // remove the event listeners ...
  },
};
```

- **`stringify`** runs in `picard.decorate` on the server and returns the markup that goes into the `pi-component` element.
- **`mount`** runs in the browser. `locals.hydrate` is `true` when the server-rendered markup is already there. The component then only attaches its event listeners instead of rendering again.
- **`update`** is called when the `data` changes, e.g., when a framework binds it to a signal (see the [SolidStart](../../solid/ssr/) sample). It resets the counter.
- **`locals`** is a per-instance object for passing things from `mount` to `update` and `unmount`.

The markup says *"rendered on the server"* or *"rendered on the client"*, and the element gets `data-mode="hydrated"` or `"rendered"`, so the samples show which path was taken.

## Used By

All SSR and SSG samples: [Angular SSR](../../angular/ssr/), [ASP.NET Core](../../aspnet/ssr/), [Astro](../../astro/ssg/), [Bun](../../bun/ssr/), [Deno](../../deno/ssr/), [Hotwire Turbo](../../turbo/ssr/), [htmx](../../htmx/ssr/), [Hugo](../../hugo/ssg/), [Next.js](../../next/ssr/), [Nuxt](../../nuxt/ssr/), [Qwik](../../qwik/ssg/), [React Router](../../react-router/ssr/), [SolidStart](../../solid/ssr/), [SvelteKit](../../sveltekit/ssr/), and the [Vitest](../../vitest/testing/) tests.

## Publishing

```sh
npx publish-microfrontend --url https://feed.piral.cloud/api/v1/pilet/picard-demos --api-key <key>
```

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
