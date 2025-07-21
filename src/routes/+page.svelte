<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Table from '$lib/components/ui/table/index';
	import UploadForm from '$lib/components/UploadForm.svelte';
	import type { PageProps } from './$types';
	import { toast } from 'svelte-sonner';
	let { data }: PageProps = $props();

	let open = $state<boolean>(false);

	function handleFormSuccess(message: string) {
		toast.success(message);
		open = false;
	}
</script>

<div>
	<Card.Root class="container mx-auto mt-10 py-4">
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
		<Card.Content>
			<Table.Root>
				<Table.Caption></Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>Content title</Table.Head>
						<Table.Head>Category</Table.Head>
						<Table.Head>Roles</Table.Head>
						<Table.Head class="text-right">Download</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.results as upload (upload.id)}
						<Table.Row>
							<Table.Cell class="font-medium">{upload.title}</Table.Cell>
							<Table.Cell>{upload.category}</Table.Cell>
							<Table.Cell>{upload.roles}</Table.Cell>
							<Table.Cell class="text-right"
								><Button href={`/uploads/${upload.filePath}`}>Download</Button></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer>
					<!-- <Table.Row>
						<Table.Cell colspan={3}>Total</Table.Cell>
						<Table.Cell class="text-right">$2,500.00</Table.Cell>
					</Table.Row> -->
				</Table.Footer>
			</Table.Root>
		</Card.Content>
		<Card.Footer class="flex-col gap-2"></Card.Footer>
	</Card.Root>
</div>
