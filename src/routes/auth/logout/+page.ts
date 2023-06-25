import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase } = await parent();

	await supabase.auth.signOut();
}) satisfies PageLoad;
