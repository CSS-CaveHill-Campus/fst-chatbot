/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				satoshi: ['Satoshi', 'sans-serif'],
				inter: ['Inter', 'sans-serif']
			},
			gridTemplateRows: {
				flow: '1fr 2rem'
			}
		}
	},
	plugins: []
};
