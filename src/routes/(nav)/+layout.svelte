<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { invalidate } from '$app/navigation';
	import {
		Button,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import '../../app.css';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>PantryDash</title>
</svelte:head>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span
			class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
		>
			PantryDash
		</span>
	</NavBrand>
	<div class="flex md:order-2">
		<Button href="/auth/login" size="sm">Log In</Button>
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi href="/" active={true}>Dashboard</NavLi>
		<NavLi href="/about">Recipes</NavLi>
		<NavLi href="/services">Pantry</NavLi>
		<NavLi href="/pricing">Dietary Restrictions</NavLi>
	</NavUl>
</Navbar>

<slot />
