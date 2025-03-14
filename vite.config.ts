import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite'
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import { version as packageVersion } from './package.json';

export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Open Food Facts Explorer',
				short_name: 'FoodFacts',
				description: 'A Progressive Web App to explore food facts',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				display: 'standalone',
				icons: []
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/images\.openfoodfacts\.org\/.*/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'food-images-cache',
							expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } // Cache for a week
						}
					}
				]
			}
		})
	],
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageVersion)
	}
});
