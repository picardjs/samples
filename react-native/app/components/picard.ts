import { version } from 'picard-js/package.json';

/**
 * The micro frontend discovery service.
 */
export const feed = 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos';

/**
 * The browser script of Picard.js, matching the installed version.
 */
export const scriptUrl = `https://unpkg.com/picard-js@${version}/dist/browser/picard.js`;

/**
 * The markup with the components of the micro frontends - used on all platforms.
 */
export const markup = `
<style>
  .row { display: flex; gap: 1em; }
  .col { flex: 1; }
</style>
<div class="row">
  <div class="col">
    <pi-component name="column" source="mf-simple-html"></pi-component>
  </div>
  <div class="col">
    <pi-component name="column" source="nfsimplehtml"></pi-component>
  </div>
</div>
<p>
  <pi-component name="counter" source="pi-simple-html"></pi-component>
</p>
`;

/**
 * The page hosting the micro frontends in a WebView (iOS / Android).
 */
export const page = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="${scriptUrl}" feed="${feed}"></script>
</head>
<body>${markup}</body>
</html>`;
