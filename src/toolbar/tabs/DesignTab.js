/**
 * Design Tab Component (Phase 2.1)
 * Advanced design controls for backgrounds, borders, and visual styling
 * 
 * @package Forjeon
 * @since 2.1.0
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { BackgroundControls } from '../components/design/BackgroundControls';
import { BorderControls } from '../components/design/BorderControls';
import { BoxShadowControls } from '../components/design/BoxShadowControls';
import { SpacingControls } from '../components/design/SpacingControls';
import { useBlockDesign } from '../hooks/useBlockDesign';

/**
 * Design Tab - Advanced visual styling controls
 */
export function DesignTab() {
	// Use block design hook
	const {
		selectedBlock,
		applyDesignToBlock,
		clearDesignFromBlock,
		getCurrentDesignSettings,
		hasCurrentDesignSettings
	} = useBlockDesign();

	// Local state for design controls
	const [designSettings, setDesignSettings] = useState(() => getCurrentDesignSettings());

	// Update local state when block selection changes
	useEffect(() => {
		setDesignSettings(getCurrentDesignSettings());
	}, [selectedBlock]);

	// Update block design when settings change
	const updateBlockDesign = (newSettings) => {
		console.log('DesignTab: Updating block design', newSettings);
		console.log('Selected block:', selectedBlock);
		setDesignSettings(newSettings);
		applyDesignToBlock(newSettings);
	};

	// No block selected message
	if (!selectedBlock) {
		return (
			<div className="forjeon-design-tab">
				<div className="forjeon-no-selection">
					<div className="no-selection-icon">🎨</div>
					<h3>{__('Design Controls', 'forjeon')}</h3>
					<p>{__('Select a block to customize its design properties.', 'forjeon')}</p>
					<div className="design-features">
						<div className="feature-item">
							<span className="feature-icon">🌈</span>
							<span>{__('Backgrounds & Colors', 'forjeon')}</span>
						</div>
						<div className="feature-item">
							<span className="feature-icon">🔲</span>
							<span>{__('Borders & Corners', 'forjeon')}</span>
						</div>
						<div className="feature-item">
							<span className="feature-icon">✨</span>
							<span>{__('Shadows & Effects', 'forjeon')}</span>
						</div>
						<div className="feature-item">
							<span className="feature-icon">📏</span>
							<span>{__('Spacing & Layout', 'forjeon')}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="forjeon-design-tab">
			{/* Block Info Header */}
			<div className="forjeon-block-info">
				<div className="block-info-content">
					<div className="block-info-left">
						<span className="block-type">{selectedBlock.name.replace('core/', '')}</span>
						<span className="block-label">{__('Block Selected', 'forjeon')}</span>
					</div>
					<div className="block-info-actions">
						{hasCurrentDesignSettings() && (
							<Button
								variant="tertiary"
								size="small"
								onClick={() => {
									clearDesignFromBlock();
									setDesignSettings(getCurrentDesignSettings());
								}}
								className="clear-design-button"
							>
								{__('Clear Design', 'forjeon')}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Design Control Sections */}
			<div className="forjeon-design-sections">
				
				{/* Background Section */}
				<div className="design-section">
					<h4 className="section-title">
						<span className="section-icon">🌈</span>
						{__('Background', 'forjeon')}
					</h4>
					<BackgroundControls
						value={designSettings.background}
						onChange={(background) => 
							updateBlockDesign({ ...designSettings, background })
						}
					/>
				</div>

				{/* Border Section */}
				<div className="design-section">
					<h4 className="section-title">
						<span className="section-icon">🔲</span>
						{__('Borders', 'forjeon')}
					</h4>
					<BorderControls
						value={designSettings.border}
						onChange={(border) => 
							updateBlockDesign({ ...designSettings, border })
						}
					/>
				</div>

				{/* Box Shadow Section */}
				<div className="design-section">
					<h4 className="section-title">
						<span className="section-icon">✨</span>
						{__('Box Shadow', 'forjeon')}
					</h4>
					<BoxShadowControls
						value={designSettings.boxShadow}
						onChange={(boxShadow) => 
							updateBlockDesign({ ...designSettings, boxShadow })
						}
					/>
				</div>

				{/* Spacing Section */}
				<div className="design-section">
					<h4 className="section-title">
						<span className="section-icon">📏</span>
						{__('Spacing', 'forjeon')}
					</h4>
					<SpacingControls
						value={designSettings.spacing}
						onChange={(spacing) => 
							updateBlockDesign({ ...designSettings, spacing })
						}
					/>
				</div>

			</div>
		</div>
	);
}