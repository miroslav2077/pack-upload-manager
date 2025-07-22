<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import type { Snippet } from 'svelte';

	let {
		headers,
		rows,
		key = 'id',
		rowTemplate
	}: {
		headers: Header[];
		rows: any[];
		key?: string;
		rowTemplate: Snippet<[any, string]>;
	} = $props();

	type Header = {
		label: string;
		key: string;
	};
</script>

<Table.Root>
	<Table.Caption></Table.Caption>
	<Table.Header>
		<Table.Row>
			{#each headers as header (header.key)}
				<Table.Head>{header.label}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each rows as row (row[key])}
			<Table.Row>
				{#each headers as header (header.key)}
					{#if rowTemplate}
						{@render rowTemplate(row[header.key], header.key)}
					{/if}
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
	<Table.Footer></Table.Footer>
</Table.Root>
