import { createFileRoute } from '@tanstack/react-router'
import { PicardClientComponent, PicardHtml } from '#/picard/PicardHtml'
import { renderComponent } from '#/picard/functions'

export const Route = createFileRoute('/')({
  // runs on the server for the first request and in the browser for client-side
  // navigations - the server function renders the micro frontend on the server in both cases
  loader: () => ({
    counter: renderComponent({ data: { name: 'ssr-counter', source: 'pi-ssr-html', data: { start: 5 } } }),
  }),
  component: Home,
})

function Home() {
  const { counter } = Route.useLoaderData()

  return (
    <main>
      <div className="jumbotron text-center">
        <h1>Picard.js with TanStack Start</h1>
        <p>Micro frontends rendered by server functions and streamed into the page.</p>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <h3>Static Column 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div className="col-sm-4">
          <PicardClientComponent name="column" source="mf-simple-html" />
        </div>
        <div className="col-sm-4">
          <PicardClientComponent name="column" source="nfsimplehtml" />
        </div>
      </div>
      <div className="d-flex p-2 justify-content-center">
        <PicardClientComponent name="counter" source="pi-simple-html" />
      </div>
      <div className="d-flex p-2 justify-content-center">
        <PicardHtml html={counter} />
      </div>
    </main>
  )
}
