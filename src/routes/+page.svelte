<script lang="ts">
	import ChatBox from '$lib/components/ChatBox.svelte';
	import InfoBanner from '$lib/components/InfoBanner.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<div class="flex h-[95vh] w-screen flex-col p-2 lg:h-screen">
	<NavBar />
	<InfoBanner
		>ℹ️ This a technical demo built for innovation month 2026 - Output is not authoratative and can
		be innacurate. Ensure to conduct additional research to make informed decisions.<br /><br />
		<a
			href="https://asbedb.dev/musings/innovation-month-2026/"
			target="_blank"
			class="font-bold text-yellow-500 underline decoration-1 hover:text-white"
		>
			Click here to read about this project.</a
		>
	</InfoBanner>
	<ChatBox />
</div>
