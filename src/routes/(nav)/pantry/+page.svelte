<script lang="ts">
	import type { PantryItem } from '$lib/spoonacular/types';
	import {
		Button,
		Heading,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		Drawer,
		CloseButton,
		TableHeadCell,
		TableSearch,
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';

	export let data;

	let searchTerm = '';
	let drawerHidden = true;
	let items: PantryItem[] = [];

	data.supabase
		.channel('pantry')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'items',
				filter: `belongs_to = ${data.session?.user.id}`,
			},
			(payload) => {
				console.log(payload);
			}
		)
		.subscribe();

	$: filteredItems = items.filter(
		(item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	const addItem = () => {
		drawerHidden = false;
	};
</script>

<div class="flex flex-col items-center w-full px-16">
	{#if items.length}
		<TableSearch
			placeholder="Search by item name"
			hoverable={true}
			bind:inputValue={searchTerm}
		>
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Maker</TableHeadCell>
				<TableHeadCell>Type</TableHeadCell>
				<TableHeadCell>Make</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filteredItems as item}
					<TableBodyRow>
						<TableBodyCell>{item.name}</TableBodyCell>
						<TableBodyCell>{item.location}</TableBodyCell>
						<TableBodyCell>{item.quantity} {item.unit}</TableBodyCell>
						<TableBodyCell>{item.notes}</TableBodyCell>
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
	width="w-[75%]"
	transitionParams={{
		easing: sineIn,
		duration: 200,
		x: 520,
	}}
	id="add-item-drawer"
	bind:hidden={drawerHidden}
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<svg
				class="w-5 h-5 mr-2"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/>
			</svg>Info
		</h5>
		<CloseButton
			on:click={() => (drawerHidden = true)}
			class="mb-4 dark:text-white"
		/>
	</div>
	<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
		Supercharge your hiring by taking advantage of our <a
			href="/"
			class="text-primary-600 underline dark:text-primary-500 hover:no-underline"
			>limited-time sale</a
		> for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates
		and the #1 design job board.
	</p>
	<div class="grid grid-cols-2 gap-4">
		<Button color="light" href="/">Learn more</Button>
		<Button href="/"
			>Get access <svg
				class="w-4 h-4 ml-1"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			></Button
		>
	</div>
</Drawer>
