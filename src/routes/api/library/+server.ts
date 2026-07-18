import { json, type RequestHandler } from '@sveltejs/kit';
import knowledgeBase from '../knowledge.json';

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
		category: string;
		source_url: string;
		revision_history: RevisionEntry[];
	};
}

export const GET: RequestHandler = async () => {
	try {
		const typedKnowledge = knowledgeBase as Record<string, DocumentBody>;
		const structuredLibrary = Object.entries(typedKnowledge).map(([id, doc]) => ({
			id,
			title: doc.metadata?.title || id,
			category: doc.metadata?.category || 'Law administration practice statements',
			content: doc.text || '',
			sourceUrl: doc.metadata?.source_url || '',
			revisionHistory: doc.metadata?.revision_history || []
		}));

		return json(structuredLibrary);
	} catch (error) {
		console.error('Failed to export raw library array:', error);
		return json({ error: 'Failed to parse library dataset' }, { status: 500 });
	}
};
