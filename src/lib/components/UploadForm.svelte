<script lang="ts">
	import {
		categoryOptions,
		languageOptions,
		providerOptions,
		roleOptions,
		type UploadFormData
	} from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms';
	import * as Select from '$lib/components/ui/select/index';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { Button } from '$lib/components/ui/button/index';
	import Spinner from './Spinner.svelte';

	let fileInput = $state<HTMLElement | null>(null);
	let selectedFile = $state<FileList | undefined>();

	function triggerFileSelect() {
		fileInput?.click();
	}

	let { data, success, failure } = $props();

	const form = superForm<UploadFormData>(data.form);

	const { form: formData, enhance } = form;

	let loading = $state(false);

	const fileInfo = $derived.by(() => {
		if (!selectedFile || selectedFile.length === 0) return null;
		return {
			name: selectedFile[0].name,
			size: (selectedFile[0].size / 1024).toFixed(2) + ' KB',
			type: selectedFile[0].type || 'Unknown',
			lastModified: new Date(selectedFile[0].lastModified).toLocaleString()
		};
	});

	function handleResult({ result }: { result: any }) {
		loading = false;
		if (result.type === 'success' && result.data?.form?.message) {
			return success(result.data?.form?.message);
		}

		return failure(result.data?.message || 'An unexpected error happened, try again later.');
	}
	const eventsHandler = {
		onResult: handleResult,
		onSubmit: () => (loading = true)
	};
</script>

<form
	use:enhance={eventsHandler}
	method="POST"
	enctype="multipart/form-data"
	class="relative flex flex-col gap-1 {loading ? 'pointer-events-none' : ''}"
>
	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Input
					{...props}
					type="text"
					placeholder="Title*"
					bind:value={$formData.title}
					class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Textarea
					{...props}
					placeholder="Description*"
					bind:value={$formData.description}
					class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				></Textarea>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<Form.Field {form} name="category">
		<Form.Control>
			{#snippet children({ props })}
				<Select.Root type="single" bind:value={$formData.category} name={props.name}>
					<Select.Trigger
						{...props}
						class="w-full rounded border border-gray-300 px-3 py-2 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						{$formData.category || 'Category*'}
					</Select.Trigger>
					<Select.Content>
						{#each categoryOptions as option}
							<Select.Item class="w-full" value={option}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<Form.Field {form} name="language">
		<Form.Control>
			{#snippet children({ props })}
				<Select.Root type="single" bind:value={$formData.language} name={props.name}>
					<Select.Trigger
						{...props}
						class="w-full rounded border border-gray-300 px-3 py-2 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						{$formData.language || 'Language*'}
					</Select.Trigger>
					<Select.Content>
						{#each languageOptions as option}
							<Select.Item class="w-full" value={option}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<Form.Field {form} name="provider">
		<Form.Control>
			{#snippet children({ props })}
				<Select.Root type="single" bind:value={$formData.provider} name={props.name}>
					<Select.Trigger
						{...props}
						class="w-full rounded border border-gray-300 px-3 py-2 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						{$formData.provider || 'Provider*'}
					</Select.Trigger>
					<Select.Content>
						{#each providerOptions as option}
							<Select.Item class="w-full" value={option}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<Form.Field {form} name="roles">
		<Form.Control>
			{#snippet children({ props })}
				<Select.Root type="multiple" bind:value={$formData.roles} name={props.name}>
					<Select.Trigger
						{...props}
						class="w-full rounded border border-gray-300 px-3 py-2 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none"
					>
						{$formData.roles.length ? $formData.roles : 'Role'}
					</Select.Trigger>
					<Select.Content>
						{#each roleOptions as option}
							<Select.Item class="w-full" value={option}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<Form.Field {form} name="file">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center gap-2">
					<Input
						type="text"
						placeholder="No file selected*"
						value={fileInfo ? `${fileInfo.name} (${fileInfo.size})` : ''}
						class="pointer-events-none w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<Input
						{...props}
						bind:ref={fileInput}
						bind:this={$formData.file}
						bind:files={selectedFile}
						type="file"
						class="hidden"
					/>
					<Button onclick={triggerFileSelect} variant="secondary">Select file</Button>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-sm text-red-600" />
	</Form.Field>

	<div class="mt-4 flex justify-end">
		<Button type="submit">Upload</Button>
	</div>
	{#if loading}
		<div
			class="absolute top-0 right-0 bottom-0 left-0 flex h-full w-full items-center justify-center bg-white/70"
		>
			<Spinner></Spinner>
		</div>
	{/if}
</form>
