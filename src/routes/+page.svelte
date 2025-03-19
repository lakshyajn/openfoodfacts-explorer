<script lang="ts">
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	import Card from '$lib/ui/Card.svelte';
	import Logo from '$lib/ui/Logo.svelte';
	import SmallProductCard from '$lib/ui/SmallProductCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let products = [];
	
	let loadingContent = true;

	onMount(async () => {
		try {
			// Use requestIdleCallback for non-critical operations
			if ('requestIdleCallback' in window) {
				requestIdleCallback(async () => {
					products = await data.streamed.products;
					loadingContent = false;
				});
			} else {
				setTimeout(async () => {
					products = await data.streamed.products;
					loadingContent = false;
				}, 200);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			loadingContent = false;
		}
	});
</script>

<svelte:head>
	<!-- Preload critical assets -->
	<link rel="preconnect" href="https://images.openfoodfacts.org" crossorigin="anonymous" />
	<link rel="preload" as="image" href="https://static.openfoodfacts.org/images/logos/off-logo-horizontal-light.svg" fetchpriority="high" />
	<link rel="preload" as="image" href="https://static.openfoodfacts.org/images/logos/off-logo-horizontal-dark.svg" media="(prefers-color-scheme: dark)" fetchpriority="high" />
	<title>Open Food Facts Explorer</title>
	
	<!-- Preload critical fonts if any -->
	<!-- <link rel="preload" as="font" href="/fonts/your-critical-font.woff2" type="font/woff2" crossorigin="anonymous" /> -->
</svelte:head>

<div class="mx-auto my-4 flex flex-col items-center md:container xl:max-w-6xl">
	<Card>
		<div class="card-body items-center text-center">
			<h1 class="card-title mb-4 block text-2xl md:flex">
				{$t('home.welcome')}
				<div class="block xl:inline-block">
					<Logo />
				</div>
				Explorer!
			</h1>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p>{@html $t('home.intro_1')}</p>
			<p>{$t('home.intro_2')}</p>
		</div>
	</Card>

	<div class="mt-8 w-full">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
			{#if loadingContent}
				<!-- Reserve space for loading content to prevent layout shifts -->
				{#each [...Array(4).keys()] as i (i)}
					<div class="skeleton dark:bg-base-300 h-28 bg-white p-4 shadow-md" style="min-height: 112px; min-width: 100%;"></div>
				{/each}
			{:else}
				{#each products as state (state.product.code)}
					<SmallProductCard product={state.product} />
				{/each}
			{/if}
		</div>
	</div>
</div>