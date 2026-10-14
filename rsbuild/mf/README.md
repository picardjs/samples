# Picard.js with Rsbuild and Module Federation

An [Rsbuild](https://rsbuild.rs) application that is a Module Federation *host* and also uses Picard.js, with both loading the same remote. It shows how a bundler's Module Federation runtime and Picard.js coexist on one page.

## What Picard.js Does Here

Many teams already use Module Federation at build time: the host declares its remotes in the bundler config and imports them like modules. Picard.js can join such a page and render micro frontends from a feed, including Module Federation remotes the host also uses. This sample does both with the same remote (`mf-simple-html`, global name `simplehtml`):

- **The host** imports `simplehtml/column` through the bundler and mounts it into `#host-column`.
- **Picard.js** renders `mf-simple-html/column`, plus a Native Federation module and a pilet from the `picard-demos` feed, into `pi-component` elements.

There are two Module Federation runtimes on the page: the one bundled by Rsbuild and Picard.js's own instance. They cooperate:

- **One remote, loaded once.** A remote entry registers a global container, so whichever runtime comes second reuses it. The remote entry is requested only once.
- **One share scope.** A container can only be initialized with a single share scope. Picard.js therefore initializes containers with the share scope of the page's Module Federation runtime (the host's) and adds its own shared dependencies to it. Shared dependencies are negotiated across both.

## How It Is Integrated

**1. The host configuration.** [`rsbuild.config.ts`](./rsbuild.config.ts):

```ts
pluginModuleFederation({
  name: 'host',
  remotes: {
    // the same remote is also part of the picard-demos feed (mf-simple-html)
    simplehtml: 'simplehtml@https://assets.piral.cloud/pilets/picard-demos/mf-simple-html/1.0.1/remoteEntry.js',
  },
  runtimePlugins: ['./src/legacy-exposes.ts'],
}),
```

**2. The asynchronous boundary.** [`src/index.ts`](./src/index.ts) only imports the bootstrap code, so Module Federation can initialize first:

```ts
import('./bootstrap');
```

**3. Picard.js and the host side by side.** [`src/bootstrap.ts`](./src/bootstrap.ts):

```ts
import { initializePicard } from 'picard-js/client';

initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
});

rootEl.innerHTML = `
  <div id="host-column"></div>
  <pi-component name="column" source="mf-simple-html"></pi-component>
  <pi-component name="column" source="nfsimplehtml"></pi-component>
  <pi-component name="counter" source="pi-simple-html"></pi-component>
`;

// the remote is a regular dependency of the host, resolved by the bundler's Module Federation runtime
import('simplehtml/column').then(({ default: column }) => {
  column.mount(document.querySelector('#host-column')!);
});
```

**4. A runtime plugin for an older remote.** The `mf-simple-html` container was built with an older version of Module Federation and registers its modules without the `./` prefix (`column` instead of `./column`). Picard.js handles that on its own. For the host, [`src/legacy-exposes.ts`](./src/legacy-exposes.ts) adds the same fallback as a runtime plugin:

```ts
getModuleFactory({ expose, remoteEntryExports }) {
  const factory = remoteEntryExports.get(expose) as unknown as Promise<() => unknown>;
  return factory.then(undefined, (error: unknown) => {
    if (expose.startsWith('./') && error instanceof Error && error.message.includes('does not exist in container')) {
      return remoteEntryExports.get(expose.substring(2));
    }

    throw error;
  });
},
```

## Good to Know

- This is a path to adopting Picard.js incrementally: keep the build-time remotes, and add runtime-discovered micro frontends from a feed next to them.
- Both runtimes show up in `globalThis.__FEDERATION__.__INSTANCES__` (`host` and `picard`). Picard.js finds the host's runtime there.

## Running

```sh
npm install
npm run dev
```

Then open `http://localhost:3000`. `npm run build` creates the production build in `dist/`.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
