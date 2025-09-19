import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Line Height Control Component
 * Provides slider and input controls for line height with unit selection
 */
export function LineHeightControl({ value, onChange }) {
	const [localValue, setLocalValue] = useState(
		value || { value: 1.5, unit: '' }
	);
	const [inputValue, setInputValue] = useState(value?.value || 1.5);

	// Update local state when prop changes
	useEffect(() => {
		if (
			value &&
			(value.value !== localValue.value || value.unit !== localValue.unit)
		) {
			setLocalValue(value);
			setInputValue(value.value);
		}
	}, [value]);

	// Default values and constraints
	const defaults = {
		min: 0.5,
		max: 3.0,
		step: 0.1,
		default: 1.5,
		units: [
			{ value: '', label: __('Unitless', 'forjeon') },
			{ value: 'em', label: 'em' },
			{ value: 'px', label: 'px' },
		],
	};

	const handleSliderChange = (newValue) => {
		const newLineHeight = {
			value: newValue,
			unit: localValue.unit,
		};
		setLocalValue(newLineHeight);
		setInputValue(newValue);
		onChange(newLineHeight);
	};

	const handleInputChange = (newValue) => {
		const numValue = parseFloat(newValue);
		if (isNaN(numValue)) {
			setInputValue(newValue);
			return;
		}

		// Clamp value to valid range
		const clampedValue = Math.max(
			defaults.min,
			Math.min(defaults.max, numValue)
		);
		const newLineHeight = {
			value: clampedValue,
			unit: localValue.unit,
		};

		setLocalValue(newLineHeight);
		setInputValue(clampedValue);
		onChange(newLineHeight);
	};

	const handleUnitChange = (newUnit) => {
		const newLineHeight = {
			value: localValue.value,
			unit: newUnit,
		};
		setLocalValue(newLineHeight);
		onChange(newLineHeight);
	};

	const handleReset = () => {
		const resetValue = {
			value: defaults.default,
			unit: '',
		};
		setLocalValue(resetValue);
		setInputValue(defaults.default);
		onChange(resetValue);
	};

	return (
		<div className="forjeon-line-height-control">
			<div className="forjeon-control-header">
				<h4>{__('Line Height', 'forjeon')}</h4>
				<button
					type="button"
					className="forjeon-reset-button"
					onClick={handleReset}
					aria-label={__('Reset line height', 'forjeon')}
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
					label={__('Line Height Slider', 'forjeon')}
					className="forjeon-range-control"
					__nextHasNoMarginBottom={true}
					__next40pxDefaultSize={true}
				/>

				<div className="forjeon-input-group">
					<TextControl
						type="number"
						value={inputValue}
						onChange={handleInputChange}
						min={defaults.min}
						max={defaults.max}
						step={defaults.step}
						label={__('Line Height Value', 'forjeon')}
						className="forjeon-number-input"
						__nextHasNoMarginBottom={true}
						__next40pxDefaultSize={true}
					/>

					<SelectControl
						value={localValue.unit}
						onChange={handleUnitChange}
						options={defaults.units}
						label={__('Unit', 'forjeon')}
						className="forjeon-unit-select"
						__nextHasNoMarginBottom={true}
						__next40pxDefaultSize={true}
					/>
				</div>

				<div className="forjeon-preview">
					<div
						className="forjeon-preview-text"
						style={{
							lineHeight: `${localValue.value}${localValue.unit}`,
						}}
					>
						{__(
							'Sample text with current line height to show visual impact of changes',
							'forjeon'
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
