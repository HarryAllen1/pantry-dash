<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { PantryItem } from '$lib/spoonacular/types';
	import {
		Button,
		CloseButton,
		Drawer,
		Heading,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import AddItemForm from './AddItemForm.svelte';
	import DeeeeeeepLearning from './DeeeeeeepLearning.svelte';
	import { recognitionDrawerHidden } from './drawerStore';

	export let data;

	let searchTerm = '';
	let drawerHidden = true;
	let items: PantryItem[] = data.items;

	data.supabase
		.channel('pantry')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'items',
			},
			(payload) => {
				if (payload.eventType === 'INSERT') {
					items = [...items, payload.new as PantryItem];
				}
			}
		)
		.subscribe();

	$: filteredItems = items.filter(
		(item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	const addItem = () => {
		drawerHidden = false;
	};

	const imageRecognition = () => {
		$recognitionDrawerHidden = false;
	};
</script>

<div class="flex flex-col items-center w-full px-16">
	{#if items.length}
		<div class="p-4 flex flex-row gap-4">
			<label for="other-better-table-search" class="sr-only">Search</label>
			<div class="relative">
				<div
					class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
				>
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<input
					bind:value={searchTerm}
					type="search"
					id="other-better-table-search"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="Search by item name"
				/>
			</div>
			<Button
				on:click={addItem}
				class="aspect-square h-[42px] p-0 items-center "
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
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
			</Button>
			<Button
				on:click={imageRecognition}
				outline={true}
				class="aspect-square h-[42px] p-0 items-center "
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
						d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
					/>
				</svg>
			</Button>
		</div>
		<TableSearch
			placeholder="Search by item name"
			hoverable={true}
			bind:inputValue={searchTerm}
		>
			<TableHead>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Location</TableHeadCell>
				<TableHeadCell>Quantity</TableHeadCell>
				<TableHeadCell>Notes</TableHeadCell>
				<TableHeadCell>Delete</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filteredItems as item}
					<TableBodyRow>
						<TableBodyCell>{item.name}</TableBodyCell>
						<TableBodyCell>{item.location}</TableBodyCell>
						<TableBodyCell>{item.quantity} {item.unit}</TableBodyCell>
						<TableBodyCell>{item.notes}</TableBodyCell>
						<TableBodyCell>
							<Button
								on:click={async () => {
									items = items.filter((i) => i.id !== item.id);
									await data.supabase
										.from('items')
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
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<Heading tag="h2" class="text-center mb-4">No items!</Heading>
		<Button on:click={addItem}>
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
	{/if}
</div>

<Drawer
	transitionType="fly"
	placement="right"
	transitionParams={{
		easing: sineIn,
		duration: 200,
		x: 520,
	}}
	id="add-item-drawer"
	bind:hidden={drawerHidden}
>
	<div class="flex items-center">
		<Heading tag="h3">Add Item</Heading>
		<CloseButton
			on:click={() => (drawerHidden = true)}
			class="mb-4 dark:text-white"
		/>
	</div>
	<form
		action="?/addItem"
		method="POST"
		class="flex flex-col gap-4 mt-4"
		use:enhance={() => {
			return async ({ result }) => {
				await applyAction(result);
				drawerHidden = true;
			};
		}}
	>
		<AddItemForm />
	</form>
</Drawer>

<Drawer
	transitionType="fly"
	placement="right"
	width="w-[33.33%]"
	transitionParams={{
		easing: sineIn,
		duration: 200,
		x: 520,
	}}
	bind:hidden={$recognitionDrawerHidden}
>
	<div class="flex items-center">
		<Heading tag="h3">Add items by image</Heading>
		<CloseButton
			on:click={() => ($recognitionDrawerHidden = true)}
			class="mb-4 dark:text-white"
		/>
	</div>
	<DeeeeeeepLearning session={data.session} supabase={data.supabase} />
</Drawer>
