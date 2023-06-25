<script lang="ts">
	import {
		Button,
		ButtonGroup,
		Chevron,
		Dropdown,
		DropdownItem,
		Input,
		Label,
		Textarea,
	} from 'flowbite-svelte';
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { autocompleteIngredient } from '$lib/spoonacular';

	let selectedUnit = 'ct';
	let dropdownOpen = false;

	const nameValue = writable('');
	let autocompleteResults: string[];
	const defaultUnits = [
		'kgs',
		'g',
		'lbs',
		'cups',
		'tbsp',
		'tsp',
		'count',
		'cc',
		'ml',
		'lt',
	];
	let units: string[] = defaultUnits;
	onMount(() => {
		nameValue.subscribe(async (v) => {
			if (v.length > 0) {
				autocompleteResults = (await autocompleteIngredient(v)).map(
					(i) => i.name
				);
				console.log(autocompleteResults);
			} else {
				units = defaultUnits;
				autocompleteResults = [];
			}
		});
	});
</script>

<Label>
	Name
	<Autocomplete
		bind:results={autocompleteResults}
		bind:value={$nameValue}
		required
		name="name"
		class="mt-2"
	/>
</Label>
<Label>
	Location
	<Input required name="location" class="mt-2" />
</Label>
<div>
	<Label for="quantity">Quantity</Label>
	<ButtonGroup class="w-full mt-2">
		<Input type="number" required id="quantity" name="quantity" />
		<Button
			color="none"
			class="h-12 rounded-r-lg flex-shrink-0 text-gray-900 bg-gray-100 border border-gray-300 dark:border-gray-700 dark:text-white hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
		>
			<Chevron>{selectedUnit}</Chevron>
		</Button>
		<Dropdown bind:open={dropdownOpen}>
			{#each units as unit}
				<DropdownItem
					on:click={() => {
						selectedUnit = unit;
						dropdownOpen = false;
					}}
				>
					{unit}
				</DropdownItem>
			{/each}
		</Dropdown>
		<input type="hidden" name="unit" value={selectedUnit} />
	</ButtonGroup>
</div>
<Label>
	Notes
	<Textarea name="notes" class="mt-2" />
</Label>

<Button class="w-full" type="submit">Add item</Button>
