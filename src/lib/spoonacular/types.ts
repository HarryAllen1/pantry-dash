interface Temperature {
	number: number;
	unit: string;
}

interface Equipment {
	id: number;
	image: string;
	name: string;
	temperature: Temperature;
}

interface Ingredient {
	id: number;
	image: string;
	name: string;
}

interface Length {
	number: number;
	unit: string;
}

interface Step {
	equipment: Equipment[];
	ingredients: Ingredient[];
	number: number;
	step: string;
	length: Length;
}

export interface SpoonacularRecipeInstruction {
	name: string;
	steps: Step[];
}
interface Us {
	amount: number;
	unitShort: string;
	unitLong: string;
}

interface Metric {
	amount: number;
	unitShort: string;
	unitLong: string;
}

interface Measures {
	us: Us;
	metric: Metric;
}

interface ExtendedIngredient {
	id: number;
	aisle: string;
	image: string;
	consistency: string;
	name: string;
	nameClean: string;
	original: string;
	originalName: string;
	amount: number;
	unit: string;
	meta: string[];
	measures: Measures;
}

interface Nutrient {
	name: string;
	amount: number;
	unit: string;
	percentOfDailyNeeds: number;
}

interface Property {
	name: string;
	amount: number;
	unit: string;
}

interface Flavonoid {
	name: string;
	amount: number;
	unit: string;
}

interface Nutrient2 {
	name: string;
	amount: number;
	unit: string;
	percentOfDailyNeeds: number;
}

interface Ingredient {
	id: number;
	name: string;
	amount: number;
	unit: string;
	nutrients: Nutrient2[];
}

interface CaloricBreakdown {
	percentProtein: number;
	percentFat: number;
	percentCarbs: number;
}

interface WeightPerServing {
	amount: number;
	unit: string;
}

interface Nutrition {
	nutrients: Nutrient[];
	properties: Property[];
	flavonoids: Flavonoid[];
	ingredients: Ingredient[];
	caloricBreakdown: CaloricBreakdown;
	weightPerServing: WeightPerServing;
}

interface ProductMatch {
	id: number;
	title: string;
	description: string;
	price: string;
	imageUrl: string;
	averageRating: number;
	ratingCount: number;
	score: number;
	link: string;
}

interface WinePairing {
	pairedWines: string[];
	pairingText: string;
	productMatches: ProductMatch[];
}

interface Equipment {
	id: number;
	name: string;
	localizedName: string;
	image: string;
}

interface Length {
	number: number;
	unit: string;
}

interface AnalyzedInstruction {
	name: string;
	steps: Step[];
}

export interface SpoonacularRecipeInfo<
	IncludeNutrition extends boolean = false
> {
	vegetarian: boolean;
	vegan: boolean;
	glutenFree: boolean;
	dairyFree: boolean;
	veryHealthy: boolean;
	cheap: boolean;
	veryPopular: boolean;
	sustainable: boolean;
	lowFodmap: boolean;
	weightWatcherSmartPoints: number;
	gaps: string;
	preparationMinutes: number;
	cookingMinutes: number;
	aggregateLikes: number;
	healthScore: number;
	creditsText: string;
	license: string;
	sourceName: string;
	pricePerServing: number;
	extendedIngredients: ExtendedIngredient[];
	id: number;
	title: string;
	readyInMinutes: number;
	servings: number;
	sourceUrl: string;
	image: string;
	imageType: string;
	nutrition: IncludeNutrition extends true ? Nutrition : undefined;
	summary: string;
	cuisines: string[];
	dishTypes: string[];
	diets: string[];
	occasions: string[];
	winePairing: WinePairing;
	instructions: string;
	analyzedInstructions: AnalyzedInstruction[];
	originalId: null;
	spoonacularSourceUrl: string;
}
export type Cuisines =
	| 'African'
	| 'American'
	| 'British'
	| 'Cajun'
	| 'Caribbean'
	| 'Chinese'
	| 'Eastern European'
	| 'European'
	| 'French'
	| 'German'
	| 'Greek'
	| 'Indian'
	| 'Irish'
	| 'Italian'
	| 'Japanese'
	| 'Jewish'
	| 'Korean'
	| 'Latin American'
	| 'Mediterranean'
	| 'Mexican'
	| 'Middle Eastern'
	| 'Nordic'
	| 'Southern'
	| 'Spanish'
	| 'Thai'
	| 'Vietnamese';

export interface SpoonacularRequestFailure {
	status: string;
	code: number;
	message: string;
}

export interface SpoonacularRequestOptions {
	root?: string;
	fetch?: typeof fetch;
}

export interface SpoonacularAutocompleteRecipeRes {
	id: number;
	title: string;
	imageType: string;
}

export interface SpoonacularAutocompleteIngredientRes {
	name: string;
	image: string;
	id: number;
	aisle: string;
	possibleUnits: string[];
}

export interface SpoonacularRecipeInfoRes {
	id: number;
	title: string;
	image: string;
	imageType: string;
	usedIngredientCount: number;
	missedIngredientCount: number;
	likes: number;
}

export interface SpoonacularSearchRes {
	offset: number;
	number: number;
	totalResults: number;
	results: { id: number; title: string; image: string; imageType: string }[];
}

export interface PantryItem {
	id: string;
	name: string;
	quantity: number;
	unit: string;
	location: string;
	notes: string;
}
