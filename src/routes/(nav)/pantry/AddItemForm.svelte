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

	let selectedUnit = 'ct';
	let dropdownOpen = false;
</script>

<Label>
	Name
	<Input required name="name" class="mt-2" />
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
			{#each ['kgs', 'g', 'lbs', 'cups', 'tbsp', 'tsp', 'count', 'cc', 'ml', 'lt'] as unit}
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
