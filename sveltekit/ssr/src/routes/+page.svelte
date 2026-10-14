<svelte:head>
	<title>Picard.js with SvelteKit</title>
</svelte:head>

<div class="jumbotron text-center">
	<h1>Picard.js with SvelteKit</h1>
	<p>The micro frontends are rendered on the server and resumed in the browser.</p>
</div>

<div class="row">
	<div class="col-sm-4">
		<h3>Static Column 1</h3>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
	</div>
	<div class="col-sm-4">
		<pi-component name="column" source="mf-simple-html" server="none"></pi-component>
	</div>
	<div class="col-sm-4">
		<pi-component name="column" source="nfsimplehtml" server="none"></pi-component>
	</div>
</div>
<div class="d-flex p-2 justify-content-center">
	<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
</div>
<div class="d-flex p-2 justify-content-center">
	<!-- rendered on the server and hydrated in the browser -->
	<pi-component name="ssr-counter" source="pi-ssr-html" data={'{"start":5}'}></pi-component>
</div>
