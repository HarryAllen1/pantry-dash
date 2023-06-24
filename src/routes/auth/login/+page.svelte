<script lang="ts">
	import type { Provider } from '@supabase/supabase-js';
	import { Button, Card, Heading } from 'flowbite-svelte';
	import ProviderIcon from '$lib/auth/ProviderIcon.svelte';

	export let data;

	const providers: Provider[] = [
		'github',
		'google',
		'gitlab',
		'twitter',
		'facebook',
		'bitbucket',
		'discord',
		'azure',
		'twitch',
		'spotify',
		'linkedin',
		'zoom',
	];

	let { supabase } = data;
	$: ({ supabase } = data);
</script>

<svelte:head>
	<title>Login | PantryDash</title>
</svelte:head>

<Card class="w-96">
	<Heading tag="h2" class="mb-8 w-full text-center">Login</Heading>

	<div class="flex flex-col gap-2">
		{#each providers as provider}
			<Button
				on:click={async () =>
					await supabase.auth.signInWithOAuth({
						provider,
						options: { redirectTo: window.location.origin + '/auth/callback' },
					})}
				outline={true}
				class="text-white"
				color="alternative"
			>
				<ProviderIcon {provider} class="mr-2" />
				Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
			</Button>
		{/each}
	</div>
</Card>
