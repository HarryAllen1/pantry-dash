<script lang="ts">
	import { Button, Card, Heading, P, Tooltip } from 'flowbite-svelte';

	export let data;
</script>

<svelte:head>
	<title>Custom Recipes | Pantry Dash</title>
</svelte:head>

<div class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16">
	<Heading class="text-center">Custom Recipes</Heading>

	<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
		{#each data.recipes as { id, image, title }}
			<Card img={image} class="card" href="/custom/{id}">
				<Heading tag="h5" class="whitespace-nowrap relative overflow-hidden">
					{title}
					<!-- div to make the text fade out -->
					<div
						class="text-fadeout absolute top-0 bottom-0 w-16 right-0 bg-gradient-to-r from-transparent to-gray-800 pointer-events-none"
					/>
				</Heading>
				<Tooltip>{title}</Tooltip>
			</Card>
		{:else}
			<div />
			<div class="flex flex-col items-center">
				<P class="text-center">No custom recipes</P>
				<Button href="/custom/create" class="mt-4">Create</Button>
			</div>
			<div />
		{/each}
	</div>
</div>

<style>
	:global(.card:hover div.text-fadeout) {
		@apply to-gray-700;
	}
</style>
