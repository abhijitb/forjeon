/**
 * Forjeon - Advanced Typography Controls
 * Main entry point for block editor integration
 */

import { registerPlugin } from '@wordpress/plugins';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { CustomSidebar } from './components/CustomSidebar';
import './style.scss';

// Register the custom sidebar plugin
registerPlugin('forjeon-typography-sidebar', {
	render: CustomSidebar,
	icon: 'admin-customizer'
});

// Add a Higher Order Component to apply inline styles to blocks
const withTypographyStyles = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, name, setAttributes } = props;
		const { lineHeight, letterSpacing, textShadow } = attributes;
		
		// Check if this block supports typography
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
		
		if (!typographyBlocks.includes(name)) {
			return <BlockEdit {...props} />;
		}
		
		// Build inline styles for the wrapper
		const wrapperStyles = {};
		
		// Only apply styles if they exist and have valid values
		if (lineHeight && lineHeight.value !== undefined && lineHeight.value !== null) {
			wrapperStyles.lineHeight = `${lineHeight.value}${lineHeight.unit || ''}`;
		}
		
		if (letterSpacing?.value !== undefined && letterSpacing?.value !== null) {
			wrapperStyles.letterSpacing = `${letterSpacing.value}${letterSpacing.unit || 'em'}`;
		}
		
		if (textShadow && typeof textShadow === 'object' && textShadow.x !== undefined) {
			const { x = 0, y = 0, blur = 0, color = '#000000' } = textShadow;
			wrapperStyles.textShadow = `${x}px ${y}px ${blur}px ${color}`;
		}
		
		// Apply styles to the entire block wrapper using CSS
		const hasStyles = Object.keys(wrapperStyles).length > 0;
		
		// Return the block with applied styles
		return (
			<div 
				style={hasStyles ? {
					...wrapperStyles,
					// Apply styles to all child text elements
					'--forjeon-line-height': wrapperStyles.lineHeight,
					'--forjeon-letter-spacing': wrapperStyles.letterSpacing,
					'--forjeon-text-shadow': wrapperStyles.textShadow
				} : {}} 
				className={hasStyles ? 'forjeon-typography-wrapper' : ''}
			>
				<style>
					{hasStyles && `
						.forjeon-typography-wrapper p,
						.forjeon-typography-wrapper h1,
						.forjeon-typography-wrapper h2,
						.forjeon-typography-wrapper h3,
						.forjeon-typography-wrapper h4,
						.forjeon-typography-wrapper h5,
						.forjeon-typography-wrapper h6,
						.forjeon-typography-wrapper ul,
						.forjeon-typography-wrapper ol,
						.forjeon-typography-wrapper blockquote,
						.forjeon-typography-wrapper pre,
						.forjeon-typography-wrapper code {
							${wrapperStyles.lineHeight ? `line-height: ${wrapperStyles.lineHeight} !important;` : ''}
							${wrapperStyles.letterSpacing ? `letter-spacing: ${wrapperStyles.letterSpacing} !important;` : ''}
							${wrapperStyles.textShadow ? `text-shadow: ${wrapperStyles.textShadow} !important;` : ''}
						}
					`}
				</style>
				<BlockEdit {...props} />
			</div>
		);
	};
}, 'withTypographyStyles');

// Apply the HOC to block edit components
addFilter(
	'editor.BlockEdit',
	'forjeon/with-typography-styles',
	withTypographyStyles
);
