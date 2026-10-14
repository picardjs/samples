import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    fs: {
      // the micro frontends of the samples (served by the global setup) are imported in the tests, too
      allow: ['.', '../../shared'],
    },
  },
  test: {
    globalSetup: './test/global-setup.ts',
    environmentOptions: {
      jsdom: {
        // let jsdom load and run the scripts of the micro frontends
        resources: 'usable',
        runScripts: 'dangerously',
      },
      happyDOM: {
        settings: {
          // let happy-dom load and run the scripts of the micro frontends
          enableJavaScriptEvaluation: true,
          disableJavaScriptFileLoading: false,
          suppressInsecureJavaScriptEnvironmentWarning: true,
        },
      },
    },
  },
});
