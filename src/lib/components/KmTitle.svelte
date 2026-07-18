<script lang="ts">
	interface Props {
		title: string;
		id: string;
	}
	let { title, id }: Props = $props();
</script>

<div>
	<h2 class="text-xl font-bold tracking-tight text-foreground">
		{title}
	</h2>
	<p class="text-xs text-muted-foreground mt-0.5">
		ID Ref: <span class="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">{id}</span>
	</p>
</div>
