import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x',
		}),
	},
	vitePlugin: {
		inspector: {
			holdMode: true,
		},
	},
	onwarn: (warning, handler) => {
		// fuck accessibility
		if (warning.code.startsWith('a11y-')) return;
		handler(warning);
	},
};
export default config;
