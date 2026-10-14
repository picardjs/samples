import { getIslandsFile, initializePicard } from 'picard-js/node';

const port = Number(Deno.env.get('PORT') || 8000);

const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  // the islands script is served by this server (see below)
  scriptUrl: '/picard/picard.js',
});

const template = await Deno.readTextFile(new URL('./index.html', import.meta.url));
const islandsFile = new URLPattern({ pathname: '/picard/:file' });

Deno.serve({ port }, async (req) => {
  const url = new URL(req.url);
  const islands = islandsFile.exec(url);

  if (islands) {
    // the files of the islands script resuming the micro frontends in the browser
    const content = getIslandsFile(islands.pathname.groups.file!);

    if (content === undefined) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(content, { headers: { 'content-type': 'text/javascript' } });
  }

  if (url.pathname === '/') {
    // renders the micro frontends into the pi-* elements
    const html = await picard.decorate(template);
    return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  return new Response('Not found', { status: 404 });
});
