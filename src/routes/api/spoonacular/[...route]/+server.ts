import { SPOONACULAR_API_ROOT } from '$lib/spoonacular';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRandomAPIKey } from './api_key';

export const GET = (async ({ fetch, params: { route }, url }) => {
	const apiKey = getRandomAPIKey();

	if (!apiKey) throw error(500, 'SPOONACULAR_API_KEYs not set');

	const params = url.searchParams;
	params.append('apiKey', apiKey);
	const res = await fetch(
		`${
			route.includes('recipeImages')
				? SPOONACULAR_API_ROOT.replace('api.', '')
				: SPOONACULAR_API_ROOT
		}/${route}?${params.toString()}`
	);
	if (route.includes('recipeImages'))
		return new Response(await res.blob(), {
			headers: {
				'Content-Type': `image/${
					route.endsWith('jpg') || route.endsWith('jpeg') ? 'jpeg' : 'png'
				}`,
			},
		});
	return json(await res.json());
}) satisfies RequestHandler;
