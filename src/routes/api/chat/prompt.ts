// src/routes/api/chat/prompt.ts
import type { ContextMatch } from './context';
import {
	AGENT_INSTRUCTIONS,
	POLICY_FOUND_INSTRUCTION,
	POLICY_NOT_FOUND_GAURDRAIL
} from './policyAssistant';

export interface FrontendMessage {
	role: 'user' | 'assistant';
	content: string;
}

/**
 * Combines retrieved JSON data blocks into a structured Markdown injection
 * system prompt for the Gemini LLM, wrapping agent instructions.
 */
export function buildSystemInstruction(matches: ContextMatch[]): string {
	if (matches.length === 0) {
		return `${AGENT_INSTRUCTIONS}\n\n${POLICY_NOT_FOUND_GAURDRAIL}
    `;
	}
	const contextBlock = matches
		.map(
			(m, index) =>
				`### [Document Reference #${index + 1}]\n**Source Link:** ${m.source}\n${m.text}`
		)
		.join('\n\n========================================\n\n');

	return `${AGENT_INSTRUCTIONS}\n\n${POLICY_FOUND_INSTRUCTION}\n\n${contextBlock}`;
}
export function formatGeminiHistory(history: FrontendMessage[]) {
	return history.map((msg) => ({
		// Gemini maps conversations to 'user' and 'model'
		role: msg.role === 'assistant' ? 'model' : 'user',
		parts: [{ text: msg.content }]
	}));
}
