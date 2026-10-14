import type { APIRoute, GetStaticPaths } from 'astro';
import { getIslandsFile, getIslandsFileNames } from 'picard-js/node';

// generates the files of the Picard.js islands script
export const getStaticPaths = (() => getIslandsFileNames().map((file) => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(getIslandsFile(params.file!), {
    headers: { 'content-type': 'text/javascript' },
  });
