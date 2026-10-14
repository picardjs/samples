import { resolve } from 'node:path';
import { beforeAll, expect, it, vi } from 'vitest';
import { renderPage, startPicard } from '../src/page';
import { feed, server } from './feed';

/**
 * Loads ES modules (Native Federation) via Vitest - the DOM implementations can neither
 * run blob: scripts nor can Node.js import modules from http: URLs. The files need to be
 * allowed in the Vite config (server.fs.allow).
 */
const esm = () => ({
  load(url: string) {
    // the server of the global setup serves the micro frontends of shared/
    const file = resolve(process.cwd(), '../../shared', url.substring(server.length));
    return import(/* @vite-ignore */ file);
  },
});

/**
 * Scripts (pilets) run in the window of jsdom, while Vitest exposes its globals
 * (e.g., System defined by Picard.js) on the global object of Node.js.
 */
function shareGlobalsWithJsdom() {
  const dom = (globalThis as any).jsdom;

  if (dom) {
    dom.window.System = (globalThis as any).System;
  }
}

/**
 * The tests of the page - run in different DOM implementations.
 */
export function testPage() {
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

  it('renders a Native Federation module', async () => {
    const component = document.querySelector('pi-component[source=nf-ssr-html]')!;
    await vi.waitFor(() => expect(component.querySelector('button')?.textContent).toBe('3 likes'), { timeout: 5000 });
    component.querySelector('button')!.click();
    expect(component.querySelector('button')!.textContent).toBe('4 likes');
  });

  it('updates a micro frontend with new data', async () => {
    const component = document.querySelector('pi-component[source=pi-ssr-html]')!;
    component.setAttribute('data', '{"start":42}');
    await vi.waitFor(() => expect(component.querySelector('button')?.textContent).toBe('Count: 42'));
  });
}
