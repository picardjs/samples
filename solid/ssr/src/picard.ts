import { initializePicard } from "picard-js/node";

export const picard = initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
  interactive: true,
  // the islands script is served by the picard/[file] route
  scriptUrl: "/picard/picard.js",
});
