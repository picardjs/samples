import { Suspense } from 'react'
import { Await } from '@tanstack/react-router'
import { componentMarkup, type ComponentRef } from './markup'

function Html({ html }: { html: string }) {
  // React must not touch the content - it is owned by Picard.js in the browser, which
  // may already have resumed the micro frontend when React hydrates (hence the warning suppression)
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />
}

/**
 * Shows HTML rendered by Picard.js on the server, e.g., a pi-component with
 * its server-rendered content. The promise is streamed, i.e., the rest of the
 * page does not wait for the micro frontends.
 */
export function PicardHtml({ html }: { html: Promise<string> }) {
  return (
    <Suspense>
      <Await promise={html}>{(content) => <Html html={content} />}</Await>
    </Suspense>
  )
}

/**
 * Shows a component of a micro frontend, which is only rendered in the browser.
 * The pi-component is not rendered by React, as its content (filled by Picard.js,
 * possibly before React hydrates) would not match what React expects.
 */
export function PicardClientComponent(props: ComponentRef) {
  return <Html html={componentMarkup(props, 'none')} />
}
