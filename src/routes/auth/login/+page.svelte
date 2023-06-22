<script lang="ts">
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { page } from '$app/stores';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { Card } from 'flowbite-svelte';
	import { pink } from 'tailwindcss/colors';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);
</script>

<Card color="dark" class="w-96">
	<Auth
		socialLayout="horizontal"
		supabaseClient={supabase}
		redirectTo="{$page.url.origin}/auth/callback"
		theme="dark"
		appearance={{
			theme: ThemeSupa,
			className: {
				button:
					'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
			},
			variables: {
				default: {
					colors: {
						brand: pink['500'],
						brandAccent: pink['600'],
					},
				},
			},
		}}
		magicLink={true}
		providers={[
			'google',
			'github',
			'gitlab',
			'bitbucket',
			'discord',
			'linkedin',
			'slack',
			'spotify',
			'twitter',
		]}
		additionalData={{}}
	/>
</Card>
