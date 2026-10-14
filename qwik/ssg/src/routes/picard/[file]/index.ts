import type { RequestHandler, StaticGenerateHandler } from "@builder.io/qwik-city";
import { getIslandsFile, getIslandsFileNames } from "picard-js/node";

// serves the files of the Picard.js islands script
export const onGet: RequestHandler = async ({ params, send }) => {
  const content = getIslandsFile(params.file);

  if (content === undefined) {
    send(404, "Not found");
  } else {
    send(new Response(content, { headers: { "content-type": "text/javascript" } }));
  }
};

// generates the files next to the static pages
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: getIslandsFileNames().map((file) => ({ file })),
  };
};
