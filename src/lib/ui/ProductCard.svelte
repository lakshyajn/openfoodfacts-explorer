<script lang="ts">
	type Product = {
		code: string;
		image_front_small_url?: string;
		product_name?: string;
	};

	let { product }: { product: Product } = $props();
</script>


	href="/products/{product.code}"
	class="dark:bg-base-300 flex h-24 flex-row items-center rounded-lg bg-white p-2"
>
	{#if product.image_front_small_url}
		<img src={product.image_front_small_url} class="mr-4 h-20 w-16" alt="Product front" loading="lazy" width="64" height="80" fetchpriority="low" decoding="async" />
	{/if}
	<div class="link no-underline">
		{product.product_name ?? product.code}
	</div>
</a>