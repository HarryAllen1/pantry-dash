<script lang="ts">
	import { Badge, Card, Heading, Tooltip } from 'flowbite-svelte';

	export let title: string;
	export let imageURL: string;
	export let recipeId: string;
	export let price: number;
	export let servings: number;
	/** in minutes */
	export let time: number;

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
</script>

<Card img={imageURL} class="card" href="/recipe/{recipeId}">
	<Heading tag="h5" class="whitespace-nowrap relative overflow-hidden">
		{title}
		<!-- div to make the text fade out -->
		<div
			class="text-fadeout absolute top-0 bottom-0 w-16 right-0 bg-gradient-to-r from-transparent to-gray-800 pointer-events-none"
		/>
	</Heading>
	<Tooltip>{title}</Tooltip>
	<div class="flex flex-col gap-4 mt-4">
		<Badge large border>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-4 h-4 mr-1"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			Ready in {time} minutes
		</Badge>
		<Badge large border>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-4 h-4 mr-1"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
				/>
			</svg>
			Serves {servings} people
		</Badge>
		<Badge large border>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-4 h-4 mr-1"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			{price >= 100 ? `${formatter.format(price / 100)}` : `¢${price}`} per serving
		</Badge>
	</div>
</Card>

<style>
	:global(.card:hover div.text-fadeout) {
		@apply to-gray-700;
	}
</style>
