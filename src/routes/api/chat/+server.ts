import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GoogleGenAI } from '@google/genai';
import type { RequestHandler } from './$types';
import { getContextByKeyword } from './context';
import { buildSystemInstruction, formatGeminiHistory } from './prompt';

export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const apiKey = env.GEMINI_API_KEY;
		if (!apiKey) {
			return json(
				{ error: 'Server Configuration Error: GEMINI_API_KEY is not defined.' },
				{ status: 500 }
			);
		}
		const ai = new GoogleGenAI({ apiKey: apiKey });
		const data = await request.json().catch(() => ({}));
		const conversationHistory = data.messages;
		if (!conversationHistory || !Array.isArray(conversationHistory)) {
			return json({ error: "Missing or invalid 'messages' array" }, { status: 400 });
		}
		const userQuery = conversationHistory[conversationHistory.length - 1]?.content;
		if (!userQuery) {
			return json({ error: 'Last message content missing' }, { status: 400 });
		}
		const matches = await getContextByKeyword(userQuery);
		const contextRetrieved = matches.length > 0;
		const systemInstruction = buildSystemInstruction(matches);
		const geminiContents = formatGeminiHistory(conversationHistory);
		const responseStream = await ai.models.generateContentStream({
			model: 'gemini-3.1-flash-lite',
			contents: geminiContents,
			config: { systemInstruction }
		});
		const stream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				for await (const chunk of responseStream) {
					if (chunk.text) {
						controller.enqueue(encoder.encode(chunk.text));
					}
				}
				controller.close();
			}
		});
		return new Response(stream, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'X-Content-Type-Options': 'nosniff',
				'x-context-retrieved': String(contextRetrieved)
			}
		});
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		return json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
	}
};
