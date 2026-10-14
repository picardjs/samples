# nf-ssr-html: a Server-Renderable Native Federation Module

A framework-less Native Federation micro frontend exposing an `ssr-likes` component. It can be rendered on the server and hydrated in the browser. It's published to the `picard-demos` feed.

```html
<pi-component name="ssr-likes" source="nf-ssr-html" data='{"likes":3}'></pi-component>
```

## Why It Exists

Native Federation micro frontends are plain ES modules. Rendering them on the server means *evaluating ES modules on the server*: loading them, linking their imports, and running them. Picard.js does that with `vm.SourceTextModule`. Its availability differs between runtimes: Node.js needs `--experimental-vm-modules`, while Bun and Deno support it out of the box.

To exercise this, the micro frontend consists of two modules:

- [`ssr-likes.js`](./ssr-likes.js) is the exposed module with the component lifecycle (`stringify`, `mount` with `locals.hydrate`, `update`, `unmount`), the same as [`pi-ssr-html`](../pi-ssr-html/).
- [`render.js`](./render.js) renders the markup. It's imported relatively and uses `import.meta.url`:

```js
export function render(likes) {
  const origin = typeof window === 'undefined' ? 'server' : 'client';
  const file = new URL(import.meta.url).pathname.split('/').pop();
  return `<button type="button" class="nf-ssr-likes">${likes} likes</button> <small>rendered on the ${origin} by ${file}</small>`;
}
```

If the output says *"rendered on the server by render.js"*, the import was resolved and `import.meta` was set correctly on the server.

[`remoteEntry.json`](./remoteEntry.json) is the Native Federation manifest, exposing `./ssr-likes`.

## Used By

[Bun](../../bun/ssr/), [Deno](../../deno/ssr/), and the [Vitest](../../vitest/testing/) tests.

## Publishing

```sh
npx publish-microfrontend --url https://feed.piral.cloud/api/v1/pilet/picard-demos --api-key <key>
```

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
