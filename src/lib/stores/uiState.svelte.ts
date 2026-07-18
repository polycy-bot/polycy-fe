type ActiveType = 'list' | 'detail';
type SelectedType = KnowledgeItem | null;

export interface RevisionEntry {
	date: string;
	status: string;
	link: string;
	is_current_view: boolean;
}

interface KnowledgeItem {
	id: string;
	title: string;
	category: string;
	content: string;
	sourceUrl: string;
	revisionHistory: RevisionEntry[];
}

class UiState {
	open = $state<boolean>(false);
	searchInput = $state<string>('');
	knowledgeBase = $state<KnowledgeItem[]>([]);
	isLoading = $state<boolean>(true);
	activeView = $state<ActiveType>('list');
	selectedItem = $state<SelectedType>(null);

	navigateToDetail = (item: KnowledgeItem) => {
		this.selectedItem = item;
		this.activeView = 'detail';
	};

	backToList = () => {
		this.activeView = 'list';
		this.selectedItem = null;
	};

	reset = () => {
		this.searchInput = '';
		this.activeView = 'list';
		this.selectedItem = null;
	};
}

export const uiState = new UiState();
