import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	// vite: {
	// 	optimizeDeps: {
	// 		exclude: ['@fontsource','@fontsource/Sora/400.css', '@fontsource/Sora/500.css', '@fontsource/Sora/600.css', '@fontsource/Sora/700.css']
	// 	},
	// 	build: {
	// 		rollupOptions: {
	// 		 external: ['@fontsource','@fontsource/Sora/400.css', '@fontsource/Sora/500.css', '@fontsource/Sora/600.css', '@fontsource/Sora/700.css']
	// 		}
	// 	}
	// },
	kit: {
		adapter: adapter()
	}
};

export default config;
