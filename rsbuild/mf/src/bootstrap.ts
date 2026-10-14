import { initializePicard } from 'picard-js/client';
import './index.css';

initializePicard({
  feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
});

const rootEl = document.querySelector('#root');

if (rootEl) {
  rootEl.innerHTML = `
  <div class="content">
    <h1>Picard.js with Module Federation</h1>
    <div class="row">
      <section id="host">
        <h2>Module Federation (host)</h2>
        <div id="host-column"></div>
      </section>
      <section id="picard">
        <h2>Picard.js</h2>
        <pi-component name="column" source="mf-simple-html"></pi-component>
        <pi-component name="column" source="nfsimplehtml"></pi-component>
        <pi-component name="counter" source="pi-simple-html"></pi-component>
      </section>
    </div>
  </div>
`;

  // the remote is a regular dependency of the host, i.e., resolved by the bundler's Module Federation runtime
  import('simplehtml/column').then(({ default: column }) => {
    column.mount(document.querySelector('#host-column')!);
  });
}
