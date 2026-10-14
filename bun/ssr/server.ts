import { getIslandsFile, initializePicard } from 'picard-js/node';

const port = Number(process.env.PORT || 3000);

const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  // the islands script is served by this server (see below)
  scriptUrl: '/picard/picard.js',
});

const template = await Bun.file(new URL('./index.html', import.meta.url)).text();

Bun.serve({
  port,
  routes: {
    // the files of the islands script resuming the micro frontends in the browser
    '/picard/:file': (req) => {
      const content = getIslandsFile(req.params.file);

      if (content === undefined) {
        return new Response('Not found', { status: 404 });
      }

      return new Response(content, { headers: { 'content-type': 'text/javascript' } });
    },
    // renders the micro frontends into the pi-* elements
    '/': async () => {
      const html = await picard.decorate(template);
      return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    },
  },
  fetch() {
    return new Response('Not found', { status: 404 });
  },
});

console.log(`Listening on http://localhost:${port} ...`);
