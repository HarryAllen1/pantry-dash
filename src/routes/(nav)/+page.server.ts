import { complexSearch } from '$lib/spoonacular';
import type {
	SpoonacularRecipeInfo,
	SpoonacularSearchRes,
} from '$lib/spoonacular/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase, getSession }, fetch }) => {
	const session = await getSession();

	// @StudentUser101 check if this has stuff (ie not empty array)
	const initialPantryItems =
		(
			await supabase
				.from('items')
				.select('*')
				.filter('belongs_to', 'eq', session?.user.id)
				.order('created_at')
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
		recipes: ingredients.length
			? // @StudentUser101 check if this call returns nothing. if not, re-run the call with a random item removed.
			  await complexSearch(
					{
						includeIngredients: ingredients
							.map((i) => i.toLowerCase())
							.join(','),
						excludeIngredients: (restrictions ?? [])
							.map((i) => i.name.toLowerCase())
							.join(','),
						number: 25,
						addRecipeInformation: true,
					},
					{
						fetch,
					}
			  	)
				? await complexSearch(
					{
						includeIngredients: ingredients
							.map((i) => i.toLowerCase())
							.join(','),
						excludeIngredients: (restrictions ?? [])
							.map((i) => i.name.toLowerCase())
							.join(','),
						number: 25,
						addRecipeInformation: true,
					},
					{
						fetch,
					}
			  	)
				: await complexSearch(
					{
						ingredients = ingredients.shift(),
						includeIngredients: ingredients
							.map((i) => i.toLowerCase())
							.join(','),
						excludeIngredients: (restrictions ?? [])
							.map((i) => i.name.toLowerCase())
							.join(','),
						number: 25,
						addRecipeInformation: true,
					},
					{
						fetch,
					}
			  	)
			: ({
					results: [],
					number: 0,
					offset: 0,
					totalResults: 0,
			  } as SpoonacularSearchRes & {
					results: SpoonacularRecipeInfo<false>[];
			  }),
	};
}) satisfies PageServerLoad;
