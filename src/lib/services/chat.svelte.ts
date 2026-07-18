import { getCurrentTime } from '$lib/utils/chatHelpers';
export interface UIMessage {
	id: number;
	role: 'user' | 'assistant';
	text: string;
	timestamp: string;
}
let _isStreaming = $state(false);
const _messages = $state<UIMessage[]>([
	{
		id: 1,
		role: 'assistant',
		text: 'Hello! I am your custom Policy Assistant. Ask me anything about our settlement codes or trustee assessment rules.',
		timestamp: getCurrentTime()
	}
]);
export async function sendMessage(queryText: string) {
	const cleanQuery = queryText.trim();
	if (!cleanQuery || _isStreaming) return;
	_messages.push({
		id: Date.now(),
		role: 'user',
		text: cleanQuery,
		timestamp: getCurrentTime()
	});
	const botMessageId = Date.now() + 1;
	_messages.push({
		id: botMessageId,
		role: 'assistant',
		text: '',
		timestamp: getCurrentTime()
	});
	_isStreaming = true;
	try {
		const apiPayload = _messages.slice(0, -1).map((m) => ({
			role: m.role,
			content: m.text
		}));
		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: apiPayload })
		});
		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(errData.error || 'Failed to fetch streaming chunks');
		}
		const reader = response.body?.getReader();
		const decoder = new TextDecoder();
		if (!reader) throw new Error('ReadableStream processing completely unavailable.');
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const textChunk = decoder.decode(value, { stream: true });
			const msgIndex = _messages.findIndex((m) => m.id === botMessageId);
			if (msgIndex !== -1) {
				_messages[msgIndex].text += textChunk;
			}
		}
	} catch (err: unknown) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		const msgIndex = _messages.findIndex((m) => m.id === botMessageId);
		if (msgIndex !== -1) {
			_messages[msgIndex].text = `Error generating message stream: ${errorMsg}`;
		}
	} finally {
		_isStreaming = false;
	}
}

export const chatService = {
	get messages() {
		return _messages;
	},
	get isStreaming() {
		return _isStreaming;
	},
	sendMessage
};
