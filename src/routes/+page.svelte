<script lang="ts">
	import ChatBox from '$lib/components/ChatBox.svelte';
	import InfoBanner from '$lib/components/InfoBanner.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<div class="flex flex-col w-screen h-[95vh] lg:h-screen p-2">
	<NavBar />
	<InfoBanner>ℹ️ This a technical demo built for innovation month 2026</InfoBanner>
	<ChatBox />
</div>
