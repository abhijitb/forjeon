/**
 * Box Shadow Controls Component
 * Handles box shadow effects with live preview
 * 
 * @package Forjeon
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { RangeControl, ToggleControl, ColorPicker } from '@wordpress/components';

/**
 * Box Shadow Controls - Create and customize drop shadows
 */
export function BoxShadowControls({ value, onChange }) {
	const updateShadow = (updates) => {
		const newValue = { ...value, ...updates };
		onChange(newValue);
	};

	const generateShadowCSS = () => {
		if (!value.enabled) return 'none';
		
		const { x, y, blur, spread, color, inset } = value;
		return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`;
	};

	const shadowPresets = [
		{
			name: __('Subtle', 'forjeon'),
			shadow: { x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false }
		},
		{
			name: __('Small', 'forjeon'),
			shadow: { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }
		},
		{
			name: __('Medium', 'forjeon'),
			shadow: { x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.12)', inset: false }
		},
		{
			name: __('Large', 'forjeon'),
			shadow: { x: 0, y: 8, blur: 16, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }
		},
		{
			name: __('Extra Large', 'forjeon'),
			shadow: { x: 0, y: 12, blur: 24, spread: 0, color: 'rgba(0, 0, 0, 0.18)', inset: false }
		},
		{
			name: __('Inner', 'forjeon'),
			shadow: { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: true }
		}
	];

	return (
		<div className="forjeon-boxshadow-controls">
			{/* Enable/Disable Shadow */}
			<div className="control-group">
				<ToggleControl
					label={__('Enable Box Shadow', 'forjeon')}
					checked={value.enabled || false}
					onChange={(enabled) => updateShadow({ enabled })}
				/>
			</div>

			{value.enabled && (
				<>
					{/* Shadow Presets */}
					<div className="control-group">
						<label className="control-label">
							{__('Shadow Presets', 'forjeon')}
						</label>
						<div className="shadow-preset-grid">
							{shadowPresets.map((preset, index) => (
								<button
									key={index}
									className="shadow-preset"
									onClick={() => updateShadow({ ...preset.shadow, enabled: true })}
									style={{
										boxShadow: `${preset.shadow.inset ? 'inset ' : ''}${preset.shadow.x}px ${preset.shadow.y}px ${preset.shadow.blur}px ${preset.shadow.spread}px ${preset.shadow.color}`
									}}
									title={preset.name}
								>
									{preset.name}
								</button>
							))}
						</div>
					</div>

					{/* X Offset */}
					<div className="control-group">
						<RangeControl
							label={__('Horizontal Offset (X)', 'forjeon')}
							value={value.x || 0}
							onChange={(x) => updateShadow({ x })}
							min={-50}
							max={50}
							step={1}
							allowReset={true}
							resetFallbackValue={0}
						/>
					</div>

					{/* Y Offset */}
					<div className="control-group">
						<RangeControl
							label={__('Vertical Offset (Y)', 'forjeon')}
							value={value.y || 4}
							onChange={(y) => updateShadow({ y })}
							min={-50}
							max={50}
							step={1}
							allowReset={true}
							resetFallbackValue={4}
						/>
					</div>

					{/* Blur Radius */}
					<div className="control-group">
						<RangeControl
							label={__('Blur Radius', 'forjeon')}
							value={value.blur || 6}
							onChange={(blur) => updateShadow({ blur })}
							min={0}
							max={100}
							step={1}
							allowReset={true}
							resetFallbackValue={6}
						/>
					</div>

					{/* Spread Radius */}
					<div className="control-group">
						<RangeControl
							label={__('Spread Radius', 'forjeon')}
							value={value.spread || 0}
							onChange={(spread) => updateShadow({ spread })}
							min={-50}
							max={50}
							step={1}
							allowReset={true}
							resetFallbackValue={0}
							help={__('Positive values expand the shadow, negative values shrink it', 'forjeon')}
						/>
					</div>

					{/* Shadow Color */}
					<div className="control-group">
						<label className="control-label">
							{__('Shadow Color', 'forjeon')}
						</label>
						<div className="color-picker-wrapper">
							<ColorPicker
								color={value.color || 'rgba(0, 0, 0, 0.1)'}
								onChange={(color) => updateShadow({ color })}
								enableAlpha={true}
							/>
						</div>
					</div>

					{/* Inset Toggle */}
					<div className="control-group">
						<ToggleControl
							label={__('Inner Shadow (Inset)', 'forjeon')}
							checked={value.inset || false}
							onChange={(inset) => updateShadow({ inset })}
							help={__('Creates an inner shadow effect', 'forjeon')}
						/>
					</div>

					{/* Shadow Preview */}
					<div className="shadow-preview">
						<label className="control-label">
							{__('Preview', 'forjeon')}
						</label>
						<div 
							className="shadow-preview-box"
							style={{
								width: '100%',
								height: '80px',
								background: '#ffffff',
								boxShadow: generateShadowCSS(),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#666',
								fontSize: '12px',
								margin: '10px 0'
							}}
						>
							{__('Shadow Preview', 'forjeon')}
						</div>
					</div>

					{/* CSS Output */}
					<div className="control-group">
						<label className="control-label">
							{__('CSS Value', 'forjeon')}
						</label>
						<input
							type="text"
							className="css-output"
							value={generateShadowCSS()}
							readOnly
							style={{
								width: '100%',
								padding: '8px',
								fontSize: '11px',
								fontFamily: 'monospace',
								background: '#f8f9fa',
								border: '1px solid #ddd',
								borderRadius: '4px'
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
}