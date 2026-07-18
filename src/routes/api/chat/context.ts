import knowledgeBase from '../knowledge.json';
import { STOP_WORDS } from './policyAssistant';

export interface ContextMatch {
	title: string;
	text: string;
	source: string;
	score?: number;
}

interface RevisionEntry {
	date: string;
	status: string;
	link: string;
	is_current_view: boolean;
}

interface DocumentBody {
	text: string;
	metadata: {
		title: string;
		source_url: string;
		revision_history: RevisionEntry[];
	};
}

const MIN_SCORE_THRESHOLD = 10;

export async function getContextByKeyword(query: string): Promise<ContextMatch[]> {
	if (!query) return [];
	const normalizedQuery = query.toLowerCase().trim();
	const queryWords = normalizedQuery
		.split(/\s+/)
		.filter((word) => word.length > 2 && !STOP_WORDS.has(word));
	if (queryWords.length === 0 && normalizedQuery.length > 0) {
		queryWords.push(normalizedQuery);
	}

	const matches: ContextMatch[] = [];

	try {
		for (const [docId, docData] of Object.entries(knowledgeBase as Record<string, DocumentBody>)) {
			if (!docData || !docData.metadata) continue;
			const textContent = (docData.text || '').toLowerCase();
			const lowerDocId = docId.toLowerCase();
			const lowerTitle = (docData.metadata.title || '').toLowerCase();
			let score = 0;
			if (textContent.includes(normalizedQuery)) score += 10;
			if (lowerDocId.includes(normalizedQuery) || lowerTitle.includes(normalizedQuery)) score += 20;

			if (queryWords.length > 0) {
				let matchedWordsCount = 0;
				for (const word of queryWords) {
					let wordMatched = false;
					if (word.includes('/') && lowerDocId.includes(word)) {
						score += 15;
						wordMatched = true;
					}
					if (lowerDocId.includes(word) || lowerTitle.includes(word)) {
						score += 5;
						wordMatched = true;
					}
					if (textContent.includes(word)) {
						score += 2;
						wordMatched = true;
					}
					if (wordMatched) matchedWordsCount++;
				}
				const matchRatio = matchedWordsCount / queryWords.length;
				if (matchRatio < 0.25 && score < 10) {
					continue;
				}
			}
			if (score > MIN_SCORE_THRESHOLD) {
				matches.push({
					title: docId,
					text: `[Document Ref: ${docId}] Title: ${docData.metadata.title}\nContent:\n${docData.text}`,
					source: docData.metadata.source_url,
					score: score
				});
			}
		}
		return matches.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
	} catch (e) {
		console.error('Context search error:', e);
		return [];
	}
}
