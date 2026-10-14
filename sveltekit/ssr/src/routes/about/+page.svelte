<svelte:head>
	<title>About - Picard.js with SvelteKit</title>
</svelte:head>

<h1>About</h1>
<p>
	Navigating here on the client renders the micro frontends on the client - loading this page directly
	renders them on the server.
</p>
<div class="d-flex p-2 justify-content-center">
	<pi-component name="ssr-counter" source="pi-ssr-html" data={'{"start":42}'}></pi-component>
</div>
