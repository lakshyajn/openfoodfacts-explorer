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
	plugins: [],
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
	experimental: {
		optimizeUniversalDefaults: true
	},
	future: {
		hoverOnlyWhenSupported: true
	}
};