/**
 * Forjeon Button Component
 * Consistent button styling using design tokens
 */

import { forwardRef } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import './Button.scss';

export const Button = forwardRef(({
	variant = 'primary',
	size = 'medium',
	disabled = false,
	loading = false,
	children,
	className = '',
	icon,
	iconPosition = 'left',
	...props
}, ref) => {
	const baseClass = 'forjeon-button';
	const classes = [
		baseClass,
		`${baseClass}--${variant}`,
		`${baseClass}--${size}`,
		disabled && `${baseClass}--disabled`,
		loading && `${baseClass}--loading`,
		className
	].filter(Boolean).join(' ');

	const content = (
		<>
			{loading && (
				<span className={`${baseClass}__spinner`}>
					<Spinner />
				</span>
			)}
			{icon && iconPosition === 'left' && (
				<span className={`${baseClass}__icon ${baseClass}__icon--left`}>
					{icon}
				</span>
			)}
			{children && (
				<span className={`${baseClass}__text`}>
					{children}
				</span>
			)}
			{icon && iconPosition === 'right' && (
				<span className={`${baseClass}__icon ${baseClass}__icon--right`}>
					{icon}
				</span>
			)}
		</>
	);

	return (
		<button
			ref={ref}
			className={classes}
			disabled={disabled || loading}
			{...props}
		>
			{content}
		</button>
	);
});

Button.displayName = 'ForjeonButton';