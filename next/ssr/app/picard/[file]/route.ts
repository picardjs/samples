import { getIslandsFile } from "picard-js/node";

// serves the files of the Picard.js islands script
export async function GET(_request: Request, ctx: RouteContext<"/picard/[file]">) {
  const { file } = await ctx.params;
  const content = getIslandsFile(file);

  if (content === undefined) {
    return new Response(null, { status: 404 });
  }

  return new Response(content, { headers: { "content-type": "text/javascript" } });
}
