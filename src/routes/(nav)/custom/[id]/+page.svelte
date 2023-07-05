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
			data.recipe.ingredients.join(' ').split(' ').includes(word)
		);
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
				src="https://placehold.co/312x231/webp?text=No%20image%20found"
				alt={data.recipe.title}
			/>
		</div>
		<div class="print:hidden">
			<Heading tag="h3" class="mb-4 print:!text-black">Description</Heading>
			<p>
				{@html data.recipe.description}
			</p>
		</div>
	</div>

	<div>
		<Heading tag="h3" class="my-4 print:!text-black">Ingredients</Heading>

		<List>
			{#each data.recipe.ingredients as ingredient}
				<Li>{ingredient}</Li>
			{/each}
		</List>

		<Heading tag="h3" class="my-4 print:!text-black">Method</Heading>

		{#if data.recipe.method.length}
			<List tag="ol">
				{#each data.recipe.method as step}
					<Li>
						{step}
					</Li>
				{/each}
			</List>
		{:else}
			<p>No instructions available</p>
		{/if}
	</div>
</div>
