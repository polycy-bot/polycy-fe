import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				edge: true
			})
		})
	],
	optimizeDeps: {
		include: [
			'@lucide/svelte',
			'@lucide/svelte/icons/check',
			'@lucide/svelte/icons/moon',
			'@lucide/svelte/icons/search',
			'@lucide/svelte/icons/sun',
			'@lucide/svelte/icons/x',
			'bits-ui',
			'marked',
			'mode-watcher',
			'tailwind-merge',
			'tailwind-variants'
		]
	}
});
