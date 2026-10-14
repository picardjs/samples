import { initializePicard } from 'picard-js/node'

/**
 * Picard.js renders the micro frontends into the HTML produced by Nuxt.
 * The islands script resumes them in the browser.
 */
const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  // the islands script is served from this server (see server/routes/picard/[file].ts)
  scriptUrl: '/picard/picard.js',
})

export default defineNitroPlugin((nitroApp) => {
  // places the styles and the state / islands script of Picard.js
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.push('<pi-part name="style"></pi-part>')
    html.bodyAppend.push('<pi-part name="script"></pi-part>')
  })

  // renders the micro frontends into the pi-component elements
  nitroApp.hooks.hook('render:response', async (response) => {
    if (typeof response.body === 'string') {
      response.body = await picard.decorate(response.body)
    }
  })
})
