import { SPOONACULAR_API_KEYS } from '$env/static/private';

export const getRandomAPIKey = () =>
	SPOONACULAR_API_KEYS.split(',')[
		Math.floor(Math.random() * SPOONACULAR_API_KEYS.split(',').length)
	];
