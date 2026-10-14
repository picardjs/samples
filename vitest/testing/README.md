# Testing Picard.js Pages with Vitest

Unit tests for a page that uses Picard.js, written with [Vitest](https://vitest.dev). The same tests run in [jsdom](https://github.com/jsdom/jsdom) and in [happy-dom](https://github.com/capricorn86/happy-dom).

## What Picard.js Does Here

The code under test renders a page with two micro frontends: a pilet ([`pi-ssr-html`](../../shared/pi-ssr-html/)) and a Native Federation module ([`nf-ssr-html`](../../shared/nf-ssr-html/)). The tests start Picard.js in the simulated DOM, wait until the micro frontends show up, click them, and change their data. Testing it this way means:

- Picard.js really runs, with no mocks: custom elements, script loading, and the component lifecycles.
- The micro frontends come from a local server, so the tests don't depend on the internet and test exactly the versions in the repository.

DOM shims aren't browsers, though, so each one needs some help. The sample shows what that help looks like.

## How It Is Integrated

**1. The code under test.** [`src/page.ts`](./src/page.ts):

```ts
export function startPicard(options: PicardOptions) {
  return initializePicard(options);
}

export function renderPage(root: HTMLElement) {
  root.innerHTML = `
    <pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
    <pi-component name="ssr-likes" source="nf-ssr-html" data='{"likes":3}'></pi-component>
  `;
}
```

**2. A local feed.** [`test/global-setup.ts`](./test/global-setup.ts) serves `shared/` on port 4800 for the duration of the test run, and [`test/feed.ts`](./test/feed.ts) is a feed object pointing to it.

**3. The tests.** [`test/page.ts`](./test/page.ts) contains the tests, and [`test/jsdom.test.ts`](./test/jsdom.test.ts) and [`test/happy-dom.test.ts`](./test/happy-dom.test.ts) run them in each environment (`// @vitest-environment jsdom`):

```ts
beforeAll(() => {
  startPicard({ feed, services: { esm } });
  shareGlobalsWithJsdom();
  renderPage(document.body);
});

it('renders a pilet', async () => {
  const component = document.querySelector('pi-component[source=pi-ssr-html]')!;
  await vi.waitFor(() => expect(component.querySelector('button')?.textContent).toBe('Count: 5'), { timeout: 5000 });
  component.querySelector('button')!.click();
  expect(component.querySelector('button')!.textContent).toBe('Count: 6');
});

it('updates a micro frontend with new data', async () => {
  const component = document.querySelector('pi-component[source=pi-ssr-html]')!;
  component.setAttribute('data', '{"start":42}');
  await vi.waitFor(() => expect(component.querySelector('button')?.textContent).toBe('Count: 42'));
});
```

## What the DOM Shims Need

**Running scripts.** Pilets are loaded with script elements, which both shims ignore by default. [`vitest.config.ts`](./vitest.config.ts) enables them:

```ts
environmentOptions: {
  jsdom: {
    resources: 'usable',
    runScripts: 'dangerously',
  },
  happyDOM: {
    settings: {
      enableJavaScriptEvaluation: true,
      disableJavaScriptFileLoading: false,
    },
  },
},
```

**Sharing globals (jsdom).** Vitest exposes the jsdom globals on Node.js's global object, but jsdom runs scripts in its own window. Picard.js defines `System` (used by pilets) globally, so the tests copy it to jsdom's window:

```ts
function shareGlobalsWithJsdom() {
  const dom = (globalThis as any).jsdom;

  if (dom) {
    dom.window.System = (globalThis as any).System;
  }
}
```

**ES modules.** Picard.js evaluates ES modules via `blob:` scripts, which neither shim can run, and Node.js can't `import()` from `http:` URLs. The tests replace Picard.js's `esm` service with one that imports the module files through Vitest:

```ts
const esm = () => ({
  load(url: string) {
    const file = resolve(process.cwd(), '../../shared', url.substring(server.length));
    return import(/* @vite-ignore */ file);
  },
});
```

The files are outside the project, so Vite has to allow them (`server.fs.allow: ['.', '../../shared']`).

## Good to Know

- The `services` option overrides Picard.js's built-in services, which makes it a general way to adapt Picard.js to an environment. Here only the `esm` service is replaced.
- For tests of the micro frontends themselves, render their components directly. This sample is about pages that *use* micro frontends.
- Clicking and waiting work like with any other DOM content. `vi.waitFor` covers the asynchronous loading.

## Running

```sh
npm install
npm test
```

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
