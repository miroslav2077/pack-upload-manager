<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head><title>Pack - File manager</title></svelte:head>

<Toaster />

{@render children()}
