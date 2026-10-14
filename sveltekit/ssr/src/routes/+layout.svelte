<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="nav justify-content-center my-3">
	<a class="nav-link" href="/">Home</a>
	<a class="nav-link" href="/about">About</a>
</nav>

<div class="container">
	{@render children()}
</div>
