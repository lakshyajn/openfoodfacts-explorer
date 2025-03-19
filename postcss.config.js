export default {
	plugins: {
		'@tailwindcss/postcss': {
			...(process.env.NODE_ENV === 'production' ? { purge: true } : {})
		},
		'cssnano': {
			preset: ['advanced', {
				discardComments: {
					removeAll: true,
				},
				reduceIdents: false,
				zindex: false,
				cssDeclarationSorter: true,
				normalizeWhitespace: true,
				minifyFontValues: true
			}]
		},
		'autoprefixer': {
			overrideBrowserslist: [
				'> 1%',
				'last 2 versions',
				'not ie <= 11',
				'not op_mini all'
			]
		}
	}
};