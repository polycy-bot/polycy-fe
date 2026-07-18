<script lang="ts">
	import { uiState } from '$lib/stores/uiState.svelte';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<div class="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-5">
	<button
		onclick={uiState.backToList}
		class="text-muted-foreground hover:text-foreground inline-flex items-center space-x-1.5 text-xs font-medium transition-colors"
	>
		<ArrowLeft class="h-3.5 w-3.5" />
		<span>Back to search</span>
	</button>
</div>
