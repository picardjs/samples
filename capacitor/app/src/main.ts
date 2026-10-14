import { Capacitor } from '@capacitor/core';
import { initializePicard } from 'picard-js/client';
import './style.css';

const remoteFeed = 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos';
// the micro frontends bundled with the app (see public/feed.json), relative to the page
const localFeed = './feed.json';

async function loadJson(url: string) {
  const res = await fetch(url);
  return res.json();
}

initializePicard({
  // combines the micro frontends of the remote feed with the ones bundled with the app
  async feed() {
    const [remote, local] = await Promise.all([loadJson(remoteFeed), loadJson(localFeed)]);
    return {
      ...remote,
      microFrontends: { ...remote.microFrontends, ...local.microFrontends },
    };
  },
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Picard.js with Capacitor</h1>
  <p>Running on <strong>${Capacitor.getPlatform()}</strong>.</p>
  <section>
    <h2>Bundled with the app</h2>
    <pi-component name="info" source="app-info"></pi-component>
  </section>
  <section>
    <h2>From the feed</h2>
    <pi-component name="column" source="mf-simple-html"></pi-component>
    <pi-component name="column" source="nfsimplehtml"></pi-component>
    <pi-component name="counter" source="pi-simple-html"></pi-component>
  </section>
`;
