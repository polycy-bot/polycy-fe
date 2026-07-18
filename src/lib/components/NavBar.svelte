<script lang="ts">
	import SiteTitle from '$lib/components/SiteTitle.svelte';
	import ModeToggle from './ModeToggle.svelte';
	import KnowledgeModal from './KnowledgeModal.svelte';
</script>

<nav class="flex w-full">
	<ul class="flex w-full gap-4 bg-gbluedark-500 p-4 items-center rounded-t-2xl">
		<SiteTitle />
		<KnowledgeModal />
		<ModeToggle />
	</ul>
</nav>
