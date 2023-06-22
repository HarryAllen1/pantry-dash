<script lang="ts">
	import { invalidate } from '$app/navigation';
	import {
		A,
		Avatar,
		Button,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		Popover,
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
		<Avatar
			id="b2"
			class="-mb-2"
			href="/auth/login"
			size="sm"
			src="https://github.com/lsakunes.png"
			alt="profile"
		/>

		<Popover
			placement="bottom"
			triggeredBy="#b2"
			class="w-64 text-sm font-light text-gray-500 bg-white dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
		>
			<div class="p-3">
				<div class="flex justify-between items-center mb-2">
					<Avatar href="/" src="https://github.com/lsakunes.png" />
					<A href="mailto:{session?.user.email}">{session?.user.email}</A>
				</div>
				<div
					class="text-base font-semibold leading-none text-gray-900 dark:text-white"
				>
					<form action="/auth/logout" method="POST">
						<Button type="submit" class="w-full mt-4">Log Out</Button>
					</form>
				</div>
			</div>
		</Popover>
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
