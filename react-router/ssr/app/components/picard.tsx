import { Suspense } from "react";
import { Await } from "react-router";

/**
 * Shows HTML decorated by Picard.js on the server, e.g., a pi-component with
 * its server-rendered content. The promise is streamed, i.e., the rest of the
 * page does not wait for the micro frontends.
 */
export function PicardHtml({ html }: { html: Promise<string> }) {
  return (
    <Suspense>
      <Await resolve={html}>
        {(content) => (
          // React must not touch the content - it is owned by Picard.js in the browser
          <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </Await>
    </Suspense>
  );
}
