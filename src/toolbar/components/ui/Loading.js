/**
 * Forjeon Loading Component
 * Consistent loading states using design tokens
 */

import { Icon } from './Icon';
import './Loading.scss';

export const Loading = ({ 
	size = 'medium', 
	text,
	className = '',
	variant = 'spinner',
	...props 
}) => {
	const baseClass = 'forjeon-loading';
	const classes = [
		baseClass,
		`${baseClass}--${size}`,
		`${baseClass}--${variant}`,
		className
	].filter(Boolean).join(' ');

	const renderVariant = () => {
		switch (variant) {
			case 'spinner':
				return (
					<Icon 
						name="spinner" 
						size={size} 
						className={`${baseClass}__icon forjeon-icon--spinning`}
					/>
				);
			
			case 'dots':
				return (
					<div className={`${baseClass}__dots`}>
						<span className={`${baseClass}__dot`} />
						<span className={`${baseClass}__dot`} />
						<span className={`${baseClass}__dot`} />
					</div>
				);
			
			case 'pulse':
				return (
					<div className={`${baseClass}__pulse`}>
						<div className={`${baseClass}__pulse-ring`} />
						<div className={`${baseClass}__pulse-ring`} />
					</div>
				);
			
			default:
				return (
					<Icon 
						name="spinner" 
						size={size} 
						className={`${baseClass}__icon forjeon-icon--spinning`}
					/>
				);
		}
	};

	return (
		<div className={classes} {...props}>
			{renderVariant()}
			{text && (
				<span className={`${baseClass}__text`}>
					{text}
				</span>
			)}
		</div>
	);
};

// Skeleton loader for content placeholders
export const Skeleton = ({ 
	width = '100%', 
	height = '1rem',
	className = '',
	...props 
}) => {
	const baseClass = 'forjeon-skeleton';
	const classes = [baseClass, className].filter(Boolean).join(' ');

	return (
		<div 
			className={classes}
			style={{ width, height }}
			{...props}
		/>
	);
};