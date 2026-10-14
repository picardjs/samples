import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PicardComponent } from "~/components/picard/picard";

export default component$(() => {
  return (
    <>
      <h1>Qwik</h1>
      <div style={{ display: "flex", gap: "1em" }}>
        <div style={{ flex: 1 }}>
          <h3>Static Column 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
        </div>
        <div style={{ flex: 1 }}>
          <PicardComponent name="column" source="mf-simple-html" server="none" />
        </div>
        <div style={{ flex: 1 }}>
          <PicardComponent name="column" source="nfsimplehtml" server="none" />
        </div>
      </div>
      <p>
        <PicardComponent name="counter" source="pi-simple-html" server="none" />
      </p>
      <p>
        {/* rendered when generating the page and hydrated in the browser */}
        <PicardComponent name="ssr-counter" source="pi-ssr-html" data={{ start: 5 }} />
      </p>
    </>
  );
});

export const head: DocumentHead = {
  title: "Qwik with Picard.js",
};
