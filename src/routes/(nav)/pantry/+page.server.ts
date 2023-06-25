import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	async addItem({ request, locals: { supabase, getSession } }) {
		const session = await getSession();
		const data = await request.formData();
		const name = data.get('name') as string;
		const location = data.get('location') as string;
		const quantity = data.get('quantity') as string;
		const notes = data.get('notes') as string;
		const unit = data.get('unit') as string;

		if (!name || !location || !quantity || !unit)
			return fail(400, {
				success: false,
				message: 'Please fill out all fields',
			});

		if (isNaN(parseInt(quantity)))
			return fail(400, {
				success: false,
				message: 'Quantity must be a number',
			});

		await supabase.from('items').insert([
			{
				name,
				location,
				quantity: parseInt(quantity),
				notes,
				unit,
				belongs_to: session?.user.id,
			},
		]);

		return {
			success: true,
			message: 'Item added successfully',
		};
	},
} satisfies Actions;
