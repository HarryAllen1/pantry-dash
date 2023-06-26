import { getRecipe } from '$lib/spoonacular';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({
	fetch,
	params: { id },
	url,
	locals: { supabase },
}) => {
	const recipe = await getRecipe(id, { fetch });

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore it can fail but im too lazy to type it
	if ('status' in recipe) throw error(recipe.code, recipe.message);

	recipe.summary = recipe.summary
		.replaceAll(
			/((http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/gi,
			(url) => {
				const segments = url.split('/');
				const lastSegment = segments[segments.length - 1];
				const recipeId = lastSegment.split('-').pop();
				return `${segments.slice(0, -1).join('/')}/${recipeId}`;
			}
		)
		.replaceAll('https://spoonacular.com', url.origin)
		.replaceAll(`${url.origin}/recipes`, `${url.origin}/recipe`);

	const restrictions = await supabase
		.from('profiles')
		.select('dietary_restrictions')
		.single();

	const saved = await supabase
		.from('saved')
		.select('recipe_id')
		.eq('recipe_id', recipe.id)
		.single();

	return {
		recipe,
		saved: saved.data?.recipe_id === recipe.id.toString(),
		restrictions: restrictions.data?.dietary_restrictions ?? [],
	};
}) satisfies PageServerLoad;
