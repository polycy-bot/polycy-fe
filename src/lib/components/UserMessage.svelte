<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Markdown from './Markdown.svelte';

	let {
		message,
		timestamp
	}: {
		message: string | Snippet;
		timestamp: string;
	} = $props();
</script>

<div class="flex w-full justify-end items-start space-x-3">
	<Card.Root
		class="max-w-[90%] border-none bg-primary text-primary-foreground shadow-sm rounded-2xl rounded-tr-none overflow-hidden"
	>
		<Card.Content class="text-sm leading-relaxed">
			<p>
				{#if typeof message === 'string'}
					<Markdown content={message} />
				{:else if message}
					{@render message()}
				{/if}
			</p>
			<span
				class=" block text-right text-[10px] text-primary-foreground/70 selection:bg-transparent"
			>
				{timestamp}
			</span>
		</Card.Content>
	</Card.Root>

	<div
		class="bg-secondary text-secondary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm"
	>
		U
	</div>
</div>
