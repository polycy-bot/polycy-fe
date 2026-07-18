<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.png';
	let { children } = $props();
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="icon" href={favicon} />
	<title>polycy</title>
	<meta
		name="description"
		content="polycy is an automated assistant providing instant direction and guidance on law administration practice statements."
	/>
	<meta name="robots" content="index, follow" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="polycy" />
	<meta
		property="og:description"
		content="polycy is an automated assistant providing instant direction and guidance on law administration practice statements."
	/>
	<meta name="theme-color" content="#ffffff" />
</svelte:head>
<ModeWatcher />
{@render children()}
