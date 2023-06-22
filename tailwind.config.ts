import type { Config } from 'tailwindcss';
import { pink } from 'tailwindcss/colors';
import flowbite from 'flowbite/plugin';

export default {
	darkMode: ['class'],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
	],

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: pink['50'],
					100: pink['100'],
					200: pink['200'],
					300: pink['300'],
					400: pink['400'],
					500: pink['500'],
					600: pink['600'],
					700: pink['700'],
					800: pink['800'],
					900: pink['900'],
				},
			},
		},
	},

	plugins: [flowbite],
} satisfies Config;
