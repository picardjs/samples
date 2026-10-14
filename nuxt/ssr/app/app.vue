<template>
  <div>
    <NuxtRouteAnnouncer />
    <h1>Nuxt</h1>
    <div class="row">
      <div class="col">
        <h3>Static Column 1</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
      </div>
      <div class="col">
        <pi-component name="column" source="mf-simple-html" server="none"></pi-component>
      </div>
      <div class="col">
        <pi-component name="column" source="nfsimplehtml" server="none"></pi-component>
      </div>
    </div>
    <p>
      <pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
    </p>
    <p>
      <!-- rendered on the server and hydrated in the browser -->
      <pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
    </p>
  </div>
</template>

<style>
.row {
  display: flex;
  gap: 1em;
}
.col {
  flex: 1;
}
</style>
