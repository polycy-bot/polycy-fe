<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { uiState } from '$lib/stores/uiState.svelte';
	import { Search } from '@lucide/svelte';
</script>

<div class="flex items-center border-b border-border p-2" data-command-input-wrapper="">
	<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<Input
		bind:value={uiState.searchInput}
		placeholder="Type a policy rule or keyword to search..."
		class="flex w-full rounded-md py-2 text-sm outline-none"
	/>
</div>
