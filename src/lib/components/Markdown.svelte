<script lang="ts">
	import { marked, type Tokens } from 'marked';

	let { content = '' }: { content: string } = $props();
	let tokens = $derived(marked.lexer(content));

	interface TextToken {
		text: string;
	}
	interface TypedToken {
		type: string;
	}
	interface ParentToken {
		tokens: Tokens.Generic[];
	}

	function isTableToken(token: Tokens.Generic | unknown): token is Tokens.Table {
		return (
			typeof token === 'object' &&
			token !== null &&
			'type' in token &&
			(token as { type: string }).type === 'table'
		);
	}

	function isListToken(token: Tokens.Generic | unknown): token is Tokens.List {
		return (
			typeof token === 'object' &&
			token !== null &&
			'type' in token &&
			(token as { type: string }).type === 'list' &&
			'items' in token
		);
	}

	function hasTextProperty(token: unknown): token is TextToken {
		return typeof token === 'object' && token !== null && 'text' in token;
	}

	function getTokenText(token: unknown): string {
		return hasTextProperty(token) ? token.text : '';
	}

	function hasTypeProperty(token: unknown): token is TypedToken {
		return typeof token === 'object' && token !== null && 'type' in token;
	}

	function hasNestedTokens(token: unknown): token is ParentToken {
		return (
			typeof token === 'object' &&
			token !== null &&
			'tokens' in token &&
			Array.isArray((token as ParentToken).tokens)
		);
	}
</script>

{#snippet renderInline(inlineTokens: Tokens.Generic[] | undefined)}
	{#if inlineTokens}
		{#each inlineTokens as inlineToken, inlineIdx (inlineIdx)}
			{#if hasTypeProperty(inlineToken)}
				{#if inlineToken.type === 'strong'}
					<strong class="font-bold text-foreground">{getTokenText(inlineToken)}</strong>
				{:else if inlineToken.type === 'em'}
					<em class="italic">{getTokenText(inlineToken)}</em>
				{:else if inlineToken.type === 'link'}
					<a
						href={inlineToken.href}
						class="text-gbluelight-500 hover:underline font-medium"
						target="_blank"
						rel="noopener noreferrer"
					>
						{#if inlineToken.tokens}
							{@render renderInline(inlineToken.tokens)}
						{:else}
							{inlineToken.text}
						{/if}
					</a>
				{:else if inlineToken.type === 'codespan'}
					<code class="bg-muted/60 rounded px-1 py-0.5 text-xs font-mono">{inlineToken.text}</code>
				{:else if inlineToken.type === 'del'}
					<del>{@render renderInline(inlineToken.tokens)}</del>
				{:else if inlineToken.type === 'br'}
					<br />
				{:else if (inlineToken.type === 'text' || inlineToken.type === 'paragraph') && hasNestedTokens(inlineToken)}
					{@render renderInline(inlineToken.tokens)}
				{:else if isListToken(inlineToken)}
					<ul class="list-disc ml-5 space-y-1 text-sm">
						{#each inlineToken.items as nestedItem, nestedIdx (nestedIdx)}
							<li>
								{#if hasNestedTokens(nestedItem)}
									{@render renderInline(nestedItem.tokens)}
								{:else}
									{getTokenText(nestedItem)}
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<span>{getTokenText(inlineToken)}</span>
				{/if}
			{:else}
				<span>{getTokenText(inlineToken)}</span>
			{/if}
		{/each}
	{/if}
{/snippet}

<div class="markdown-body">
	{#each tokens as token, index (index)}
		{#if token.type === 'heading'}
			{#if token.depth === 1}
				<h1 class="lg:text-2xl font-bold tracking-tight text-foreground">
					{@render renderInline(token.tokens)}
				</h1>
			{:else if token.depth === 2}
				<h2 class="lg:text-xl font-semibold tracking-tight text-foreground">
					{@render renderInline(token.tokens)}
				</h2>
			{:else}
				<h3 class="lg:text-lg font-semibold tracking-tight text-foreground">
					{@render renderInline(token.tokens)}
				</h3>
			{/if}
		{:else if token.type === 'paragraph'}
			<p class="leading-relaxed">
				{#if hasNestedTokens(token)}
					{@render renderInline(token.tokens)}
				{:else}
					{getTokenText(token)}
				{/if}
			</p>
		{:else if isListToken(token)}
			{#if token.ordered}
				<ol class="list-decimal lg:ml-5 space-y-1 text-sm" start={token.start || 1}>
					{#each token.items as item, itemIdx (itemIdx)}
						<li class="ml-4">
							{#if hasNestedTokens(item)}
								{@render renderInline(item.tokens)}
							{:else}
								{getTokenText(item)}
							{/if}
						</li>
					{/each}
				</ol>
			{:else}
				<ul class="list-disc ml-5 space-y-1 text-sm">
					{#each token.items as item, itemIdx (itemIdx)}
						<li class="lg:ml-12">
							{#if hasNestedTokens(item)}
								{@render renderInline(item.tokens)}
							{:else}
								{getTokenText(item)}
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		{:else if isTableToken(token)}
			<div class="my-4 w-full overflow-x-auto rounded-lg border border-border bg-background/50">
				<table class="w-full text-left text-xs border-collapse">
					<thead>
						<tr class="border-b border-border bg-muted/40 transition-colors">
							{#each token.header as headerCell, hIdx (hIdx)}
								<th class="p-3 font-semibold tracking-wide bg-gbluedark-500 text-white">
									{@render renderInline(headerCell.tokens)}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-border/60">
						{#each token.rows as row, rIdx (rIdx)}
							<tr class="hover:bg-muted/20 transition-colors">
								{#each row as cell, cIdx (cIdx)}
									<td class="p-3 text-muted-foreground align-top">
										{@render renderInline(cell.tokens)}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if token.type === 'space' || token.type === 'br'}
			<div class="h-2"></div>
		{:else}
			<span>{getTokenText(token)}</span>
		{/if}
	{/each}
</div>
