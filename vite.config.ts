import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite'
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(resolve(__dirname, './package.json'), 'utf8'));
const packageVersion = packageJson.version;

export default defineConfig({
	plugins: [
		sveltekit(),
		imagetools({
			defaultDirectives: new URLSearchParams([
				['format', 'webp;avif'], // Prioritize modern formats
				['quality', '80'],
				['width', '320;640;960'],
				['withoutEnlargement', '']
			])
		}),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
			manifest: {
				name: 'Open Food Facts Explorer',
				short_name: 'FoodFacts',
				description: 'A Progressive Web App to explore food facts',
				theme_color: '#201a17',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: '/icons/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icons/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/images\.openfoodfacts\.org\/.*/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'food-images-cache',
							expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 } // Cache for a week
						}
					},
					{
						urlPattern: /^https:\/\/static\.openfoodfacts\.org\/.*/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'static-assets-cache',
							expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 } // Cache for a month
						}
					},
					{
						urlPattern: /\.(?:js|css)$/,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'static-resources',
							expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 } // 1 day
						}
					}
				],
				skipWaiting: true,
				clientsClaim: true,
				inlineWorkboxRuntime: true
			}
		})
	],
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageVersion),
		'APP_VERSION': JSON.stringify(packageVersion)
	},
	build: {
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				ecma: 2020,
				passes: 2
			},
			mangle: {
				safari10: false
			}
		},
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					//efficient chunks based on common imports
					if (id.includes('node_modules/svelte')) {
						return 'vendor-svelte';
					}
					if (id.includes('node_modules')) {
						return 'vendor';
					}
					if (id.includes('translations')) {
						return 'translations';
					}
					if (id.includes('/lib/ui/')) {
						return 'ui-components';
					}
				},
				entryFileNames: 'entries/[name]-[hash].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		}
	},
	optimizeDeps: {
		include: [
			'svelte', 
			'svelte/internal', 
			'svelte/store',
			'@vercel/speed-insights/sveltekit'
		],
		exclude: ['big-libraries-not-needed-immediately']
	},
	css: {
		postcss: {
			map: false 
		},
		devSourcemap: false
	}
});