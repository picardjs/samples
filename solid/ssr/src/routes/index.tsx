import { createSignal } from "solid-js";

export default function Home() {
  const [start, setStart] = createSignal(5);

  return (
    <main>
      <div class="jumbotron text-center">
        <h1>Picard.js with SolidStart</h1>
        <p>The micro frontends are rendered on the server and resumed in the browser.</p>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <h3>Static Column 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div class="col-sm-4">
          <pi-component name="column" source="mf-simple-html" server="none"></pi-component>
        </div>
        <div class="col-sm-4">
          <pi-component name="column" source="nfsimplehtml" server="none"></pi-component>
        </div>
      </div>
      <div class="d-flex p-2 justify-content-center">
        <pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
      </div>
      <div class="d-flex p-2 justify-content-center align-items-center">
        <label class="m-0 mr-2">
          Start at{" "}
          <input
            type="number"
            id="start"
            value={start()}
            onInput={(e) => setStart(e.currentTarget.valueAsNumber || 0)}
          />
        </label>
        {/* rendered on the server and hydrated in the browser - the signal updates its data */}
        <pi-component name="ssr-counter" source="pi-ssr-html" data={JSON.stringify({ start: start() })}></pi-component>
      </div>
    </main>
  );
}
