<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Input, Textarea } from 'flowbite-svelte';

	export let data;

	let { title, description, method, ingredients } = {
		title: '',
		description: '',
		ingredients: '',
		method: '',
	};

	const createRecipe = async () => {
		await data.supabase.from('custom').insert([
			{
				title,
				description,
				method,
				ingredients,
				created_by: data.session?.user.id ?? '',
			},
		]);

		await goto('/custom');
	};
</script>

<svelte:head>
	<title>Create Custom Recipe | PantryDash</title>
</svelte:head>

<div
	class="flex flex-col w-full max-w-5xl px-4 gap-4 mx-auto mb-16 print:!text-black print:m-8"
>
	<Input type="text" bind:value={title} placeholder="Title" />
	<Textarea bind:value={description} placeholder="Description" />
	<Textarea
		bind:value={ingredients}
		placeholder="Ingredients (newline separated)"
	/>
	<Textarea bind:value={method} placeholder="Method (newline separated)" />
	<Button on:click={createRecipe}>Create</Button>
</div>
