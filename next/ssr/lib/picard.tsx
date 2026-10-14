import { connection } from "next/server";
import { initializePicard } from "picard-js/node";

/**
 * Picard.js renders the micro frontends on the server.
 * The islands script resumes them in the browser.
 */
const picard = initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
  interactive: true,
  // the islands script is served from this app (see app/picard/[file]/route.ts)
  scriptUrl: "/picard/picard.js",
});

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function Html({ html }: { html: string }) {
  // React must not touch the markup, which is owned by Picard.js
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

interface PicardComponentProps {
  /**
   * The name of the component.
   */
  name: string;
  /**
   * The name of the micro frontend exposing the component.
   */
  source: string;
  /**
   * The data to pass to the component.
   */
  data?: unknown;
  /**
   * Set to "none" to only render the component on the client.
   */
  server?: "none";
}

/**
 * Renders a component of a micro frontend on the server.
 * Use within a Suspense boundary, as the rendering happens per request.
 */
export async function PicardComponent({ name, source, data, server }: PicardComponentProps) {
  await connection();
  const attributes = [
    `name="${escapeAttribute(name)}"`,
    `source="${escapeAttribute(source)}"`,
    data !== undefined && `data="${escapeAttribute(JSON.stringify(data))}"`,
    server && `server="${server}"`,
  ].filter(Boolean);
  const html = await picard.decorate(`<pi-component ${attributes.join(" ")}></pi-component>`);
  return <Html html={html} />;
}

/**
 * Renders the state and the islands script of Picard.js.
 * Use within a Suspense boundary, as the rendering happens per request.
 */
export async function PicardScript() {
  await connection();
  const html = await picard.decorate('<pi-part name="script"></pi-part>');
  return <Html html={html} />;
}
