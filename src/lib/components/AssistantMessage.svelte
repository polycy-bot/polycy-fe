<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Markdown from './Markdown.svelte';
	let {
		message = '',
		timestamp
	}: {
		message: string;
		timestamp: string;
	} = $props();
</script>

<div class="flex items-start space-x-3 max-w-[95%] my-2">
	<div
		class="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm"
	>
		AI
	</div>

	<Card.Root
		class="border-border bg-card text-card-foreground rounded-2xl rounded-tl-none border shadow-sm overflow-hidden"
	>
		<Card.Content class="p-2 text-sm leading-relaxed flex flex-col">
			<Markdown content={message} />
			<span class="text-[10px] text-muted-foreground selection:bg-transparent">
				{timestamp}
			</span>
		</Card.Content>
	</Card.Root>
</div>
