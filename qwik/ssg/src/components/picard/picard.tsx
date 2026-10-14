import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

// only runs on the server - picard-js/node is never part of the client bundle
const decorate = server$(async (markup: string) => {
  const { picard } = await import("~/lib/picard");
  return await picard.decorate(markup);
});

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
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
  data?: Record<string, unknown>;
  /**
   * Set to "none" to only render the component on the client.
   */
  server?: "none";
}

/**
 * Renders a component of a micro frontend on the server.
 */
export const PicardComponent = component$<PicardComponentProps>(({ name, source, data, server }) => {
  const html = useSignal("");

  useTask$(async () => {
    const attributes = [
      `name="${escapeAttribute(name)}"`,
      `source="${escapeAttribute(source)}"`,
      data !== undefined && `data="${escapeAttribute(JSON.stringify(data))}"`,
      server && `server="${server}"`,
    ].filter(Boolean);
    html.value = await decorate(`<pi-component ${attributes.join(" ")}></pi-component>`);
  });

  // Qwik does not touch the markup, which is owned by Picard.js
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={html.value} />;
});

/**
 * Renders the state and the islands script of Picard.js.
 */
export const PicardScript = component$(() => {
  const html = useSignal("");

  useTask$(async () => {
    html.value = await decorate('<pi-part name="script"></pi-part>');
  });

  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={html.value} />;
});
