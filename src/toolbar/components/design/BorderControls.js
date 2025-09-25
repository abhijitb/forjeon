/**
 * Border Controls Component
 * Handles border width, style, color, and radius
 * 
 * @package Forjeon
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { RangeControl, SelectControl, ColorPicker } from '@wordpress/components';

/**
 * Border Controls - Width, style, color, and border radius
 */
export function BorderControls({ value, onChange }) {
	const updateBorder = (updates) => {
		const newValue = { ...value, ...updates };
		onChange(newValue);
	};

	const borderStyles = [
		{ label: __('Solid', 'forjeon'), value: 'solid' },
		{ label: __('Dashed', 'forjeon'), value: 'dashed' },
		{ label: __('Dotted', 'forjeon'), value: 'dotted' },
		{ label: __('Double', 'forjeon'), value: 'double' },
		{ label: __('Groove', 'forjeon'), value: 'groove' },
		{ label: __('Ridge', 'forjeon'), value: 'ridge' },
		{ label: __('Inset', 'forjeon'), value: 'inset' },
		{ label: __('Outset', 'forjeon'), value: 'outset' },
	];

	return (
		<div className="forjeon-border-controls">
			{/* Border Width */}
			<div className="control-group">
				<RangeControl
					label={__('Border Width', 'forjeon')}
					value={value.width || 0}
					onChange={(width) => updateBorder({ width })}
					min={0}
					max={20}
					step={1}
					beforeIcon="minus"
					afterIcon="plus"
					allowReset={true}
					resetFallbackValue={0}
				/>
			</div>

			{/* Border Style - Only show if width > 0 */}
			{value.width > 0 && (
				<div className="control-group">
					<SelectControl
						label={__('Border Style', 'forjeon')}
						value={value.style || 'solid'}
						options={borderStyles}
						onChange={(style) => updateBorder({ style })}
					/>
				</div>
			)}

			{/* Border Color - Only show if width > 0 */}
			{value.width > 0 && (
				<div className="control-group">
					<label className="control-label">
						{__('Border Color', 'forjeon')}
					</label>
					<div className="color-picker-wrapper">
						<ColorPicker
							color={value.color || '#000000'}
							onChange={(color) => updateBorder({ color })}
							enableAlpha={true}
						/>
					</div>
				</div>
			)}

			{/* Border Radius */}
			<div className="control-group">
				<RangeControl
					label={__('Border Radius', 'forjeon')}
					value={value.radius || 0}
					onChange={(radius) => updateBorder({ radius })}
					min={0}
					max={50}
					step={1}
					beforeIcon="minus"
					afterIcon="plus"
					allowReset={true}
					resetFallbackValue={0}
					help={__('Rounded corners', 'forjeon')}
				/>
			</div>

			{/* Border Radius Presets */}
			<div className="control-group">
				<label className="control-label">
					{__('Quick Radius', 'forjeon')}
				</label>
				<div className="radius-presets">
					{[
						{ label: __('None', 'forjeon'), value: 0 },
						{ label: __('Small', 'forjeon'), value: 4 },
						{ label: __('Medium', 'forjeon'), value: 8 },
						{ label: __('Large', 'forjeon'), value: 16 },
						{ label: __('Round', 'forjeon'), value: 50 },
					].map((preset) => (
						<button
							key={preset.value}
							className={`radius-preset ${value.radius === preset.value ? 'active' : ''}`}
							onClick={() => updateBorder({ radius: preset.value })}
						>
							{preset.label}
						</button>
					))}
				</div>
			</div>

			{/* Border Preview */}
			{(value.width > 0 || value.radius > 0) && (
				<div className="border-preview">
					<label className="control-label">
						{__('Preview', 'forjeon')}
					</label>
					<div 
						className="border-preview-box"
						style={{
							width: '100%',
							height: '60px',
							background: '#f8f9fa',
							border: value.width > 0 ? `${value.width}px ${value.style} ${value.color}` : 'none',
							borderRadius: `${value.radius}px`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#666',
							fontSize: '12px'
						}}
					>
						{__('Border Preview', 'forjeon')}
					</div>
				</div>
			)}
		</div>
	);
}