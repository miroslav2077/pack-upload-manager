<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Card from '$lib/components/ui/card/index';
	import UploadForm from '$lib/components/UploadForm.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/DataTable.svelte';
	import * as Table from '$lib/components/ui/table/index';
	import { formatDateTime } from '$lib/utils';
	let { data }: PageProps = $props();

	let open = $state<boolean>(false);

	function handleFormSuccess(message: string) {
		toast.success(message);
		open = false;
	}

	const headers = [
		{
			label: 'Content title',
			key: 'title'
		},
		{
			label: 'Description',
			key: 'description'
		},
		{
			label: 'Category',
			key: 'category'
		},
		{
			label: 'Language',
			key: 'language'
		},
		{
			label: 'Provider',
			key: 'provider'
		},
		{
			label: 'Roles',
			key: 'roles'
		},
		{
			label: 'Upload date',
			key: 'createdAt'
		},
		{
			label: 'Download',
			key: 'filePath'
		}
	];
</script>

<section class="my-10">
	<Card.Root class="container mx-auto max-h-180 py-4">
		<Card.Header class="flex justify-between">
			<div>
				<Card.Title>Resources</Card.Title>
			</div>
			<Dialog.Root bind:open>
				<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>Upload</Dialog.Trigger>
				<Dialog.Content class="w-full max-w-7xl">
					<Dialog.Header>
						<Dialog.Title>Upload Resource</Dialog.Title>
					</Dialog.Header>
					<UploadForm success={handleFormSuccess} {data} />
				</Dialog.Content>
			</Dialog.Root>
		</Card.Header>
		<Card.Content class="max-h-165 overflow-y-scroll">
			<DataTable {headers} rows={data.results}>
				{#snippet rowTemplate(data: any, key: string)}
					{#if key === 'filePath'}
						<Table.Cell><Button href={data} target="_blank">Download</Button></Table.Cell>
					{:else if key === 'createdAt'}
						<Table.Cell>{formatDateTime(data) || data}</Table.Cell>
					{:else}
						<Table.Cell>{data}</Table.Cell>
					{/if}
				{/snippet}
			</DataTable>
		</Card.Content>
		<Card.Footer class="flex-col gap-2"></Card.Footer>
	</Card.Root>
</section>
