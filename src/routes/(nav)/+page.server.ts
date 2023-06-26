import { complexSearch } from '$lib/spoonacular';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase, getSession }, fetch }) => {
	const session = await getSession();

	const initialPantryItems =
		(
			await supabase
				.from('items')
				.select('*')
				.filter('belongs_to', 'eq', session?.user.id)
		).data?.map((i) => ({
			id: i.id,
			name: i.name ?? 'Not given',
			quantity: i.quantity ?? 0,
			unit: i.unit ?? 'Not given',
			location: i.location ?? 'Not given',
			notes: i.notes ?? 'None',
		})) ?? [];

	const ingredients = initialPantryItems.map((item) => item.name);
	const { data: restrictions } = await supabase
		.from('restrictions')
		.select('*');

	return {
		ingredients,
		restrictions,
		recipes: complexSearch(
			{
				includeIngredients: ingredients.map((i) => i.toLowerCase()).join(','),
				excludeIngredients: (restrictions ?? [])
					.map((i) => i.name.toLowerCase())
					.join(','),
				number: 25,
				addRecipeInformation: true,
			},
			{
				fetch,
			}
		),
	};
}) satisfies PageServerLoad;
