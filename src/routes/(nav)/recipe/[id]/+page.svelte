<script lang="ts">
	import {
		Alert,
		Badge,
		Button,
		ButtonGroup,
		Heading,
		Li,
		List,
	} from 'flowbite-svelte';

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

	const saveRecipe = async () => {
		if (data.saved) {
			await data.supabase
				.from('saved')
				.delete()
				.match({ recipe_id: data.recipe.id.toString() });
		} else {
			await data.supabase.from('saved').insert([
				{
					recipe_id: data.recipe.id.toString(),
					created_by: data.session?.user.id ?? '',
				},
			]);
		}
		data.saved = !data.saved;
	};
</script>

<svelte:head>
	<title>{data.recipe.title} Recipe | Pantry Dash</title>
</svelte:head>

<div
	class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16 print:!text-black print:m-8"
>
	{#if dietaryRestrictionHits.length}
		<Alert border color="yellow" class="print:hidden">
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

	<Heading tag="h1" class="text-center print:!text-black ">
		{data.recipe.title}
	</Heading>

	<ButtonGroup class="print:hidden">
		<Button on:click={saveRecipe}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill={data.saved ? 'currentColor' : 'none'}
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 mr-2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
				/>
			</svg>
			Save{data.saved ? 'd' : ''}
		</Button>
		<Button on:click={() => print()}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 mr-2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
				/>
			</svg>
			Print
		</Button>
		<Button
			on:click={() =>
				navigator.share({
					title: data.recipe.title,
					text: data.recipe.title,
					url: window.location.href,
				})}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 mr-2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
				/>
			</svg>
			Share
		</Button>
	</ButtonGroup>

	<div
		class="flex flex-col items-center justify-start lg:grid lg:grid-cols-2 gap-4"
	>
		<div>
			<img
				src="/api/spoonacular{new URL(data.recipe.image).pathname}"
				alt={data.recipe.title}
			/>
		</div>
		<div class="print:hidden">
			<Heading tag="h3" class="mb-4 print:!text-black">Description</Heading>
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

		<Heading tag="h3" class="my-4 print:!text-black">Ingredients</Heading>

		<List>
			{#each data.recipe.extendedIngredients as ingredient}
				<Li>{ingredient.amount} {ingredient.unit} {ingredient.name}</Li>
			{/each}
		</List>

		<Heading tag="h3" class="my-4 print:!text-black">Method</Heading>

		{#if data.recipe.analyzedInstructions.length}
			<List tag="ol">
				{#each data.recipe.analyzedInstructions[0].steps as step}
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
