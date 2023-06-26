<script lang="ts">
	import { afterNavigate, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import { autocompleteRecipe } from '$lib/spoonacular';
	import {
		A,
		Avatar,
		Button,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		P,
		Popover,
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import '../../app.css';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: currUrl = $page.url.pathname;

	let hidden = true;
	let toggle = () => {
		hidden = !hidden;
	};

	const searchValue = writable('');
	let autocompleteResults: { id: number; title: string }[] = [];

	afterNavigate(() => {
		$searchValue = '';
	});

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		searchValue.subscribe(async (v) => {
			if (v.length > 0) {
				autocompleteResults = await autocompleteRecipe(v);
			} else {
				autocompleteResults = [];
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>PantryDash</title>
</svelte:head>

<nav class="px-2 sm:px-4 py-2.5 w-full mb-4 print:hidden">
	<div class="mx-auto grid grid-cols-3 justify-between items-center">
		<NavBrand href="/">
			<span
				class="self-center whitespace-nowrap text-xl font-bold dark:text-white"
			>
				PantryDash
			</span>
		</NavBrand>
		<div class="flex justify-end md:order-2 items-center gap-4">
			<Autocomplete
				bind:value={$searchValue}
				bind:results={autocompleteResults}
				placeholder="Search"
			>
				<svg
					slot="leftIcon"
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
			</Autocomplete>
			<Avatar
				id="b2"
				class="h-10 w-10 !bg-white"
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
							class="!bg-white"
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
		<NavUl
			{hidden}
			class="order-1"
			ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium justify-center"
			on:click={() => setTimeout(toggle, 1)}
		>
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
