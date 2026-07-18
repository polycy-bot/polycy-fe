<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import { uiState } from '$lib/stores/uiState.svelte';
	import { CircleQuestionMark, FileText } from '@lucide/svelte';
	let filteredKnowledge = $derived(
		uiState.knowledgeBase.filter((item) => {
			const query = uiState.searchInput.toLowerCase().trim();
			if (!query) return true;
			return (
				item.title.toLowerCase().includes(query) ||
				item.id.toLowerCase().includes(query) ||
				item.content.toLowerCase().includes(query) ||
				item.category.toLowerCase().includes(query)
			);
		})
	);
	function getMatchedSnippet(content: string, query: string): string {
		if (!query) return content.slice(0, 120) + (content.length > 120 ? '...' : '');
		const cleanQuery = query.toLowerCase().trim();
		const cleanContent = content.toLowerCase();
		const matchIndex = cleanContent.indexOf(cleanQuery);
		if (matchIndex === -1) {
			return content.slice(0, 120) + (content.length > 120 ? '...' : '');
		}
		const start = Math.max(0, matchIndex - 40);
		const end = Math.min(content.length, matchIndex + cleanQuery.length + 60);
		let snippet = content.slice(start, end);
		if (start > 0) snippet = '...' + snippet;
		if (end < content.length) snippet = snippet + '...';
		return snippet;
	}
</script>

<Command.List class="overflow-y-auto p-2 space-y-1">
	{#if uiState.isLoading}
		<div class="text-muted-foreground p-6 text-center text-sm">Loading knowledge library...</div>
	{:else}
		{#if filteredKnowledge.length === 0}
			<Command.Empty class="text-muted-foreground p-6 text-center text-sm">
				No knowledge matching your query found.
			</Command.Empty>
		{:else}
			<Command.Group
				heading="Available System Knowledge"
				class="text-xs text-muted-foreground px-2 py-1.5"
			>
				{#each filteredKnowledge as item (item.id)}
					{@const snippet = getMatchedSnippet(item.content, uiState.searchInput)}
					<Command.Item
						value="{item.id} {item.title} {item.category} {snippet}"
						onSelect={() => uiState.navigateToDetail(item)}
						class="aria-selected:bg-accent aria-selected:text-accent-foreground flex items-start space-x-3 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors"
					>
						{#if item.category.toLowerCase().includes('rule') || item.id
								.toLowerCase()
								.includes('rule')}
							<CircleQuestionMark class="mt-0.5 h-4 w-4 text-primary shrink-0" />
						{:else}
							<FileText class="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
						{/if}

						<div class="flex flex-col flex-1">
							<span class="font-medium text-foreground">{item.title}</span>
							<span
								class="text-muted-foreground line-clamp-2 text-xs font-mono bg-muted/30 px-1.5 py-1 rounded border border-border/40 mt-1 italic"
							>
								{snippet}
							</span>
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
		{/if}
	{/if}
</Command.List>
