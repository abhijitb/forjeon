/**
 * Forjeon Select Component
 * Consistent select styling using design tokens
 */

import { forwardRef } from '@wordpress/element';
import './Select.scss';

export const Select = forwardRef(({
	size = 'medium',
	error = false,
	disabled = false,
	className = '',
	children,
	placeholder,
	...props
}, ref) => {
	const baseClass = 'forjeon-select';
	const wrapperClasses = [
		`${baseClass}-wrapper`,
		`${baseClass}-wrapper--${size}`,
		error && `${baseClass}-wrapper--error`,
		disabled && `${baseClass}-wrapper--disabled`,
		className
	].filter(Boolean).join(' ');

	const selectClasses = [
		baseClass,
		`${baseClass}--${size}`,
		error && `${baseClass}--error`,
	].filter(Boolean).join(' ');

	return (
		<div className={wrapperClasses}>
			<select
				ref={ref}
				className={selectClasses}
				disabled={disabled}
				{...props}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{children}
			</select>
			<div className={`${baseClass}__icon`}>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M3 4.5L6 7.5L9 4.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		</div>
	);
});

Select.displayName = 'ForjeonSelect';