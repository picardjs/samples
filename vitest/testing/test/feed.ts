// the server of the global setup
export const server = 'http://localhost:4800/';

// the feed with the micro frontends served by the global setup
export const feed = {
  schema: 'https://mfewg.org/schema/v1-pre.json',
  microFrontends: {
    'pi-ssr-html': [
      {
        url: `${server}pi-ssr-html/index.js`,
        metadata: { version: '1.0.2' },
        extras: { pilet: { spec: 'v2' }, dependencies: {} },
      },
    ],
    'nf-ssr-html': [
      {
        url: `${server}nf-ssr-html/remoteEntry.json`,
        metadata: { version: '1.0.0' },
        extras: { pilet: { spec: 'nf' }, exposes: [{ key: './ssr-likes', outFileName: 'ssr-likes.js' }], dependencies: {} },
      },
    ],
  },
};
