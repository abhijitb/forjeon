/**
 * WordPress webpack config for Forjeon plugin
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		// Main plugin entry point
		index: path.resolve(process.cwd(), 'src', 'index.js'),

		// Tabs block entries
		'blocks/tabs/index': path.resolve(
			process.cwd(),
			'includes/blocks/tabs',
			'index.js'
		),
		'tabs-frontend': path.resolve(
			process.cwd(),
			'src/blocks',
			'tabs-frontend.js'
		),
	},
	output: {
		...defaultConfig.output,
		filename: '[name].js',
	},
};
