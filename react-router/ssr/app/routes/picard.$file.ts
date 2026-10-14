import { getIslandsFile } from "picard-js/node";
import type { Route } from "./+types/picard.$file";

export function loader({ params }: Route.LoaderArgs) {
  const content = getIslandsFile(params.file);

  if (content === undefined) {
    throw new Response("Not found", { status: 404 });
  }

  return new Response(content, { headers: { "content-type": "text/javascript" } });
}
