import type {
	Cuisines,
	SpoonacularAutocompleteIngredientRes,
	SpoonacularAutocompleteRecipeRes,
	SpoonacularRecipeInfo,
	SpoonacularRecipeInfoRes,
	SpoonacularRequestFailure,
	SpoonacularRequestOptions,
	SpoonacularSearchRes,
} from './types';

export const SPOONACULAR_API_ROOT = 'https://api.spoonacular.com' as const;

export const spoonacularRequest = async <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<string, any>,
	CanFail extends boolean = true
>(
	path: `/${string}`,
	options?: Record<string, string>,
	otherOptions: SpoonacularRequestOptions = {
		fetch,
		root: '',
	}
): Promise<CanFail extends true ? T | SpoonacularRequestFailure : T> => {
	const queryParams = new URLSearchParams(options).toString();
	const res = await (otherOptions.fetch ?? fetch)(
		`${otherOptions.root ?? ''}/api/spoonacular${path}?${queryParams}`
	);
	return res.json();
};

export const autocompleteRecipe = async (
	query: string,
	options?: SpoonacularRequestOptions & { number?: number }
) =>
	await spoonacularRequest<SpoonacularAutocompleteRecipeRes[], false>(
		'/recipes/autocomplete',
		{
			query,
			number: options?.number?.toString() ?? '10',
		},
		{
			root: options?.root ?? '',
			fetch: options?.fetch,
		}
	);

export const autocompleteIngredient = async (
	query: string,
	options?: SpoonacularRequestOptions & { number?: number }
) =>
	spoonacularRequest<SpoonacularAutocompleteIngredientRes[], false>(
		'/food/ingredients/autocomplete',
		{
			query,
			number: options?.number?.toString() ?? '10',
		},
		{
			root: options?.root ?? '',
			fetch: options?.fetch,
		}
	);

export const getRecipeByIngredients = async (
	ingredients: string[],
	options?: SpoonacularRequestOptions & { ranking?: 1 | 2 }
) =>
	spoonacularRequest<SpoonacularRecipeInfoRes[], false>(
		'/recipes/findByIngredients',
		{
			ingredients: ingredients.join(','),
			number: '30',
			ranking: options?.ranking?.toString() ?? '1',
			ignorePantry: 'true',
		},
		{
			fetch: options?.fetch,
		}
	);

interface GetRecipe {
	(
		id: number | string,
		options?: SpoonacularRequestOptions & { includeNutrition?: false }
	): Promise<SpoonacularRecipeInfo<false> | SpoonacularRequestFailure>;
	(
		id: number | string,
		options: SpoonacularRequestOptions & { includeNutrition: true }
	): Promise<SpoonacularRecipeInfo<true> | SpoonacularRequestFailure>;
}

export const getRecipe: GetRecipe = async (id, options) =>
	spoonacularRequest<SpoonacularRecipeInfo<boolean>, true>(
		`/recipes/${id}/information`,
		{ includeNutrition: options?.includeNutrition ? 'true' : 'false' },
		options
	);

interface ComplexSearchOptions {
	query: string;
	cuisine: Cuisines | Lowercase<Cuisines>;
	excludeCuisine: Cuisines | Lowercase<Cuisines>;
	diet: string;
	intolerances: string;
	equipment: string;
	includeIngredients: string;
	excludeIngredients: string;
	type: string;
	instructionsRequired: boolean;
	fillIngredients: boolean;
	addRecipeInformation: boolean;
	addRecipeNutrition: boolean;
	author: string;
	tags: string;
	recipeBoxId: number;
	titleMatch: string;
	maxReadyTime: number;
	ignorePantry: boolean;
	sort: string;
	sortDirection: 'asc' | 'desc';
	minCarbs: number;
	maxCarbs: number;
	offset: number;
	number: number;
	limitLicense: boolean;
}

interface ComplexSearch {
	(
		options: Partial<ComplexSearchOptions & { addRecipeInformation: true }>,
		requestOptions?: SpoonacularRequestOptions
	): Promise<
		SpoonacularSearchRes & { results: SpoonacularRecipeInfo<false>[] }
	>;
	(
		options: Partial<ComplexSearchOptions>,
		requestOptions?: SpoonacularRequestOptions
	): Promise<SpoonacularSearchRes>;
}

export const complexSearch: ComplexSearch = async (options, requestOptions) =>
	spoonacularRequest<
		SpoonacularSearchRes & { results: SpoonacularRecipeInfo<false>[] },
		false
	>(
		'/recipes/complexSearch',
		Object.fromEntries(
			Object.entries(options).map(([k, v]) => [k, v.toString()])
		),
		requestOptions
	);
