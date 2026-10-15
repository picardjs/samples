import { createFileRoute } from '@tanstack/react-router'
import { getIslandsFile } from 'picard-js/node'

// serves the files of the islands script resuming the micro frontends in the browser
export const Route = createFileRoute('/picard/$file')({
  server: {
    handlers: {
      GET: ({ params }) => {
        const content = getIslandsFile(params.file)

        if (content === undefined) {
          return new Response('Not found', { status: 404 })
        }

        return new Response(content, { headers: { 'content-type': 'text/javascript' } })
      },
    },
  },
})
