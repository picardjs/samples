import type { Route } from "./+types/home";
import { PicardHtml } from "../components/picard";
import { picard } from "../picard.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Picard.js with React Router" }];
}

export function loader() {
  // not awaited - the decorated HTML is streamed once the micro frontends are rendered
  return {
    counter: picard.decorate('<pi-component name="ssr-counter" source="pi-ssr-html" data=\'{"start":5}\'></pi-component>'),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <div className="jumbotron text-center">
        <h1>Picard.js with React Router</h1>
        <p>The micro frontends are rendered on the server, streamed, and resumed in the browser.</p>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <h3>Static Column 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div className="col-sm-4">
          <pi-component name="column" source="mf-simple-html" server="none"></pi-component>
        </div>
        <div className="col-sm-4">
          <pi-component name="column" source="nfsimplehtml" server="none"></pi-component>
        </div>
      </div>
      <div className="d-flex p-2 justify-content-center">
        <pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
      </div>
      <div className="d-flex p-2 justify-content-center">
        {/* rendered on the server and hydrated in the browser */}
        <PicardHtml html={loaderData.counter} />
      </div>
    </>
  );
}
