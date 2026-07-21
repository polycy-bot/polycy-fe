<script lang="ts">
	let { children } = $props();
</script>

<div class="w-full bg-gbluelight-500 p-2 text-sm font-bold text-yellow-200">
	{@render children?.()}
</div>
