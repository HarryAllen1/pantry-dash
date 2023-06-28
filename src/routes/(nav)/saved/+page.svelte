<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { Heading, P } from 'flowbite-svelte';

	export let data;
</script>

<svelte:head>
	<title>Saved Recipes | Pantry Dash</title>
</svelte:head>

<div class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16">
	<Heading class="text-center">Saved Recipes</Heading>

	<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
		{#each data.recipes as recipe}
			<RecipeCard
				imageURL={recipe.image}
				price={recipe.pricePerServing}
				recipeId={recipe.id.toString()}
				servings={recipe.servings}
				time={recipe.readyInMinutes}
				title={recipe.title}
			/>
		{:else}
			<div />
			<P class="text-center">No saved recipes</P>
			<div />
		{/each}
	</div>
</div>
