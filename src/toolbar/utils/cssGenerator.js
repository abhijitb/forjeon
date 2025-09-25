/**
 * CSS Generation Utilities
 * Converts design settings to CSS styles
 * 
 * @package Forjeon
 * @since 2.1.0
 */

/**
 * Generate CSS styles from design settings
 */
export function generateDesignCSS(designSettings) {
	console.log('cssGenerator: generateDesignCSS called with:', designSettings);
	
	if (!designSettings) {
		console.log('cssGenerator: No design settings provided');
		return {};
	}

	const styles = {};

	// Background styles
	if (designSettings.background) {
		const bg = designSettings.background;
		switch (bg.type) {
			case 'color':
				if (bg.color) {
					styles.backgroundColor = bg.color;
				}
				break;
			case 'gradient':
				if (bg.gradient) {
					styles.background = bg.gradient;
				}
				break;
			case 'image':
				if (bg.image && bg.image.url) {
					styles.backgroundImage = `url(${bg.image.url})`;
					styles.backgroundSize = bg.image.size || 'cover';
					styles.backgroundPosition = bg.image.position || 'center center';
					styles.backgroundRepeat = bg.image.repeat || 'no-repeat';
				}
				break;
		}
	}

	// Border styles
	if (designSettings.border) {
		const border = designSettings.border;
		if (border.width > 0) {
			styles.borderWidth = `${border.width}px`;
			styles.borderStyle = border.style || 'solid';
			styles.borderColor = border.color || '#000000';
		}
		if (border.radius > 0) {
			styles.borderRadius = `${border.radius}px`;
		}
	}

	// Box shadow styles
	if (designSettings.boxShadow && designSettings.boxShadow.enabled) {
		const shadow = designSettings.boxShadow;
		const shadowValue = `${shadow.inset ? 'inset ' : ''}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
		styles.boxShadow = shadowValue;
	}

	// Spacing styles
	if (designSettings.spacing) {
		const spacing = designSettings.spacing;
		
		// Margin
		if (spacing.margin) {
			const m = spacing.margin;
			if (m.top !== undefined) styles.marginTop = `${m.top}px`;
			if (m.right !== undefined) styles.marginRight = `${m.right}px`;
			if (m.bottom !== undefined) styles.marginBottom = `${m.bottom}px`;
			if (m.left !== undefined) styles.marginLeft = `${m.left}px`;
		}
		
		// Padding
		if (spacing.padding) {
			const p = spacing.padding;
			if (p.top !== undefined) styles.paddingTop = `${p.top}px`;
			if (p.right !== undefined) styles.paddingRight = `${p.right}px`;
			if (p.bottom !== undefined) styles.paddingBottom = `${p.bottom}px`;
			if (p.left !== undefined) styles.paddingLeft = `${p.left}px`;
		}
	}

	console.log('cssGenerator: Generated styles:', styles);
	return styles;
}

/**
 * Generate CSS string from design settings
 */
export function generateDesignCSSString(designSettings, selector = '') {
	const styles = generateDesignCSS(designSettings);
	
	if (Object.keys(styles).length === 0) {
		return '';
	}

	const cssRules = Object.entries(styles)
		.map(([property, value]) => {
			// Convert camelCase to kebab-case
			const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
			return `  ${cssProperty}: ${value};`;
		})
		.join('\n');

	return selector ? `${selector} {\n${cssRules}\n}` : cssRules;
}

/**
 * Apply design styles to a DOM element
 */
export function applyDesignStyles(element, designSettings) {
	if (!element || !designSettings) return;

	const styles = generateDesignCSS(designSettings);
	
	Object.entries(styles).forEach(([property, value]) => {
		element.style[property] = value;
	});
}

/**
 * Remove design styles from a DOM element
 */
export function removeDesignStyles(element, designSettings) {
	if (!element || !designSettings) return;

	const styles = generateDesignCSS(designSettings);
	
	Object.keys(styles).forEach((property) => {
		element.style[property] = '';
	});
}

/**
 * Generate CSS class name for design settings
 */
export function generateDesignClassName(blockId, designSettings) {
	if (!blockId || !designSettings) return '';

	// Create a hash of the design settings for uniqueness
	const settingsHash = hashObject(designSettings);
	return `forjeon-design-${blockId}-${settingsHash}`;
}

/**
 * Simple object hash function
 */
function hashObject(obj) {
	const str = JSON.stringify(obj);
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash).toString(36);
}

/**
 * Check if design settings have any values
 */
export function hasDesignSettings(designSettings) {
	if (!designSettings) return false;

	// Check background
	if (designSettings.background) {
		const bg = designSettings.background;
		if (bg.type === 'color' && bg.color) return true;
		if (bg.type === 'gradient' && bg.gradient) return true;
		if (bg.type === 'image' && bg.image && bg.image.url) return true;
	}

	// Check border
	if (designSettings.border) {
		const border = designSettings.border;
		if (border.width > 0 || border.radius > 0) return true;
	}

	// Check box shadow
	if (designSettings.boxShadow && designSettings.boxShadow.enabled) {
		return true;
	}

	// Check spacing
	if (designSettings.spacing) {
		const spacing = designSettings.spacing;
		if (spacing.margin) {
			const m = spacing.margin;
			if (m.top > 0 || m.right > 0 || m.bottom > 0 || m.left > 0) return true;
		}
		if (spacing.padding) {
			const p = spacing.padding;
			if (p.top > 0 || p.right > 0 || p.bottom > 0 || p.left > 0) return true;
		}
	}

	return false;
}

/**
 * Merge design settings
 */
export function mergeDesignSettings(base, override) {
	return {
		background: { ...base?.background, ...override?.background },
		border: { ...base?.border, ...override?.border },
		boxShadow: { ...base?.boxShadow, ...override?.boxShadow },
		spacing: {
			margin: { ...base?.spacing?.margin, ...override?.spacing?.margin },
			padding: { ...base?.spacing?.padding, ...override?.spacing?.padding }
		}
	};
}