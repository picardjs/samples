import express from 'express';
import { readFile } from 'node:fs/promises';
import { getIslandsFile, initializePicard } from 'picard-js/node';

const port = process.env.PORT || 3000;
const app = express();

const picard = initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  interactive: true,
  // the islands script is served by this server (see below)
  scriptUrl: '/picard/picard.js',
});

const pages = {
  '/': { title: 'Home', view: 'index' },
  '/more': { title: 'More', view: 'more' },
  '/about': { title: 'About', view: 'about' },
};

async function renderPage({ title, view }) {
  const [layout, content] = await Promise.all([
    readFile(new URL('./views/layout.html', import.meta.url), 'utf8'),
    readFile(new URL(`./views/${view}.html`, import.meta.url), 'utf8'),
  ]);
  return layout.replace('{{title}}', title).replace('{{content}}', content);
}

// the files of the islands script resuming the micro frontends in the browser
app.get('/picard/:file', (req, res) => {
  const content = getIslandsFile(req.params.file);

  if (content === undefined) {
    res.sendStatus(404);
  } else {
    res.type('text/javascript').send(content);
  }
});

for (const [path, page] of Object.entries(pages)) {
  app.get(path, async (_req, res, next) => {
    try {
      // renders the micro frontends into the pi-* elements
      res.type('html').send(await picard.decorate(await renderPage(page)));
    } catch (error) {
      next(error);
    }
  });
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} ...`);
});
