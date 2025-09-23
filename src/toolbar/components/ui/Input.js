/**
 * Forjeon Input Component
 * Consistent input styling using design tokens
 */

import { forwardRef } from '@wordpress/element';
import './Input.scss';

export const Input = forwardRef(({
	type = 'text',
	size = 'medium',
	error = false,
	disabled = false,
	className = '',
	prefix,
	suffix,
	...props
}, ref) => {
	const baseClass = 'forjeon-input';
	const wrapperClasses = [
		`${baseClass}-wrapper`,
		`${baseClass}-wrapper--${size}`,
		error && `${baseClass}-wrapper--error`,
		disabled && `${baseClass}-wrapper--disabled`,
		prefix && `${baseClass}-wrapper--has-prefix`,
		suffix && `${baseClass}-wrapper--has-suffix`,
		className
	].filter(Boolean).join(' ');

	const inputClasses = [
		baseClass,
		`${baseClass}--${size}`,
		error && `${baseClass}--error`,
	].filter(Boolean).join(' ');

	return (
		<div className={wrapperClasses}>
			{prefix && (
				<span className={`${baseClass}__prefix`}>
					{prefix}
				</span>
			)}
			<input
				ref={ref}
				type={type}
				className={inputClasses}
				disabled={disabled}
				{...props}
			/>
			{suffix && (
				<span className={`${baseClass}__suffix`}>
					{suffix}
				</span>
			)}
		</div>
	);
});

Input.displayName = 'ForjeonInput';