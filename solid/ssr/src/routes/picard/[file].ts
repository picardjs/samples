import type { APIEvent } from "@solidjs/start/server";
import { getIslandsFile } from "picard-js/node";

// the files of the islands script resuming the micro frontends in the browser
export function GET({ params }: APIEvent) {
  const content = getIslandsFile(params.file);

  if (content === undefined) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(content, { headers: { "content-type": "text/javascript" } });
}
