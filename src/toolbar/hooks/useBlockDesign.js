/**
 * Block Design Hook
 * Manages design settings for selected blocks
 * 
 * @package Forjeon
 * @since 2.1.0
 */

import { useEffect, useRef, createElement, cloneElement } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { generateDesignCSS, hasDesignSettings, generateDesignClassName } from '../utils/cssGenerator';

// Note: Removed blocks.getSaveElement filter to avoid validation errors
// Instead, we'll use the style attribute system and CSS classes

// Add filter for editor preview - this will show styles in the editor
addFilter(
	'editor.BlockEdit',
	'forjeon/apply-design-styles-editor',
	(BlockEdit) => {
		return (props) => {
			const { attributes } = props;
			
			if (attributes.forjeonDesignEnabled) {
				// Generate CSS styles from our design settings
				const designSettings = {
					background: attributes.forjeonBackground,
					border: attributes.forjeonBorder,
					boxShadow: attributes.forjeonBoxShadow,
					spacing: attributes.forjeonSpacing
				};
				
				const styles = generateDesignCSS(designSettings);
				console.log('Editor filter applying styles:', styles);
				
				// Apply styles to the wrapper - this shows in editor only
				return createElement(
					'div',
					{ 
						style: styles,
						className: 'forjeon-styled-block-preview'
					},
					createElement(BlockEdit, props)
				);
			}
			
			return createElement(BlockEdit, props);
		};
	}
);

// Note: Removed blocks.getSaveContent.extraProps filter to avoid validation errors
// WordPress doesn't allow modifying core block save content

/**
 * Hook to manage block design settings
 */
export function useBlockDesign() {
	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const styleElementRef = useRef(null);

	// Get selected block
	const selectedBlock = useSelect(select => {
		const { getSelectedBlock, getSelectedBlockClientId } = select('core/block-editor');
		const clientId = getSelectedBlockClientId();
		return clientId ? getSelectedBlock(clientId) : null;
	});

	// Create or update style element for dynamic CSS
	useEffect(() => {
		if (!styleElementRef.current) {
			styleElementRef.current = document.createElement('style');
			styleElementRef.current.id = 'forjeon-design-styles';
			document.head.appendChild(styleElementRef.current);
		}

		return () => {
			// Cleanup on unmount
			if (styleElementRef.current && styleElementRef.current.parentNode) {
				styleElementRef.current.parentNode.removeChild(styleElementRef.current);
			}
		};
	}, []);

	// Apply design styles to the selected block
	const applyDesignToBlock = (designSettings) => {
		console.log('useBlockDesign: applyDesignToBlock called', designSettings);
		console.log('useBlockDesign: selectedBlock', selectedBlock);
		
		if (!selectedBlock) {
			console.log('useBlockDesign: No selected block, returning');
			return;
		}

		console.log('useBlockDesign: Updating block attributes for clientId:', selectedBlock.clientId);
		
		// Generate unique class name for this block's styles
		const styles = generateDesignCSS(designSettings);
		const hasStyles = Object.keys(styles).length > 0;
		const designClass = hasStyles ? `forjeon-design-${selectedBlock.clientId.replace(/-/g, '')}` : '';
		
		// Create dynamic CSS for this block
		if (hasStyles) {
			if (!styleElementRef.current) {
				styleElementRef.current = document.createElement('style');
				styleElementRef.current.id = 'forjeon-design-styles';
				document.head.appendChild(styleElementRef.current);
			}
			
			// Generate CSS rule
			const cssRules = Object.entries(styles)
				.map(([property, value]) => {
					const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
					return `  ${cssProperty}: ${value} !important;`;
				})
				.join('\n');
				
			const cssRule = `.${designClass} {\n${cssRules}\n}`;
			
			// Store multiple rules for different blocks
			if (!window.forjeonStyles) window.forjeonStyles = {};
			window.forjeonStyles[selectedBlock.clientId] = cssRule;
			
			// Combine all rules
			const allRules = Object.values(window.forjeonStyles).join('\n\n');
			styleElementRef.current.textContent = allRules;
			
			console.log('Generated CSS rule:', cssRule);
		}
		
		// Add the design class to block's className
		const currentClassName = selectedBlock.attributes.className || '';
		const classNames = currentClassName.split(' ').filter(cls => !cls.startsWith('forjeon-design-'));
		if (designClass) {
			classNames.push(designClass);
		}
		
		// Update block attributes with class name
		updateBlockAttributes(selectedBlock.clientId, {
			forjeonBackground: designSettings.background,
			forjeonBorder: designSettings.border,
			forjeonBoxShadow: designSettings.boxShadow,
			forjeonSpacing: designSettings.spacing,
			forjeonDesignEnabled: hasDesignSettings(designSettings),
			className: classNames.filter(cls => cls).join(' ') || undefined
		});

		console.log('Updated block with CSS class:', designClass);
	};

	// Note: Direct DOM styling removed to prevent iframe issues
	// WordPress handles styling through the style attribute system

	// Clear design styles
	const clearDesignFromBlock = () => {
		if (!selectedBlock) return;

		// Remove CSS rule for this block
		if (window.forjeonStyles) {
			delete window.forjeonStyles[selectedBlock.clientId];
			
			// Update stylesheet
			if (styleElementRef.current) {
				const allRules = Object.values(window.forjeonStyles).join('\n\n');
				styleElementRef.current.textContent = allRules;
			}
		}
		
		// Remove design class from className
		const currentClassName = selectedBlock.attributes.className || '';
		const classNames = currentClassName.split(' ').filter(cls => !cls.startsWith('forjeon-design-'));

		// Clear our custom attributes and className
		updateBlockAttributes(selectedBlock.clientId, {
			forjeonBackground: undefined,
			forjeonBorder: undefined,
			forjeonBoxShadow: undefined,
			forjeonSpacing: undefined,
			forjeonDesignEnabled: false,
			className: classNames.filter(cls => cls).join(' ') || undefined
		});

		console.log('Cleared design from block');
	};

	// Get current design settings from block
	const getCurrentDesignSettings = () => {
		if (!selectedBlock || !selectedBlock.attributes) {
			return {
				background: { type: 'none', color: '', gradient: '', image: { url: '', size: 'cover', position: 'center center', repeat: 'no-repeat' } },
				border: { width: 0, style: 'solid', color: '', radius: 0 },
				boxShadow: { enabled: false, x: 0, y: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false },
				spacing: { margin: { top: 0, right: 0, bottom: 0, left: 0 }, padding: { top: 0, right: 0, bottom: 0, left: 0 } }
			};
		}

		const attrs = selectedBlock.attributes;
		return {
			background: attrs.forjeonBackground || { type: 'none', color: '', gradient: '', image: { url: '', size: 'cover', position: 'center center', repeat: 'no-repeat' } },
			border: attrs.forjeonBorder || { width: 0, style: 'solid', color: '', radius: 0 },
			boxShadow: attrs.forjeonBoxShadow || { enabled: false, x: 0, y: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false },
			spacing: attrs.forjeonSpacing || { margin: { top: 0, right: 0, bottom: 0, left: 0 }, padding: { top: 0, right: 0, bottom: 0, left: 0 } }
		};
	};

	// Check if current block has design settings
	const hasCurrentDesignSettings = () => {
		const currentSettings = getCurrentDesignSettings();
		return hasDesignSettings(currentSettings);
	};

	return {
		selectedBlock,
		applyDesignToBlock,
		clearDesignFromBlock,
		getCurrentDesignSettings,
		hasCurrentDesignSettings
	};
}