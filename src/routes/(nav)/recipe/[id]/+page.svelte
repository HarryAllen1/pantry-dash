<script lang="ts">
	import { Alert, Badge, Heading, Li, List } from 'flowbite-svelte';

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

<div class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16">
	{#if dietaryRestrictionHits.length}
		<Alert border color="yellow">
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

	<Heading tag="h1" class="text-center">{data.recipe.title}</Heading>
	<div class="flex flex-col items-center lg:grid lg:grid-cols-2 gap-4">
		<div>
			<img
				src="/api/spoonacular{new URL(data.recipe.image).pathname}"
				alt={data.recipe.title}
			/>
		</div>
		<div>
			<Heading tag="h3" class="mb-4">Description</Heading>
			<p>
				{@html data.recipe.summary.replaceAll('spoonacular', 'PantryDash')}
			</p>
		</div>
	</div>

	<div>
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
			Ready in {data.recipe.readyInMinutes} minutes
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
			Serves {data.recipe.servings} people
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
			¢{data.recipe.pricePerServing} per serving
		</Badge>

		<Heading tag="h3" class="mb-4">Ingredients</Heading>

		<List>
			{#each data.recipe.extendedIngredients as ingredient}
				<Li>{ingredient.amount} {ingredient.unit} {ingredient.name}</Li>
			{/each}
		</List>

		<Heading tag="h3" class="mb-4">Method</Heading>

		{#if data.recipe.analyzedInstructions.length}
			<List type="li">
				{#each data.recipe.analyzedInstructions[0].steps as step, i}
					<Li>
						{step.step}
					</Li>
				{/each}
			</List>
		{:else if data.recipe.instructions}
			<p>{data.recipe.instructions}</p>
		{:else}
			<p>No instructions available</p>
		{/if}
	</div>
</div>
