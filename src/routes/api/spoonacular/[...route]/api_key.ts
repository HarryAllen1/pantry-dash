import { SPOONACULAR_API_KEYS } from '$env/static/private';

export const getRandomAPIKey = () => {
	const keys = SPOONACULAR_API_KEYS.split(',');

	return keys[Math.floor(Math.random() * keys.length)];
};
