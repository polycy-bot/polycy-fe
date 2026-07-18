<script lang="ts">
	import AssistantMessage from './AssistantMessage.svelte';
	import ChatInputComponent from './ChatInputComponent.svelte';
	import UserMessage from './UserMessage.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Send } from '@lucide/svelte';
	import { chatService } from '$lib/services/chat.svelte';

	let inputValue = $state('');
	let chatContainer = $state<HTMLDivElement | null>(null);
	$effect(() => {
		if (chatContainer && chatService.messages.length) {
			chatContainer.scrollTo({
				top: chatContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});
	async function handleSendMessage(e: SubmitEvent) {
		e.preventDefault();
		const queryText = inputValue.trim();
		if (!queryText || chatService.isStreaming) return;
		inputValue = '';
		await chatService.sendMessage(queryText);
	}
</script>

<div
	class="bg-background border-border flex flex-1 flex-col w-full rounded-b-2xl border shadow-xl overflow-hidden mx-auto"
>
	<div bind:this={chatContainer} class="flex-1 overflow-y-auto p-2 scrollbar-thin">
		{#each chatService.messages as msg (msg.id)}
			{#if msg.role === 'assistant'}
				<AssistantMessage message={msg.text || 'Thinking...'} timestamp={msg.timestamp} />
			{:else}
				<UserMessage message={msg.text} timestamp={msg.timestamp} />
			{/if}
		{/each}
	</div>

	<div class="bg-card border-border border-t p-4">
		<form class="flex items-center space-x-2" onsubmit={handleSendMessage}>
			<ChatInputComponent bind:value={inputValue} disabled={chatService.isStreaming} />
			<Button
				type="submit"
				size="icon"
				disabled={chatService.isStreaming || !inputValue.trim()}
				class="rounded-xl shrink-0"
			>
				<Send class="h-5 w-5" />
				<span class="sr-only">Send Message</span>
			</Button>
		</form>
	</div>
</div>
