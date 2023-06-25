<script lang="ts">
	import { Dropdown, DropdownItem, Input } from 'flowbite-svelte';

	export let value = '';
	export let results: string[] | { id: number; title: string }[];

	$: console.log(results);

	let dropdownOpen = false;
	$: actualDropdownOpen = dropdownOpen && value.length > 0;
</script>

<div>
	{#if $$slots.leftIcon}
		<Input
			{...$$restProps}
			bind:value
			on:blur
			on:change
			on:click
			on:contextmenu
			on:focus={(_e) => {
				dropdownOpen = true;
			}}
			on:focus
			on:keydown
			on:keypress
			on:keyup
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:paste
			on:input
			on:input={(_e) => {
				dropdownOpen = true;
			}}
		>
			<div slot="left">
				<slot name="leftIcon" />
			</div>
		</Input>
	{:else}
		<Input
			{...$$restProps}
			autocomplete="off"
			bind:value
			on:blur
			on:change
			on:click
			on:contextmenu
			on:focus={(_e) => {
				dropdownOpen = true;
			}}
			on:focus
			on:keydown
			on:keypress
			on:keyup
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:paste
			on:input
			on:input={(_e) => {
				dropdownOpen = true;
			}}
		/>
	{/if}
</div>
<Dropdown bind:open={actualDropdownOpen}>
	{#each results as result}
		{#if typeof result === 'string'}
			<DropdownItem
				on:click={() => {
					// the cast isn't needed but svelte doesn't coerce types correctly
					value = String(result);
					dropdownOpen = false;
				}}
			>
				{result}
			</DropdownItem>
		{:else}
			<DropdownItem href="/recipe/{result.id}">
				{result.title}
			</DropdownItem>
		{/if}
	{:else}
		<DropdownItem>No results</DropdownItem>
	{/each}
</Dropdown>
