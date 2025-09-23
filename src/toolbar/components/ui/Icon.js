/**
 * Forjeon Icon Component
 * Consistent icon system using design tokens
 */

import './Icon.scss';

// Icon collection - commonly used icons
const icons = {
	// Interface icons
	close: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	),
	
	settings: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="3" />
			<path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
		</svg>
	),
	
	palette: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="13.5" cy="6.5" r=".5" />
			<circle cx="17.5" cy="10.5" r=".5" />
			<circle cx="8.5" cy="7.5" r=".5" />
			<circle cx="6.5" cy="12.5" r=".5" />
			<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
		</svg>
	),
	
	type: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<polyline points="4,7 4,4 20,4 20,7" />
			<line x1="9" y1="20" x2="15" y2="20" />
			<line x1="12" y1="4" x2="12" y2="20" />
		</svg>
	),
	
	layout: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
			<line x1="9" y1="9" x2="21" y2="9" />
			<line x1="9" y1="15" x2="21" y2="15" />
			<line x1="3" y1="9" x2="3" y2="21" />
			<line x1="3" y1="15" x2="3" y2="21" />
		</svg>
	),
	
	sparkles: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
		</svg>
	),
	
	cube: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="m21.5 9.5-9-5.5-9 5.5L12 15l9.5-5.5Z" />
			<path d="m21.5 9.5-9 5.5-9-5.5" />
			<path d="M12 15v6.5" />
		</svg>
	),
	
	wrench: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
		</svg>
	),

	// Status icons
	chevronDown: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<polyline points="6,9 12,15 18,9" />
		</svg>
	),
	
	check: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<polyline points="20,6 9,17 4,12" />
		</svg>
	),
	
	plus: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	),

	// Loading spinner
	spinner: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	),
};

export const Icon = ({ 
	name, 
	size = 'medium', 
	className = '',
	...props 
}) => {
	const baseClass = 'forjeon-icon';
	const classes = [
		baseClass,
		`${baseClass}--${size}`,
		className
	].filter(Boolean).join(' ');

	const iconSvg = icons[name];
	
	if (!iconSvg) {
		console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(icons));
		return null;
	}

	return (
		<span className={classes} {...props}>
			{iconSvg}
		</span>
	);
};

// Export available icon names for reference
export const availableIcons = Object.keys(icons);