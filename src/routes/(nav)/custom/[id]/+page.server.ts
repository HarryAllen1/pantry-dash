import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase }, params: { id } }) => {
	const { data } = await supabase
		.from('custom')
		.select('*')
		.eq('id', id)
		.single();
	const restrictions = await supabase.from('restrictions').select('name');

	if (!data) throw error(404, 'Recipe not found');

	return {
		recipe: {
			title: data.title,
			image: data.image,
			id: data.id,
			description: data.description,
			ingredients: data.ingredients.split('\n'),
			method: data.method.split('\n'),
		},
		restrictions: restrictions.data?.map((r) => r.name) ?? [],
	};
}) satisfies PageServerLoad;
