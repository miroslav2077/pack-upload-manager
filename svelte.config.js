import adapterAuto from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


let adapter;

if (process.env.SST === 'true') {
	const { default: sstAdapter } = await import('svelte-kit-sst');
	adapter = sstAdapter();
} else {
	adapter = adapterAuto();
}


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: { adapter }
};

export default config;
