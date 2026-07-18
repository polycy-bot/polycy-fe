<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { uiState } from '$lib/stores/uiState.svelte';
</script>

<button
	onclick={() => {
		uiState.open = true;
		uiState.activeView = 'list';
	}}
	class="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground border-border inline-flex items-center justify-center rounded-lg border p-2 md:px-3 md:py-1.5 text-sm transition-all shadow-sm ml-auto"
	aria-label="Search"
>
	<Search class="h-4 w-4" />

	<span class="hidden md:inline ml-2">Search...</span>

	<kbd
		class="bg-background hidden pointer-events-none lg:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-medium opacity-100 shadow-sm ml-2"
	>
		<span class="text-xs">⌘</span>K
	</kbd>
</button>
