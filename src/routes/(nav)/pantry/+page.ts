import type { PantryItem } from '$lib/spoonacular/types';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase } = await parent();

	const { data: items } = await supabase.from('items').select('*');

	return {
		items: items?.map((item) => ({
			id: item.id,
			name: item.name,
			location: item.location,
			quantity: item.quantity,
			notes: item.notes,
			unit: item.unit,
		})) as PantryItem[],
	};
}) satisfies PageLoad;

export const config = {
	runtime: 'node18.x',
};
