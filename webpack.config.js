/**
 * WordPress webpack config for Forjeon plugin
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Helper function to update sass-loader options recursively
function updateSassLoaderOptions(use) {
	if (Array.isArray(use)) {
		return use.map(updateSassLoaderOptions);
	}
	
	if (typeof use === 'string') {
		return use;
	}
	
	if (use && typeof use === 'object') {
		if (use.loader && (use.loader.includes('sass-loader') || use.loader === 'sass-loader')) {
			return {
				...use,
				options: {
					...use.options,
					sassOptions: {
						...use.options?.sassOptions,
						silenceDeprecations: ['legacy-js-api', 'import'],
						quietDeps: true
					}
				}
			};
		}
	}
	
	return use;
}

module.exports = {
	...defaultConfig,
	entry: {
		// Main plugin entry point
		index: path.resolve(process.cwd(), 'src', 'index.js'),

		// Tabs block entries
		'blocks/tabs/index': path.resolve(
			process.cwd(),
			'src/blocks/content/tabs',
			'index.js'
		),
		'tabs-frontend': path.resolve(
			process.cwd(),
			'src/blocks/content/tabs',
			'frontend.js'
		),
	},
	output: {
		...defaultConfig.output,
		filename: '[name].js',
	},
	module: {
		...defaultConfig.module,
		rules: defaultConfig.module.rules.map(rule => {
			// Update sass-loader configurations to silence deprecation warnings
			if (rule.test && (rule.test.test?.('test.scss') || rule.test.test?.('test.sass'))) {
				return {
					...rule,
					use: updateSassLoaderOptions(rule.use)
				};
			}
			return rule;
		})
	}
};
