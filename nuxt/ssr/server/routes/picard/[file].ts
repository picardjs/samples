import { getIslandsFile } from 'picard-js/node'

// serves the files of the Picard.js islands script
export default defineEventHandler((event) => {
  const content = getIslandsFile(getRouterParam(event, 'file') || '')

  if (content === undefined) {
    throw createError({ statusCode: 404 })
  }

  setResponseHeader(event, 'content-type', 'text/javascript')
  return content
})
