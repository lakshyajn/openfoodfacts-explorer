/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	mode: "jit",
	theme: {
		extend: {
			screens: {
				'xs': '475px',
			}
		}
	},
	plugins: [ addDynamicIconSelectors()],
	daisyui: {
		themes: [
			{
				off: {
					primary: '#201a17',
					secondary: '#52443d',
					'base-100': '#faf7f5'
				}
			},
			{
				dark: {
					primary: '#faf7f5',
					secondary: '#ebc3a8',
					'base-100': '#201a17'
				}
			}
		]
	},

	safelist: [
		'btn', 'btn-secondary', 'btn-outline', 'container',
		'navbar', 'navbar-start', 'navbar-center', 'navbar-end'
	],
	experimental: {
		optimizeUniversalDefaults: true
	},
	future: {
		hoverOnlyWhenSupported: true
	}
};