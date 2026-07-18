<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	let {
		value = $bindable(),
		disabled = false
	}: {
		value: string;
		disabled: boolean;
	} = $props();
</script>

<Input
	type="text"
	bind:value
	{disabled}
	placeholder={disabled
		? 'Awaiting model response stream data...'
		: 'Ask a policy question (e.g., PS LA 2015/2 time limits)...'}
	class="flex-1 min-w-0 px-4 py-2.5 "
/>
