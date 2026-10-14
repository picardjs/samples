import { defineConfig } from '@rsbuild/core';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  html: {
    title: 'Picard.js with Module Federation',
  },
  plugins: [
    pluginModuleFederation({
      name: 'host',
      remotes: {
        // the same remote is also part of the picard-demos feed (mf-simple-html)
        simplehtml: 'simplehtml@https://assets.piral.cloud/pilets/picard-demos/mf-simple-html/1.0.1/remoteEntry.js',
      },
      runtimePlugins: ['./src/legacy-exposes.ts'],
    }),
  ],
});
