import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: vitePreprocess({
		// Enhanced preprocessing settings
		postcss: true,
		// Optimize style processing
		scss: {
			prependData: '@import "src/styles/variables.scss";'
		},
		// Better minification for embedded styles
		style: ({ content }) => {
			return {
				code: content
					.replace(/\s{2,}/g, ' ')
					.replace(/\n/g, '')
					.trim()
			};
		}
	}),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			//optimize for edge runtime
			runtime: 'edge',
			regions: ['iad1', 'fra1', 'syd1'], //optional
		}),
		csp: {
			directives: {
				'script-src': ['self', 'https://va.vercel-scripts.com/'],
				'img-src': [
					'self',
					'data:',
					'https://*.openfoodfacts.org/',
					'https://tile.openstreetmap.org'
				],
				'style-src': ['self', 'unsafe-inline'],
				'frame-ancestors': ['none']
			}
		},
		version: {
			name: Date.now().toString()
		},
		inlineStyleThreshold: 8192, 
		
		//asset optimization
		files: {
			assets: 'static'
		},
		
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				console.warn(`Warning: ${path} referred from ${referrer} failed to prerender: ${message}`);
				return;
			}
		}
	}
};

export default config;