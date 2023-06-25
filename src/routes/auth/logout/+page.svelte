<script lang="ts">
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		await data.supabase.auth.signOut();

		location.href = '/auth/login';
	});
</script>
