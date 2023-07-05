import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase } }) => {
	const { data } = await supabase.from('custom').select('id,image,title');

	return {
		recipes: data ?? [],
	};
}) satisfies PageServerLoad;
