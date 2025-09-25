/**
 * Background Controls Component
 * Handles background colors, gradients, and images
 * 
 * @package Forjeon
 * @since 2.1.0
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ColorPicker, Button, ButtonGroup } from '@wordpress/components';

/**
 * Background Controls - Color, gradient, and image background options
 */
export function BackgroundControls({ value, onChange }) {
	const [activeType, setActiveType] = useState(value.type || 'none');

	const updateBackground = (updates) => {
		const newValue = { ...value, ...updates };
		onChange(newValue);
	};

	const setBackgroundType = (type) => {
		setActiveType(type);
		updateBackground({ type });
	};

	return (
		<div className="forjeon-background-controls">
			{/* Background Type Selector */}
			<div className="background-type-selector">
				<ButtonGroup className="background-type-buttons">
					<Button 
						variant={activeType === 'none' ? 'primary' : 'secondary'}
						onClick={() => setBackgroundType('none')}
						size="small"
					>
						{__('None', 'forjeon')}
					</Button>
					<Button 
						variant={activeType === 'color' ? 'primary' : 'secondary'}
						onClick={() => setBackgroundType('color')}
						size="small"
					>
						{__('Color', 'forjeon')}
					</Button>
					<Button 
						variant={activeType === 'gradient' ? 'primary' : 'secondary'}
						onClick={() => setBackgroundType('gradient')}
						size="small"
					>
						{__('Gradient', 'forjeon')}
					</Button>
					<Button 
						variant={activeType === 'image' ? 'primary' : 'secondary'}
						onClick={() => setBackgroundType('image')}
						size="small"
						disabled={true}
					>
						{__('Image', 'forjeon')} <small>(Soon)</small>
					</Button>
				</ButtonGroup>
			</div>

			{/* Color Background Controls */}
			{activeType === 'color' && (
				<div className="background-color-controls">
					<div className="control-group">
						<label className="control-label">
							{__('Background Color', 'forjeon')}
						</label>
						<div className="color-picker-wrapper">
							<ColorPicker
								color={value.color || '#ffffff'}
								onChange={(color) => updateBackground({ color })}
								enableAlpha={true}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Gradient Background Controls */}
			{activeType === 'gradient' && (
				<div className="background-gradient-controls">
					<div className="gradient-presets">
						<label className="control-label">
							{__('Gradient Presets', 'forjeon')}
						</label>
						<div className="gradient-preset-grid">
							{[
								{ name: 'Blue Sky', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
								{ name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
								{ name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
								{ name: 'Forest', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
								{ name: 'Fire', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
								{ name: 'Night', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
							].map((gradient) => (
								<button
									key={gradient.name}
									className="gradient-preset"
									style={{ background: gradient.value }}
									onClick={() => updateBackground({ gradient: gradient.value })}
									title={gradient.name}
								/>
							))}
						</div>
					</div>
					
					<div className="control-group">
						<label className="control-label">
							{__('Custom Gradient', 'forjeon')}
						</label>
						<input
							type="text"
							className="gradient-input"
							value={value.gradient || ''}
							onChange={(e) => updateBackground({ gradient: e.target.value })}
							placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
						/>
						<p className="control-description">
							{__('Enter a CSS gradient value', 'forjeon')}
						</p>
					</div>
				</div>
			)}

			{/* Image Background Controls - Placeholder */}
			{activeType === 'image' && (
				<div className="background-image-controls">
					<div className="coming-soon">
						<p>{__('Image background controls coming soon!', 'forjeon')}</p>
					</div>
				</div>
			)}

			{/* Preview */}
			{(activeType === 'color' || activeType === 'gradient') && (
				<div className="background-preview">
					<label className="control-label">
						{__('Preview', 'forjeon')}
					</label>
					<div 
						className="background-preview-box"
						style={{
							background: activeType === 'color' ? value.color : value.gradient,
							width: '100%',
							height: '60px',
							borderRadius: '4px',
							border: '1px solid #ddd'
						}}
					/>
				</div>
			)}
		</div>
	);
}