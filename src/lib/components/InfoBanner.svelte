<script lang="ts">
	let { children } = $props();
</script>

<div class="flex w-full bg-gbluelight-500 text-yellow-200 p-2 font-bold text-sm">
	{@render children?.()}
</div>
