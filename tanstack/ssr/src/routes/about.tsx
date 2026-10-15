import { createFileRoute } from '@tanstack/react-router'
import { PicardHtml } from '#/picard/PicardHtml'
import { renderComponent } from '#/picard/functions'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'About - Picard.js with TanStack Start' }] }),
  loader: () => ({
    counter: renderComponent({ data: { name: 'ssr-counter', source: 'pi-ssr-html', data: { start: 42 } } }),
  }),
  component: About,
})

function About() {
  const { counter } = Route.useLoaderData()

  return (
    <main className="text-center">
      <h1>About</h1>
      <p>Navigating here on the client calls the server function, so this counter is rendered on the server, too.</p>
      <div className="d-flex p-2 justify-content-center">
        <PicardHtml html={counter} />
      </div>
    </main>
  )
}
