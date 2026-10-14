import type { Route } from "./+types/about";
import { PicardHtml } from "../components/picard";
import { picard } from "../picard.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About - Picard.js with React Router" }];
}

export function loader() {
  // also used for client-side navigations, i.e., the micro frontends are always rendered on the server
  return {
    counter: picard.decorate('<pi-component name="ssr-counter" source="pi-ssr-html" data=\'{"start":42}\'></pi-component>'),
  };
}

export default function About({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>About</h1>
      <div className="d-flex p-2 justify-content-center">
        <PicardHtml html={loaderData.counter} />
      </div>
    </>
  );
}
