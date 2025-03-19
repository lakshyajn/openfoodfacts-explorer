<script lang="ts">
	import Logo from '$lib/ui/Logo.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import '../app.css';
	import 'leaflet/dist/leaflet.css';
	import { t } from '$lib/translations';

	let searchQuery: string = $state('');

	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const GITHUB_REPO_URL = 'https://github.com/openfoodfacts/openfoodfacts-explorer';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
  setTimeout(() => {
    injectSpeedInsights({
      dsn: "", 
      beforeSend: (event) => {
        // Only send events for production
        if (window.location.hostname === 'localhost') {
          return null;
        }
        return event;
      },
    });
  }, 0);
});

	function updateSearchQuery(url: URL) {
		searchQuery = url.searchParams.get('q') ?? '';
	}
	// update searchQuery when the ?q parameter changes
	$effect(() => {
		updateSearchQuery(page.url);
	});

	function gotoProductsSearch() {
		goto('/products/search?q=' + searchQuery);
	}

	let searchActive = $state(false);
	let accordionOpen = $state(false);
</script>

<svelte:head>
	<title>OFF Explorer</title>
	<meta name="description" content="Open Food Facts Explorer - Discover food products information worldwide" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://images.openfoodfacts.org" crossorigin="anonymous" />
	<link rel="preconnect" href="https://static.openfoodfacts.org" crossorigin="anonymous" />
	<!-- Inline critical CSS -->
	<style>
		/* Critical CSS for above-the-fold content */
		.navbar { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; }
		@media (max-width: 768px) { .navbar { padding: 0.25rem 0.5rem; } }
		.navbar-start, .navbar-end, .navbar-center { display: flex; align-items: center; }
		@media (max-width: 768px) { .md\\:flex { display: none; } }
		.container { width: 100%; margin-left: auto; margin-right: auto; padding: 0 1rem; }
		.btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.5rem; padding: 0.5rem 1rem; font-weight: 500; }
		.btn-secondary { background-color: var(--color-secondary); color: var(--color-secondary-content); }
		.input { padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #ccc; }
		.join { display: flex; }
		.join-item:not(:first-child) { border-top-left-radius: 0; border-bottom-left-radius: 0; }
		.join-item:not(:last-child) { border-top-right-radius: 0; border-bottom-right-radius: 0; }
	</style>
</svelte:head>

<!-- Rest of the component remains the same -->
<div class="navbar hidden md:flex">
	<div class="navbar-start">
		<a href="/"> <Logo /> </a>
	</div>
	<div class="navbar-center">
		<div class="form-control">
			<div>
				<div class="join">
					<input
						type="text"
						bind:value={searchQuery}
						class="input join-item input-bordered xl:w-full"
						placeholder="Query or barcode"
						onkeydown={(e) => {
							if (e.key === 'Enter' && searchQuery.trim() !== '') {
								gotoProductsSearch();
							}
						}}
					/>
					<button
						class="btn btn-square btn-secondary join-item px-10"
						onclick={() => gotoProductsSearch()}
						disabled={searchQuery == null || searchQuery.trim() === ''}
					>
						Go
					</button>
				</div>

				<a
					class="btn btn-secondary ms-4 px-5 text-lg"
					href="/qr"
					title="Scan a barcode"
					aria-label="Scan a barcode"
				>
					<span class="icon-[mdi--barcode-scan] h-6 w-6"></span>
				</a>
			</div>
		</div>
	</div>

	<div class="navbar-end gap-2">
		<a class="btn btn-outline link" href="/folksonomy">{$t('common.folksonomy')}</a>
		<a class="btn btn-outline link" href="/settings">{$t('common.settings')}</a>
		<a
			class="btn btn-outline link"
			href={GITHUB_REPO_URL}
			target="_blank"
			aria-label={$t('common.github')}
		>
			<span class="icon-[mdi--github] h-8 w-8"></span>
		</a>
	</div>
</div>

<div class="mx-4 md:hidden">
	<div class="navbar bg-base-100 mx-auto mt-2 mb-8 max-w-7xl">
		<div class="navbar-start">
			<a href="/">
				<Logo />
			</a>
		</div>
		<div class="navbar-end flex gap-2">
			<button
				aria-label="Search"
				class="btn btn-square btn-secondary text-lg"
				onclick={() => {
					searchActive = !searchActive;
				}}
			>
				<i class="icon-[mdi--magnify]"></i>
			</button>
			<a
				class="btn btn-square btn-secondary text-lg"
				href="/qr"
				title="Scan a barcode"
				aria-label="Scan a barcode"
			>
				<span class="icon-[mdi--barcode-scan] h-6 w-6"></span>
			</a>
			<button
				class="btn btn-square btn-secondary text-lg"
				onclick={() => {
					accordionOpen = !accordionOpen;
				}}
			>
				{#if accordionOpen}
					<i class="icon-[mdi--close]"></i>
				{:else}
					<i class="icon-[mdi--menu]"></i>
				{/if}
			</button>
		</div>
	</div>
	{#if searchActive}
		<div class="join -mt-8 w-full">
			<input
				type="text"
				bind:value={searchQuery}
				class="input join-item input-bordered w-full"
				placeholder="Query or barcode"
				onkeydown={(e) => {
					if (e.key === 'Enter' && searchQuery.trim() !== '') {
						gotoProductsSearch();
					}
				}}
			/>
			<button
				class="btn btn-square btn-secondary join-item"
				onclick={() => gotoProductsSearch()}
				disabled={searchQuery == null || searchQuery.trim() === ''}
			>
				Go
			</button>
		</div>
	{/if}
	<div class:hidden={!accordionOpen} class="mt-3 flex flex-wrap justify-center gap-2">
		<a class="btn btn-outline link" href="/folksonomy">
			{$t('common.folksonomy')}
		</a>
		<a class="btn btn-outline link" href="/settings">
			{$t('common.settings')}
		</a>
		<a
			class="btn btn-outline link"
			href={GITHUB_REPO_URL}
			target="_blank"
			aria-label={$t('common.github')}
		>
			<span class="icon-[mdi--github] h-6 w-6"></span>
		</a>
	</div>
</div>

<div class="container mx-auto my-2 flex flex-col gap-4 px-4 xl:max-w-6xl">
	{@render children?.()}
</div>

<Footer />