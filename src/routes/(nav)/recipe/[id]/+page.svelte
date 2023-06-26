<script lang="ts">
	import { Heading, Alert, P, List, Li } from 'flowbite-svelte';

	export let data;

	const dietaryRestrictionHits = data.restrictions
		.join(' ')
		.split(' ')
		.filter((word) =>
			data.recipe.extendedIngredients
				.map((i) => i.nameClean)
				.join(' ')
				.split(' ')
				.includes(word)
		);

	if (data.restrictions.includes('gluten') && !data.recipe.glutenFree) {
		dietaryRestrictionHits.push('gluten');
	}
	if (
		(data.restrictions.includes('dairy') ||
			data.restrictions.includes('milk')) &&
		!data.recipe.dairyFree
	) {
		dietaryRestrictionHits.push('dairy');
	}
	if (data.restrictions.includes('meat') && !data.recipe.vegetarian) {
		dietaryRestrictionHits.push('meat');
	}
</script>

<svelte:head>
	<title>{data.recipe.title} Recipe | Pantry Dash</title>
</svelte:head>

<div class="w-full px-[auto]">
	<div class="flex flex-col max-w-3xl mx-auto">
		{#if dietaryRestrictionHits.length}
			<Alert color="yellow">
				<Heading tag="h5" color="text-yellow-300">
					This recipe likely contains one or more of your dietary restrictions
				</Heading>
				<List tag="ul">
					{#each dietaryRestrictionHits as hit}
						<Li class="text-lg">{hit}</Li>
					{/each}
				</List>
			</Alert>
		{/if}
	</div>
</div>
