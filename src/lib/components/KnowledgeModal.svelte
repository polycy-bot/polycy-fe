<script lang="ts">
	import { onMount } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { uiState } from '$lib/stores/uiState.svelte';
	import { MessageSquarePlus } from '@lucide/svelte';
	import Markdown from './Markdown.svelte';
	import { chatService } from '$lib/services/chat.svelte';
	import SearchButton from './SearchButton.svelte';
	import KmSearchInput from './KmSearchInput.svelte';
	import KmList from './KmList.svelte';
	import KmActionHeader from './KmActionHeader.svelte';
	import KmTitle from './KmTitle.svelte';
	import KmRevisionTable from './KmRevisionTable.svelte';

	onMount(async () => {
		try {
			const response = await fetch('/api/library');
			if (response.ok) {
				uiState.knowledgeBase = await response.json();
			}
		} catch (error) {
			console.error('Failed to load knowledge base from API:', error);
		} finally {
			uiState.isLoading = false;
		}
	});

	$effect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				uiState.open = !uiState.open;
				uiState.activeView = 'list';
				uiState.selectedItem = null;
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	async function handleActionPrompt() {
		uiState.open = false;
		if (uiState.selectedItem) {
			const queryText = uiState.selectedItem.title;
			if (!queryText || chatService.isStreaming) return;
			await chatService.sendMessage(queryText);
		}
		uiState.activeView = 'list';
		uiState.selectedItem = null;
	}
</script>

<SearchButton />

<Dialog.Root open={uiState.open} onOpenChange={(isOpen) => (uiState.open = isOpen)}>
	<Dialog.Content
		class="border-border bg-popover text-popover-foreground p-0 shadow-2xl rounded-xl overflow-hidden gap-0 min-w-[70vw] flex"
	>
		{#if uiState.activeView === 'list'}
			<Command.Root class="flex flex-col h-full">
				<KmSearchInput />
				<KmList />
			</Command.Root>
		{:else if uiState.activeView === 'detail' && uiState.selectedItem}
			<div class="flex flex-col max-h-[95vh] w-full">
				<KmActionHeader />
				<div class="flex-1 overflow-y-auto p-6 space-y-5">
					<KmTitle id={uiState.selectedItem.id} title={uiState.selectedItem.title} />
					{#if uiState.selectedItem.revisionHistory && uiState.selectedItem.revisionHistory.length > 0}
						<KmRevisionTable revisionHistory={uiState.selectedItem.revisionHistory} />
					{/if}
					<Markdown content={uiState.selectedItem.content} />
				</div>
				<div class="border-t border-border bg-card p-4 flex items-center justify-end space-x-3">
					<Button variant="ghost" size="sm" onclick={uiState.backToList}>Cancel</Button>
					<Button size="sm" onclick={handleActionPrompt} class="space-x-1.5">
						<MessageSquarePlus class="h-4 w-4" />
						<span>Prompt Assistant</span>
					</Button>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
