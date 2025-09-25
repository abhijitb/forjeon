/**
 * Spacing Controls Component
 * Handles margin and padding with visual representation
 * 
 * @package Forjeon
 * @since 2.1.0
 */

import { __ } from '@wordpress/i18n';
import { RangeControl, ButtonGroup, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Spacing Controls - Margin and padding with visual box model
 */
export function SpacingControls({ value, onChange }) {
	const [activeSpacing, setActiveSpacing] = useState('margin'); // 'margin' or 'padding'
	const [linkedValues, setLinkedValues] = useState({ margin: true, padding: true });

	const updateSpacing = (updates) => {
		const newValue = { ...value, ...updates };
		onChange(newValue);
	};

	const updateMargin = (side, newValue) => {
		const currentMargin = value.margin || { top: 0, right: 0, bottom: 0, left: 0 };
		
		if (linkedValues.margin) {
			// Update all sides with the same value
			updateSpacing({
				margin: { top: newValue, right: newValue, bottom: newValue, left: newValue }
			});
		} else {
			// Update only the specific side
			updateSpacing({
				margin: { ...currentMargin, [side]: newValue }
			});
		}
	};

	const updatePadding = (side, newValue) => {
		const currentPadding = value.padding || { top: 0, right: 0, bottom: 0, left: 0 };
		
		if (linkedValues.padding) {
			// Update all sides with the same value
			updateSpacing({
				padding: { top: newValue, right: newValue, bottom: newValue, left: newValue }
			});
		} else {
			// Update only the specific side
			updateSpacing({
				padding: { ...currentPadding, [side]: newValue }
			});
		}
	};

	const toggleLinked = (type) => {
		setLinkedValues(prev => ({
			...prev,
			[type]: !prev[type]
		}));
	};

	const resetSpacing = (type) => {
		updateSpacing({
			[type]: { top: 0, right: 0, bottom: 0, left: 0 }
		});
	};

	const spacingPresets = [
		{ label: __('None', 'forjeon'), value: 0 },
		{ label: __('XS', 'forjeon'), value: 4 },
		{ label: __('S', 'forjeon'), value: 8 },
		{ label: __('M', 'forjeon'), value: 16 },
		{ label: __('L', 'forjeon'), value: 24 },
		{ label: __('XL', 'forjeon'), value: 32 },
		{ label: __('XXL', 'forjeon'), value: 48 },
	];

	const currentMargin = value.margin || { top: 0, right: 0, bottom: 0, left: 0 };
	const currentPadding = value.padding || { top: 0, right: 0, bottom: 0, left: 0 };

	return (
		<div className="forjeon-spacing-controls">
			{/* Spacing Type Toggle */}
			<div className="control-group">
				<ButtonGroup>
					<Button
						variant={activeSpacing === 'margin' ? 'primary' : 'secondary'}
						onClick={() => setActiveSpacing('margin')}
					>
						{__('Margin', 'forjeon')}
					</Button>
					<Button
						variant={activeSpacing === 'padding' ? 'primary' : 'secondary'}
						onClick={() => setActiveSpacing('padding')}
					>
						{__('Padding', 'forjeon')}
					</Button>
				</ButtonGroup>
			</div>

			{/* Visual Box Model */}
			<div className="spacing-visual">
				<div className="box-model">
					{/* Margin Layer */}
					<div 
						className="margin-layer" 
						style={{
							padding: `${currentMargin.top}px ${currentMargin.right}px ${currentMargin.bottom}px ${currentMargin.left}px`,
							background: activeSpacing === 'margin' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 165, 0, 0.1)',
							border: activeSpacing === 'margin' ? '1px dashed #ff9500' : '1px dashed rgba(255, 149, 0, 0.3)'
						}}
					>
						<div className="margin-label">Margin</div>
						
						{/* Padding Layer */}
						<div 
							className="padding-layer"
							style={{
								padding: `${currentPadding.top}px ${currentPadding.right}px ${currentPadding.bottom}px ${currentPadding.left}px`,
								background: activeSpacing === 'padding' ? 'rgba(0, 123, 170, 0.2)' : 'rgba(0, 123, 170, 0.1)',
								border: activeSpacing === 'padding' ? '1px dashed #007baa' : '1px dashed rgba(0, 123, 170, 0.3)',
								minHeight: '60px'
							}}
						>
							<div className="padding-label">Padding</div>
							<div className="content-area">
								{__('Content', 'forjeon')}
							</div>
						</div>
					</div>
				</div>
			</div>

			{activeSpacing === 'margin' && (
				<div className="margin-controls">
					<div className="spacing-header">
						<h4>{__('Margin', 'forjeon')}</h4>
						<div className="spacing-actions">
							<Button
								variant="tertiary"
								size="small"
								onClick={() => toggleLinked('margin')}
								className={`link-toggle ${linkedValues.margin ? 'linked' : ''}`}
							>
								{linkedValues.margin ? '🔗' : '🔓'} {linkedValues.margin ? __('Linked', 'forjeon') : __('Unlinked', 'forjeon')}
							</Button>
							<Button
								variant="tertiary"
								size="small"
								onClick={() => resetSpacing('margin')}
							>
								{__('Reset', 'forjeon')}
							</Button>
						</div>
					</div>

					{/* Margin Presets */}
					<div className="spacing-presets">
						<label className="control-label">{__('Quick Margin', 'forjeon')}</label>
						<div className="preset-buttons">
							{spacingPresets.map((preset) => (
								<button
									key={preset.value}
									className="spacing-preset"
									onClick={() => updateSpacing({
										margin: { top: preset.value, right: preset.value, bottom: preset.value, left: preset.value }
									})}
								>
									{preset.label}
								</button>
							))}
						</div>
					</div>

					{/* Individual Margin Controls */}
					{linkedValues.margin ? (
						<div className="control-group">
							<RangeControl
								label={__('All Sides', 'forjeon')}
								value={currentMargin.top}
								onChange={(value) => updateMargin('top', value)}
								min={0}
								max={100}
								step={1}
								allowReset={true}
								resetFallbackValue={0}
							/>
						</div>
					) : (
						<>
							<div className="control-group">
								<RangeControl
									label={__('Top', 'forjeon')}
									value={currentMargin.top}
									onChange={(value) => updateMargin('top', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
							<div className="control-group">
								<RangeControl
									label={__('Right', 'forjeon')}
									value={currentMargin.right}
									onChange={(value) => updateMargin('right', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
							<div className="control-group">
								<RangeControl
									label={__('Bottom', 'forjeon')}
									value={currentMargin.bottom}
									onChange={(value) => updateMargin('bottom', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
							<div className="control-group">
								<RangeControl
									label={__('Left', 'forjeon')}
									value={currentMargin.left}
									onChange={(value) => updateMargin('left', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
						</>
					)}
				</div>
			)}

			{activeSpacing === 'padding' && (
				<div className="padding-controls">
					<div className="spacing-header">
						<h4>{__('Padding', 'forjeon')}</h4>
						<div className="spacing-actions">
							<Button
								variant="tertiary"
								size="small"
								onClick={() => toggleLinked('padding')}
								className={`link-toggle ${linkedValues.padding ? 'linked' : ''}`}
							>
								{linkedValues.padding ? '🔗' : '🔓'} {linkedValues.padding ? __('Linked', 'forjeon') : __('Unlinked', 'forjeon')}
							</Button>
							<Button
								variant="tertiary"
								size="small"
								onClick={() => resetSpacing('padding')}
							>
								{__('Reset', 'forjeon')}
							</Button>
						</div>
					</div>

					{/* Padding Presets */}
					<div className="spacing-presets">
						<label className="control-label">{__('Quick Padding', 'forjeon')}</label>
						<div className="preset-buttons">
							{spacingPresets.map((preset) => (
								<button
									key={preset.value}
									className="spacing-preset"
									onClick={() => updateSpacing({
										padding: { top: preset.value, right: preset.value, bottom: preset.value, left: preset.value }
									})}
								>
									{preset.label}
								</button>
							))}
						</div>
					</div>

					{/* Individual Padding Controls */}
					{linkedValues.padding ? (
						<div className="control-group">
							<RangeControl
								label={__('All Sides', 'forjeon')}
								value={currentPadding.top}
								onChange={(value) => updatePadding('top', value)}
								min={0}
								max={100}
								step={1}
								allowReset={true}
								resetFallbackValue={0}
							/>
						</div>
					) : (
						<>
							<div className="control-group">
								<RangeControl
									label={__('Top', 'forjeon')}
									value={currentPadding.top}
									onChange={(value) => updatePadding('top', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
							<div className="control-group">
								<RangeControl
									label={__('Right', 'forjeon')}
									value={currentPadding.right}
									onChange={(value) => updatePadding('right', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
							<div className="control-group">
								<RangeControl
									label={__('Bottom', 'forjeon')}
									value={currentPadding.bottom}
									onChange={(value) => updatePadding('bottom', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
							<div className="control-group">
								<RangeControl
									label={__('Left', 'forjeon')}
									value={currentPadding.left}
									onChange={(value) => updatePadding('left', value)}
									min={0}
									max={100}
									step={1}
									allowReset={true}
									resetFallbackValue={0}
								/>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
}