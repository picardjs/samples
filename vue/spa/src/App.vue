
<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <h1>Vite + Vue</h1>

  <div class="card">
    <div class="row">
      <div class="col">
        <h3>Static Column 1</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>
      </div>
      <div class="col">
        <pi-component name="column" source="mf-simple-html"></pi-component>
      </div>
      <div class="col">
        <pi-component name="column" source="nfsimplehtml"></pi-component>
      </div>
    </div>
    <div class="center">
      <pi-component name="counter" source="pi-simple-html"></pi-component>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.row {
  display: flex;
  gap: 1em;
  text-align: left;
}
.col {
  flex: 1;
}
.center {
  display: flex;
  justify-content: center;
  padding: 0.5em;
}
</style>
