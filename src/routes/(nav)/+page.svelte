<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { complexSearch } from '$lib/spoonacular';
	import type { SpoonacularRecipeInfo } from '$lib/spoonacular/types';
	import { A, Button, Heading, Input, P } from 'flowbite-svelte';

	export let data;

	let filter = '';
	$: filteredRecipes = data.recipes.results.length
		? (data.recipes.results.filter((r) =>
				r.title.toLowerCase().includes(filter.toLowerCase())
		  ) as {
				id: number;
				title: string;
				image: string;
				imageType: string;
		  }[] &
				SpoonacularRecipeInfo<false>[])
		: [];
</script>

<svelte:head>
	<title>Suggested Recipes | Pantry Dash</title>
</svelte:head>

<div class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16">
	<Heading class="text-center">Suggested Recipes</Heading>

	<Input
		bind:value={filter}
		class="mt-4"
		disabled={!data.recipes.results.length}
		placeholder="Filter results"
	/>

	<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-4">
		{#each filteredRecipes as recipe}
			<RecipeCard
				title={recipe.title}
				imageURL={recipe.image}
				price={recipe.pricePerServing}
				recipeId={recipe.id.toString()}
				servings={recipe.servings}
				time={recipe.readyInMinutes}
			/>
		{:else}
			<div />
			<P class="text-center">
				Add some items to <A href="/pantry">your pantry</A> to get started! (the
				ingredients you have might not make a recipe as well)
			</P>
			<div />
		{/each}
	</div>
	{#if data.recipes.results.length}
		<Button
			on:click={async () => {
				const newResults = await complexSearch({
					includeIngredients: data.ingredients
						.map((i) => i.toLowerCase())
						.join(','),
					excludeIngredients: data.restrictions
						?.map((i) => i.name.toLowerCase())
						.join(','),
					number: 25,
					offset: data.recipes.offset + 25,
					addRecipeInformation: true,
				});

				data.recipes = {
					...newResults,
					number: data.recipes.number + newResults.number,
					results: [...data.recipes.results, ...newResults.results],
				};
			}}
		>
			Load more
		</Button>
	{/if}
</div>

<style>
	:global(.card:hover div.text-fadeout) {
		@apply to-gray-700;
	}
</style>
