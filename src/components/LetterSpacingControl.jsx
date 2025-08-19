import { __ } from '@wordpress/i18n';
import { RangeControl, SelectControl, TextControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Letter Spacing Control Component
 * Provides fine-grained control for letter spacing with unit selection
 */
export function LetterSpacingControl({ value, onChange }) {
	const [localValue, setLocalValue] = useState(value || { value: 0, unit: 'em' });
	const [inputValue, setInputValue] = useState(value?.value || 0);

	// Update local state when prop changes
	useEffect(() => {
		if (value && (value.value !== localValue.value || value.unit !== localValue.unit)) {
			setLocalValue(value);
			setInputValue(value.value);
		}
	}, [value]);

	// Default values and constraints
	const defaults = {
		min: -0.1,
		max: 0.5,
		step: 0.01,
		default: 0,
		units: [
			{ value: 'em', label: 'em' },
			{ value: 'px', label: 'px' },
		],
	};

	const handleSliderChange = (newValue) => {
		const newLetterSpacing = {
			value: newValue,
			unit: localValue.unit,
		};
		setLocalValue(newLetterSpacing);
		setInputValue(newValue);
		onChange(newLetterSpacing);
	};

	const handleInputChange = (newValue) => {
		const numValue = parseFloat(newValue);
		if (isNaN(numValue)) {
			setInputValue(newValue);
			return;
		}

		// Clamp value to valid range
		const clampedValue = Math.max(defaults.min, Math.min(defaults.max, numValue));
		const newLetterSpacing = {
			value: clampedValue,
			unit: localValue.unit,
		};

		setLocalValue(newLetterSpacing);
		setInputValue(clampedValue);
		onChange(newLetterSpacing);
	};

	const handleUnitChange = (newUnit) => {
		const newLetterSpacing = {
			value: localValue.value,
			unit: newUnit,
		};
		setLocalValue(newLetterSpacing);
		onChange(newLetterSpacing);
	};

	const handleReset = () => {
		const resetValue = {
			value: defaults.default,
			unit: 'em',
		};
		setLocalValue(resetValue);
		setInputValue(defaults.default);
		onChange(resetValue);
	};

	// Generate spaced text for preview
	const generateSpacedText = () => {
		const text = __('Sample text spacing', 'forjeon');
		const spacing = localValue.value;
		const unit = localValue.unit;
		
		if (spacing === 0) {
			return text;
		}

		// Add spacing between characters
		return text.split('').join(`<span style="margin-right: ${spacing}${unit}"></span>`);
	};

	return (
		<div className="forjeon-letter-spacing-control">
			<div className="forjeon-control-header">
				<h4>{__('Letter Spacing', 'forjeon')}</h4>
				<button
					type="button"
					className="forjeon-reset-button"
					onClick={handleReset}
					aria-label={__('Reset letter spacing', 'forjeon')}
				>
					{__('Reset', 'forjeon')}
				</button>
			</div>

			<div className="forjeon-control-content">
				<RangeControl
					value={localValue.value}
					onChange={handleSliderChange}
					min={defaults.min}
					max={defaults.max}
					step={defaults.step}
					label={__('Letter Spacing Slider', 'forjeon')}
					className="forjeon-range-control"
				/>

				<div className="forjeon-input-group">
					<TextControl
						type="number"
						value={inputValue}
						onChange={handleInputChange}
						min={defaults.min}
						max={defaults.max}
						step={defaults.step}
						label={__('Letter Spacing Value', 'forjeon')}
						className="forjeon-number-input"
					/>

					<SelectControl
						value={localValue.unit}
						onChange={handleUnitChange}
						options={defaults.units}
						label={__('Unit', 'forjeon')}
						className="forjeon-unit-select"
					/>
				</div>

				<div className="forjeon-preview">
					<div className="forjeon-preview-text">
						<span dangerouslySetInnerHTML={{ __html: generateSpacedText() }} />
					</div>
				</div>
			</div>
		</div>
	);
}
