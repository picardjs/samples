import { Suspense } from "react";
import { Await } from "react-router";

function Html({ html }: { html: string }) {
  // React must not touch the content - it is owned by Picard.js in the browser, which
  // may already have resumed the micro frontend when React hydrates (hence the warning suppression)
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning />;
}

/**
 * Shows HTML decorated by Picard.js on the server, e.g., a pi-component with
 * its server-rendered content. The promise is streamed, i.e., the rest of the
 * page does not wait for the micro frontends.
 */
export function PicardHtml({ html }: { html: Promise<string> }) {
  return (
    <Suspense>
      <Await resolve={html}>{(content) => <Html html={content} />}</Await>
    </Suspense>
  );
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/**
 * Shows a component of a micro frontend, which is only rendered in the browser.
 * The pi-component is not rendered by React, as its content (filled by Picard.js,
 * possibly before React hydrates) would not match what React expects.
 */
export function PicardClientComponent({ name, source }: { name: string; source: string }) {
  const html = `<pi-component name="${escapeAttribute(name)}" source="${escapeAttribute(source)}" server="none"></pi-component>`;
  return <Html html={html} />;
}
