<script lang="ts">
	import byteSize from 'byte-size';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Card from '$lib/components/ui/card/index';
	import UploadForm from '$lib/components/UploadForm.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	import DataTable from '$lib/components/DataTable.svelte';
	import * as Table from '$lib/components/ui/table/index';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import { formatDateTime } from '$lib/utils';
	let { data }: PageProps = $props();

	let open = $state<boolean>(false);

	function handleFormSuccess(message: string) {
		toast.success(message, { position: 'top-center' });
		open = false;
	}

	function handleFormFailure(message: string) {
		toast.error(message, { position: 'top-center' });
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

<section class="container mx-auto px-4 py-4 sm:py-10">
	<Card.Root class="max-h-180 py-4">
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
					<UploadForm success={handleFormSuccess} failure={handleFormFailure} {data} />
				</Dialog.Content>
			</Dialog.Root>
		</Card.Header>
		<Card.Content class="max-h-165 overflow-y-auto">
			<DataTable {headers} rows={data.results}>
				{#snippet rowTemplate(data: any, key: string)}
					{#if key === 'filePath'}
						<Table.Cell>
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger
										><Button variant="default" href={data[key]} class="min-w-50" target="_blank"
											>Download ({byteSize(data.size)})<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="lucide lucide-external-link-icon lucide-external-link"
												><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path
													d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
												/></svg
											></Button
										></Tooltip.Trigger
									>
									<Tooltip.Content>
										<p>{data.originalName}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</Table.Cell>
					{:else if key === 'createdAt'}
						<Table.Cell>{formatDateTime(data[key]) || data[key]}</Table.Cell>
					{:else}
						<Table.Cell>{data[key]}</Table.Cell>
					{/if}
				{/snippet}
			</DataTable>
		</Card.Content>
		<Card.Footer class="flex-col gap-2"></Card.Footer>
	</Card.Root>
</section>
