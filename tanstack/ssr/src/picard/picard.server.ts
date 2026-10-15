import { initializePicard } from 'picard-js/node'

/**
 * Picard.js renders the micro frontends on the server.
 * The islands script resumes them in the browser.
 */
export const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  // the islands script is served by this app (see src/routes/picard/$file.ts)
  scriptUrl: '/picard/picard.js',
})
