import { initializePicard, type PicardOptions } from 'picard-js/client';

/**
 * Starts Picard.js, i.e., defines the pi-* elements.
 */
export function startPicard(options: PicardOptions) {
  return initializePicard(options);
}

/**
 * Renders the page with its micro frontends into the given element.
 */
export function renderPage(root: HTMLElement) {
  root.innerHTML = `
    <h1>Picard.js</h1>
    <pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
    <pi-component name="ssr-likes" source="nf-ssr-html" data='{"likes":3}'></pi-component>
  `;
}
