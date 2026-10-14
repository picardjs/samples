import { useEffect } from 'react';
import { feed, markup, scriptUrl } from './picard';

/**
 * Loads the browser script of Picard.js. The client variant cannot be
 * bundled by Metro, as it imports ES modules from (dynamic) URLs.
 */
function loadPicard() {
  if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.setAttribute('feed', feed);
    document.head.appendChild(script);
  }
}

/**
 * Renders the micro frontends on the web (react-native-web), i.e.,
 * directly in the DOM.
 */
export default function MicroFrontends() {
  useEffect(loadPicard, []);
  // React must not touch the markup, which is owned by Picard.js
  return <div style={{ alignSelf: 'stretch' }} dangerouslySetInnerHTML={{ __html: markup }} />;
}
