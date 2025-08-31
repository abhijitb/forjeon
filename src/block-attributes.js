/**
 * Block Attributes Registration
 * Adds typography attributes to core WordPress blocks
 * 
 * @package Forjeon
 * @since 1.0.0
 */

(function() {
	'use strict';

	// Wait for WordPress to be ready
	if (typeof wp === 'undefined' || !wp.hooks) {
		setTimeout(arguments.callee, 100);
		return;
	}
	
	const { addFilter } = wp.hooks;
	
	/**
	 * Add typography attributes to core blocks
	 * 
	 * @param {Object} settings Block settings
	 * @param {string} name Block name
	 * @returns {Object} Modified block settings
	 */
	function addTypographyAttributes(settings, name) {
		const typographyBlocks = [
			'core/paragraph',
			'core/heading',
			'core/list',
			'core/quote',
			'core/pullquote',
			'core/verse',
			'core/code',
			'core/preformatted'
		];
		
		if (typographyBlocks.includes(name)) {
			settings.attributes = {
				...settings.attributes,
				lineHeight: {
					type: 'object',
					default: null
				},
				letterSpacing: {
					type: 'object',
					default: null
				},
				textShadow: {
					type: 'object',
					default: null
				}
			};
		}
		
		return settings;
	}
	
	// Register the filter
	addFilter(
		'blocks.registerBlockType',
		'forjeon/add-typography-attributes',
		addTypographyAttributes
	);
})();