import { __ } from '@wordpress/i18n';
import { RangeControl, TextControl, Button } from '@wordpress/components';
import { ColorPicker } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Text Shadow Control Component
 * Provides controls for X/Y offset, blur radius, and color with preset options
 */
export function TextShadowControl({ value, onChange }) {
	const [localValue, setLocalValue] = useState(value || {
		x: 0,
		y: 2,
		blur: 3,
		color: '#000000',
	});
	const [showColorPicker, setShowColorPicker] = useState(false);

	// Update local state when prop changes
	useEffect(() => {
		if (value && (
			value.x !== localValue.x ||
			value.y !== localValue.y ||
			value.blur !== localValue.blur ||
			value.color !== localValue.color
		)) {
			setLocalValue(value);
		}
	}, [value]);

	// Default values and constraints
	const defaults = {
		x: { min: -10, max: 10, step: 1, default: 0 },
		y: { min: -10, max: 10, step: 1, default: 2 },
		blur: { min: 0, max: 20, step: 1, default: 3 },
		color: '#000000',
	};

	// Preset shadow options
	const presets = [
		{
			key: 'subtle',
			label: __('Subtle', 'forjeon'),
			value: { x: 0, y: 1, blur: 2, color: 'rgba(0, 0, 0, 0.1)' },
		},
		{
			key: 'medium',
			label: __('Medium', 'forjeon'),
			value: { x: 0, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.3)' },
		},
		{
			key: 'strong',
			label: __('Strong', 'forjeon'),
			value: { x: 0, y: 3, blur: 6, color: 'rgba(0, 0, 0, 0.5)' },
		},
	];

	const handleValueChange = (property, newValue) => {
		const newShadow = { ...localValue, [property]: newValue };
		setLocalValue(newShadow);
		onChange(newShadow);
	};

	const handlePresetSelect = (preset) => {
		setLocalValue(preset.value);
		onChange(preset.value);
	};

	const handleReset = () => {
		const resetValue = {
			x: defaults.x.default,
			y: defaults.y.default,
			blur: defaults.blur.default,
			color: defaults.color,
		};
		setLocalValue(resetValue);
		onChange(resetValue);
	};

	const toggleColorPicker = () => {
		setShowColorPicker(!showColorPicker);
	};

	// Generate CSS value for preview
	const generateShadowValue = () => {
		return `${localValue.x}px ${localValue.y}px ${localValue.blur}px ${localValue.color}`;
	};

	return (
		<div className="forjeon-text-shadow-control">
			<div className="forjeon-control-header">
				<h4>{__('Text Shadow', 'forjeon')}</h4>
				<button
					type="button"
					className="forjeon-reset-button"
					onClick={handleReset}
					aria-label={__('Reset text shadow', 'forjeon')}
				>
					{__('Reset', 'forjeon')}
				</button>
			</div>

			<div className="forjeon-control-content">
				<div className="forjeon-shadow-inputs">
					<div className="forjeon-input-row">
						<TextControl
							type="number"
							value={localValue.x}
							onChange={(value) => handleValueChange('x', parseInt(value) || 0)}
							min={defaults.x.min}
							max={defaults.x.max}
							step={defaults.x.step}
							label={__('X Offset', 'forjeon')}
							className="forjeon-number-input"
							__nextHasNoMarginBottom={true}
							__next40pxDefaultSize={true}
						/>

						<TextControl
							type="number"
							value={localValue.y}
							onChange={(value) => handleValueChange('y', parseInt(value) || 0)}
							min={defaults.y.min}
							max={defaults.y.max}
							step={defaults.y.step}
							label={__('Y Offset', 'forjeon')}
							className="forjeon-number-input"
							__nextHasNoMarginBottom={true}
							__next40pxDefaultSize={true}
						/>
					</div>

					<div className="forjeon-input-row">
						<RangeControl
							value={localValue.blur}
							onChange={(value) => handleValueChange('blur', value)}
							min={defaults.blur.min}
							max={defaults.blur.max}
							step={defaults.blur.step}
							label={__('Blur Radius', 'forjeon')}
							className="forjeon-range-control"
							__nextHasNoMarginBottom={true}
							__next40pxDefaultSize={true}
						/>
					</div>

					<div className="forjeon-color-section">
						<Button
							type="button"
							onClick={toggleColorPicker}
							className="forjeon-color-button"
							style={{ backgroundColor: localValue.color }}
							aria-label={__('Select shadow color', 'forjeon')}
						>
							{__('Color', 'forjeon')}
						</Button>

						{showColorPicker && (
							<div className="forjeon-color-picker">
								<ColorPicker
									color={localValue.color}
									onChange={(color) => handleValueChange('color', color)}
									enableAlpha={true}
								/>
							</div>
						)}
					</div>
				</div>

				<div className="forjeon-presets">
					<h5>{__('Presets', 'forjeon')}</h5>
					<div className="forjeon-preset-buttons" style={{ display: 'flex', gap: '8px' }}>
						{presets.map((preset) => (
							<Button
								key={preset.key}
								isSmall
								variant="secondary"
								onClick={() => handlePresetSelect(preset)}
								className="forjeon-preset-button"
							>
								{preset.label}
							</Button>
						))}
					</div>
				</div>

				<div className="forjeon-preview">
					<div
						className="forjeon-preview-text"
						style={{
							textShadow: generateShadowValue(),
						}}
					>
						{__('Sample text with shadow effect', 'forjeon')}
					</div>
				</div>
			</div>
		</div>
	);
}
