import { getRecipe } from '$lib/spoonacular';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({
	fetch,
	params: { id },
	url,
	locals: { supabase },
	parent,
}) => {
	const { session } = await parent();
	const recipe = await getRecipe(id, { fetch });

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
		.eq('id', session?.user.id)
		.single();

	return {
		recipe,
		restrictions: restrictions.data?.dietary_restrictions ?? [],
	};
}) satisfies PageServerLoad;
