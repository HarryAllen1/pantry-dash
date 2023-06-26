<script lang="ts">
	import {
		Button,
		Heading,
		Input,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import { onMount } from 'svelte';
	import { autocompleteIngredient } from '../../../lib/spoonacular/index.js';

	export let data;

	const itemName = writable('');
	let itemResults: string[] = [];

	let { restrictions } = data;

	data.supabase
		.channel('restrictions')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'restrictions',
			},
			(payload) => {
				if (payload.eventType === 'INSERT') {
					restrictions = [
						...restrictions,
						payload.new as App.DatabaseDefinitions['public']['Tables']['restrictions']['Row'],
					];
				}
			}
		)
		.subscribe();

	onMount(() => {
		itemName.subscribe(async (v) => {
			if (v.length > 0) {
				itemResults = (await autocompleteIngredient(v)).map((i) => i.name);
			} else {
				itemResults = [];
			}
		});
	});

	const addItem = async () => {
		await data.supabase.from('restrictions').insert([
			{
				name: $itemName,
				belongs_to: data.session?.user.id ?? '',
			},
		]);
		$itemName = '';
	};
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			$itemName = '';
		} else if (e.key === 'Enter') addItem();
	}}
/>

<div class="flex flex-col items-center max-w-3xl mx-auto px-16">
	<Heading class="text-center">Dietary Restrictions</Heading>
	<P class="text-center mt-4">
		These items will be removed from your recommendations
	</P>

	<div class="p-4 flex flex-row gap-4">
		<label for="other-better-table-search" class="sr-only">
			Add restriction
		</label>

		<Autocomplete
			bind:results={itemResults}
			bind:value={$itemName}
			type="text"
			id="other-better-table-search"
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			placeholder="Add restriction"
		/>
		<Button on:click={addItem} class="aspect-square h-[42px] p-0 items-center ">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 4.5v15m7.5-7.5h-15"
				/>
			</svg>
		</Button>
	</div>
	<Table divClass="w-full rounded-lg">
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell class="w-16">Delete</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each restrictions as item}
				<TableBodyRow>
					<TableBodyCell>{item.name}</TableBodyCell>
					<TableBodyCell>
						<Button
							on:click={async () => {
								restrictions = restrictions.filter((i) => i.id !== item.id);
								await data.supabase
									.from('restrictions')
									.delete()
									.match({ id: item.id });
							}}
							color="red"
							class="py-0"
							outline={true}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{:else}
				<TableBodyRow>
					<TableBodyCell colspan="2" class="text-center">
						No restrictions
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
