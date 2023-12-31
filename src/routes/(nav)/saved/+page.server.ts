import { getRecipe } from '$lib/spoonacular';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { supabase }, fetch }) => {
	const { data: saved } = await supabase.from('saved').select('recipe_id');

	const recipes = (
		await Promise.all(
			(saved ?? []).map((recipe) => getRecipe(recipe.recipe_id, { fetch }))
		)
	).map((r) => ({
		...r,
		image: `/api/spoonacular${new URL(r.image).pathname}`,
	}));

	return {
		recipes,
	};
}) satisfies PageServerLoad;
