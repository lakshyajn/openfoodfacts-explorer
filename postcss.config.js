export default {
	plugins: {
		'@tailwindcss/postcss': {},
		'cssnano': {
			preset: ['advanced', {
				discardComments: {
					removeAll: true,
				},
				reduceIdents: false,
				zindex: false,
			}]
		},
		'autoprefixer': {}
	}
};