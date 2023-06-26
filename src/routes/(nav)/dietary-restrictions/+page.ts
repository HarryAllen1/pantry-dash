import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase } = await parent();

	const { data: restrictions } = await supabase
		.from('restrictions')
		.select('*');

	return {
		restrictions: restrictions ?? [],
	};
}) satisfies PageLoad;
