import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.picardjs.samples.capacitor',
  appName: 'Picard.js',
  // the web app (incl. the bundled micro frontends in public/mfs) is served from the device
  webDir: 'dist',
};

export default config;
