<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		A,
		Avatar,
		Button,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		P,
		Popover,
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import '../../app.css';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: currUrl = $page.url.pathname;

	let hidden = true;
	let toggle = () => {
		hidden = !hidden;
	};

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, _session) => {
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

<nav class="px-2 sm:px-4 py-2.5 w-full mb-4">
	<div class="mx-auto flex flex-wrap justify-between items-center">
		<NavBrand href="/">
			<span
				class="self-center whitespace-nowrap text-xl font-bold dark:text-white"
			>
				PantryDash
			</span>
		</NavBrand>
		<div class="flex md:order-2">
			<Avatar
				id="b2"
				class="-mb-2"
				size="sm"
				src={session?.user.user_metadata.avatar_url ??
					'https://github.com/lsakunes.png'}
				alt="profile"
			/>

			<Popover
				placement="bottom"
				triggeredBy="#b2"
				class="w-64 text-sm font-light text-gray-500 bg-white dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 z-[1000]"
			>
				<div class="p-3">
					<div class="flex flex-row justify-between items-center mb-2">
						<Avatar
							href="/"
							src={session?.user.user_metadata.avatar_url ??
								'https://github.com/lsakunes.png'}
						/>
						<div class="flex flex-col">
							<P class="font-bold text-lg">
								{session?.user.user_metadata?.full_name}
							</P>
							<A href="mailto:{session?.user.email}">{session?.user.email}</A>
						</div>
					</div>
					<div
						class="text-base font-semibold leading-none text-gray-900 dark:text-white"
					>
						<Button href="/auth/logout" class="w-full mt-4">Log Out</Button>
					</div>
				</div>
			</Popover>
			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1" on:click={() => setTimeout(toggle, 1)}>
			<NavLi href="/" active={currUrl === '/'}>Dashboard</NavLi>
			<NavLi href="/recipes" active={currUrl === '/recipes'}>Recipes</NavLi>
			<NavLi href="/pantry" active={currUrl === '/pantry'}>Pantry</NavLi>
			<NavLi
				href="/dietary-restrictions"
				active={currUrl === '/dietary-restrictions'}
			>
				Dietary Restrictions
			</NavLi>
		</NavUl>
	</div>
</nav>

<slot />
