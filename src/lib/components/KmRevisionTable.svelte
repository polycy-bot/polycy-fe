<script lang="ts">
	import type { RevisionEntry } from '$lib/stores/uiState.svelte';

	interface Props {
		revisionHistory: RevisionEntry[];
	}

	let { revisionHistory }: Props = $props();
</script>

<div class="border border-foreground rounded-lg p-3.5 space-y-2">
	<h3 class="text-xs font-semibold tracking-wide uppercase px-1">Document Revision Timeline</h3>

	<div class="max-h-32 overflow-y-auto pr-1">
		<table class="w-full text-left text-xs border-collapse">
			<thead>
				<tr class="h-8 items-center font-semibold bg-gbluelight-500 text-white">
					<th class="px-2">Date</th>
					<th>Status</th>
					<th>Actions / View</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border/30">
				{#each revisionHistory as history (`${history.date}-${history.status}`)}
					<tr class="hover:bg-muted/20 transition-colors">
						<td class="py-2 font-medium text-muted-foreground pl-1">
							{history.date}
						</td>
						<td class="py-2 text-foreground">
							{history.status || 'Initial Release'}
						</td>
						<td class="py-2 text-right pr-1">
							<div class="flex items-center justify-end space-x-2">
								{#if history.is_current_view}
									<span
										class="bg-primary/10 text-primary font-medium text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap"
									>
										Active View
									</span>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
