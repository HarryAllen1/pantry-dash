<script lang="ts">
	import type { SpoonacularAutocompleteIngredientRes } from '$lib/spoonacular/types';
	import { autocompleteIngredient } from '$lib/spoonacular/index';

	export let data;

	let restrictions: string[] = [];
	let autocompleteResults: SpoonacularAutocompleteIngredientRes[] = [];
	let restrictionValue = '';
	let alertMessage = '';

	const loadData = async () => {
		const { data: supabaseData } = await data.supabase
			.from('profiles')
			.select('dietary_restrictions')
			.eq('id', data.session?.user.id)
			.single();

		restrictions = supabaseData?.dietary_restrictions ?? [];
	};

	$: if (data.session) {
		loadData();
	}

	const handleClick = async () => {
		if (!restrictionValue) {
			alertMessage = 'Please enter a restriction';
			return;
		}
		if (restrictions.includes(restrictionValue)) {
			alertMessage = 'You already have this restriction';
			return;
		}
		restrictions.push(restrictionValue);
		await data.supabase
			.from('profiles')
			.update({ dietary_restrictions: restrictions })
			.eq('id', data.session?.user.id);
		restrictionValue = '';
		loadData();
	};
</script>

<svelte:head>
	<title>My Restrictions - PantryDash</title>
</svelte:head>

<h1 class="mb-12 w-full text-center">My Restrictions</h1>

{#if alertMessage}
	<aside class="alert variant-ghost-error mb-8">
		<div class="alert-message">
			<h3>Error</h3>
			<p>{alertMessage}</p>
		</div>
		<div class="alert-actions">
			<button class="btn" on:click={() => (alertMessage = '')}>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	</aside>
{/if}

<div class="flex flex-row gap-4 mb-8">
	<label for="search" class="label">
		<input
			class="input autocomplete"
			autocomplete="off"
			type="search"
			name="search"
			bind:value={restrictionValue}
			on:input={async () => {
				autocompleteResults = await autocompleteIngredient(restrictionValue);
			}}
			placeholder="Add Restriction"
		/>
		{#if restrictionValue}
			<div class="overflow-y-auto h-36 select">
				<option value="default" disabled={true} class="contents" />
				{#each autocompleteResults as result}
					<option
						on:click={() => {
							restrictionValue = result.name;
							handleClick();
						}}
						class="hover:variant-filled-primary"
						value={result}
					>
						{result.name}
					</option>
				{/each}
			</div>
		{/if}
	</label>
	<button class="btn variant-filled-primary h-[42px]" on:click={handleClick}>
		Add
	</button>
</div>

<ul class="list w-64">
	{#each restrictions as restriction}
		<li>
			{restriction}
			<button
				class="btn variant-filled-error ml-4"
				on:click={async () => {
					restrictions = restrictions.filter((r) => r !== restriction);
					await data.supabase
						.from('profiles')
						.update({ dietary_restrictions: restrictions })
						.eq('id', data.session?.user.id);
					loadData();
				}}
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</li>
	{:else}
		<li>No restrictions found</li>
	{/each}
</ul>
