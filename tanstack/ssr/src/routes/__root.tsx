import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { PicardHtml } from '#/picard/PicardHtml'
import { renderPart } from '#/picard/functions'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Picard.js with TanStack Start' },
    ],
    links: [
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  loader: () => ({
    // not awaited - streamed once Picard.js has rendered them
    style: renderPart({ data: 'style' }),
    script: renderPart({ data: 'script' }),
  }),
  // the parts belong to the document, i.e., they are only needed once
  staleTime: Infinity,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { style, script } = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* style and link elements are allowed in the body, too */}
        <PicardHtml html={style} />
        <nav className="nav justify-content-center my-3">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/about">
            About
          </Link>
        </nav>
        <div className="container">{children}</div>
        <Scripts />
        <PicardHtml html={script} />
      </body>
    </html>
  )
}
