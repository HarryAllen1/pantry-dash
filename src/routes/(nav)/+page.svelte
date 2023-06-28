<script lang="ts">
	import { complexSearch } from '$lib/spoonacular';
	import type { SpoonacularRecipeInfo } from '$lib/spoonacular/types.js';
	import {
		Badge,
		Button,
		Card,
		Heading,
		Input,
		P,
		Tooltip,
	} from 'flowbite-svelte';

	export let data;

	let filter = '';
	$: filteredRecipes = data.recipes.results.filter((r) =>
		r.title.toLowerCase().includes(filter.toLowerCase())
	) as {
		id: number;
		title: string;
		image: string;
		imageType: string;
	}[] &
		SpoonacularRecipeInfo<false>[];

	const concatTitle = (title: string) => {
		return title.length > 24 ? title.slice(0, 24) : title;
	};
</script>

<svelte:head>
	<title>Suggested Recipes | Pantry Dash</title>
</svelte:head>

<div class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16">
	<Heading class="text-center">Suggested Recipes</Heading>

	<Input bind:value={filter} class="mt-4" placeholder="Filter results" />

	<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-4">
		{#each filteredRecipes as recipe}
			<Card img={recipe.image} class="card" href="/recipe/{recipe.id}">
				<Heading tag="h5" class="whitespace-nowrap relative overflow-hidden">
					{concatTitle(recipe.title)}
					<!-- div to make the text fade out -->
					<div
						class="text-fadeout absolute top-0 bottom-0 w-16 right-0 bg-gradient-to-r from-transparent to-gray-800 pointer-events-none"
					/>
				</Heading>
				<Tooltip>{recipe.title}</Tooltip>
				<div class="flex flex-col gap-4 mt-4">
					<Badge large border>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4 mr-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Ready in {recipe.readyInMinutes} minutes
					</Badge>
					<Badge large border>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4 mr-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
							/>
						</svg>
						Serves {recipe.servings} people
					</Badge>
					<Badge large border>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4 mr-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						¢{recipe.pricePerServing} per serving
					</Badge>
				</div>
			</Card>
		{:else}
			<div />
			<P class="text-center">
				Add some items to your <a href="/pantry">pantry</a> to get started! (the
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
