import { initializePicard } from "picard-js/node";

/**
 * Picard.js renders the micro frontends on the server, i.e., when
 * generating the static pages. The islands script resumes them in the browser.
 */
export const picard = initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
  interactive: true,
  // the islands script is generated next to the pages (see src/routes/picard/[file])
  scriptUrl: "/picard/picard.js",
});
