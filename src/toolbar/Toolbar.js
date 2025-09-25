/**
 * Main Forjeon Toolbar Component
 * 
 * @package Forjeon
 * @since 1.0.0
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';
import { Button, Panel, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { close, dragHandle, settings } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { ToolbarProvider } from './ToolbarProvider';
import { TabPanel } from './components/ui/TabPanel';
import { FloatingPanel } from './components/layout/FloatingPanel';
import { toolbarPreferences, settings as pluginSettings } from './utils/preferences';

// Import tab components
import { DesignTab } from './tabs/DesignTab';
import { AdvancedTypographyPanel as TypographyTab } from './tabs/TypographyTab';
import { LayoutTab } from './tabs/LayoutTab';
import { EffectsTab } from './tabs/EffectsTab';
import { BlocksTab } from './tabs/BlocksTab';
import { AdvancedTab } from './tabs/AdvancedTab';

/**
 * Main Forjeon Toolbar Component
 * Provides floating/dockable interface for all Forjeon controls
 */
export function Toolbar() {
	// Initialize state from saved preferences
	const [isVisible, setIsVisible] = useState(() => toolbarPreferences.getVisible());
	const [activeTab, setActiveTab] = useState(() => toolbarPreferences.getActiveTab());
	const [isMinimized, setIsMinimized] = useState(() => toolbarPreferences.getMinimized());
	const [isDocked, setIsDocked] = useState(() => {
		// Check if default position should be docked
		const defaultPosition = pluginSettings.getDefaultPosition();
		const savedDocked = toolbarPreferences.getDocked();
		return defaultPosition === 'docked' ? true : savedDocked;
	});
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState(() => toolbarPreferences.getPosition());
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const toolbarRef = useRef(null);

	// Define toolbar tabs
	const tabs = [
		{
			name: 'design',
			title: __('Design', 'forjeon'),
			icon: '🎨',
			component: DesignTab,
			disabled: false // Enabled in Phase 2.1
		},
		{
			name: 'typography',
			title: __('Typography', 'forjeon'),
			icon: '📝',
			component: TypographyTab,
			disabled: false // Currently working
		},
		{
			name: 'layout',
			title: __('Layout', 'forjeon'),
			icon: '📐',
			component: LayoutTab,
			disabled: true // Will enable in Phase 2
		},
		{
			name: 'effects',
			title: __('Effects', 'forjeon'),
			icon: '✨',
			component: EffectsTab,
			disabled: true // Will enable in Phase 3
		},
		{
			name: 'blocks',
			title: __('Blocks', 'forjeon'),
			icon: '🧩',
			component: BlocksTab,
			disabled: true // Will enable in Phase 4
		},
		{
			name: 'advanced',
			title: __('Advanced', 'forjeon'),
			icon: '⚙️',
			component: AdvancedTab,
			disabled: true // Will enable in Phase 5
		}
	];

	// Toggle toolbar visibility
	const toggleToolbar = () => {
		const newState = !isVisible;
		setIsVisible(newState);
		toolbarPreferences.setVisible(newState);
		// Notify header button of state change
		window.dispatchEvent(new CustomEvent('forjeon-toolbar-state', {
			detail: { isVisible: newState }
		}));
	};

	// Handle keyboard shortcuts and custom events
	useEffect(() => {
		const handleKeyDown = (event) => {
			// Only handle keyboard shortcuts if they're enabled
			if (!pluginSettings.areKeyboardShortcutsEnabled()) {
				return;
			}
			
			// Alt + F to toggle toolbar
			if (event.altKey && (event.key === 'f' || event.key === 'ƒ' || event.code === 'KeyF')) {
				event.preventDefault();
				toggleToolbar();
			}
			// Escape to close toolbar
			if (event.key === 'Escape' && isVisible) {
				setIsVisible(false);
				toolbarPreferences.setVisible(false);
			}
		};

		const handleCustomToggle = () => {
			toggleToolbar();
		};

		document.addEventListener('keydown', handleKeyDown);
		window.addEventListener('forjeon-toggle-toolbar', handleCustomToggle);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('forjeon-toggle-toolbar', handleCustomToggle);
		};
	}, [isVisible]);

	// Handle drag functionality
	const handleDragStart = (event) => {
		if (!toolbarRef.current || isDocked) return; // Don't allow dragging when docked
		
		const rect = toolbarRef.current.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;
		
		setDragOffset({ x: offsetX, y: offsetY });
		setIsDragging(true);
		event.preventDefault();
	};

	const handleDragMove = (event) => {
		if (!isDragging) return;
		
		const newX = event.clientX - dragOffset.x;
		const newY = event.clientY - dragOffset.y;
		
		// Get actual toolbar dimensions if available
		const toolbarElement = toolbarRef.current;
		const toolbarWidth = toolbarElement ? toolbarElement.offsetWidth : 380;
		const toolbarHeight = toolbarElement ? toolbarElement.offsetHeight : 500;
		
		// Keep toolbar within viewport bounds with small padding
		const padding = 10;
		const maxX = window.innerWidth - toolbarWidth - padding;
		const maxY = window.innerHeight - toolbarHeight - padding;
		
		const boundedX = Math.max(padding, Math.min(newX, maxX));
		const boundedY = Math.max(padding, Math.min(newY, maxY));
		
		setPosition({ x: boundedX, y: boundedY });
	};

	const handleDragEnd = () => {
		setIsDragging(false);
		// Save the new position when dragging ends
		toolbarPreferences.setPosition(position);
	};

	// Mouse event listeners for dragging
	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleDragMove);
			document.addEventListener('mouseup', handleDragEnd);
			
			return () => {
				document.removeEventListener('mousemove', handleDragMove);
				document.removeEventListener('mouseup', handleDragEnd);
			};
		}
	}, [isDragging, dragOffset]);

	// Get current tab component
	const getCurrentTabComponent = () => {
		const currentTab = tabs.find(tab => tab.name === activeTab);
		if (!currentTab || currentTab.disabled) {
			return () => (
				<div className="forjeon-tab-disabled">
					<p>{__('This feature is coming soon!', 'forjeon')}</p>
					<p className="forjeon-tab-disabled-description">
						{currentTab?.name === 'design' && __('Advanced design controls will be available in Phase 2.', 'forjeon')}
						{currentTab?.name === 'layout' && __('Layout controls will be available in Phase 2.', 'forjeon')}
						{currentTab?.name === 'effects' && __('Animation and effects will be available in Phase 3.', 'forjeon')}
						{currentTab?.name === 'blocks' && __('Custom blocks library will be available in Phase 4.', 'forjeon')}
						{currentTab?.name === 'advanced' && __('Advanced features will be available in Phase 5.', 'forjeon')}
					</p>
				</div>
			);
		}
		return currentTab.component;
	};

	const CurrentTabComponent = getCurrentTabComponent();

	// Don't render if toolbar is disabled
	if (!pluginSettings.isToolbarEnabled()) {
		return null;
	}

	// Get the document body for portal mounting
	const portalTarget = document.body;
	
	const toolbarElements = (
		<>
			{/* Main Toolbar Panel - No custom button needed */}
			{isVisible && (
				<div
					ref={toolbarRef}
					style={{
						position: 'fixed',
						...(isDocked ? {
							right: '20px',
							top: '50%',
							transform: 'translateY(-50%)',
						} : {
							left: `${position.x}px`,
							top: `${position.y}px`,
						}),
						width: '380px',
						maxHeight: '80vh',
						background: '#fff',
						border: '1px solid #ddd',
						borderRadius: '8px',
						boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
						zIndex: 100000,
						overflow: 'hidden',
						cursor: isDragging ? 'grabbing' : (isDocked ? 'default' : 'default')
					}}
					className={`forjeon-toolbar ${isDocked ? 'is-docked' : ''}`}
				>
					{/* Drag Handle */}
					<div
						onMouseDown={handleDragStart}
						style={{
							height: '24px',
							background: 'linear-gradient(135deg, #f7f8f9 0%, #e8eaed 100%)',
							borderBottom: '1px solid #ddd',
							cursor: isDocked ? 'default' : 'grab',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							fontSize: '12px',
							color: '#8c8f94',
							padding: '0 8px'
						}}
						title={isDocked ? __('Toolbar is docked', 'forjeon') : __('Drag to move toolbar', 'forjeon')}
					>
						<span>{isDocked ? '📌' : '⋮⋮⋮'}</span>
						{isDocked && (
							<button
								onClick={() => {
									setIsDocked(false);
									toolbarPreferences.setDocked(false);
								}}
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									fontSize: '12px',
									color: '#0073aa',
									padding: '2px 4px'
								}}
								title={__('Undock toolbar', 'forjeon')}
							>
								{__('Undock', 'forjeon')}
							</button>
						)}
					</div>

					{/* Toolbar Header */}
					<div style={{
						padding: '12px 16px 8px',
						borderBottom: '1px solid #f0f0f1',
						background: 'linear-gradient(135deg, #f9f9f9 0%, #f3f4f5 100%)',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}>
						<div>
							<h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e1e1e' }}>
								🎨 {__('Forjeon Toolbar', 'forjeon')}
							</h3>
						</div>
						<div style={{ display: 'flex', gap: '4px' }}>
							{!isDocked && (
								<button 
									onClick={() => {
										setIsDocked(true);
										toolbarPreferences.setDocked(true);
									}}
									style={{
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										padding: '4px',
										color: '#646970',
										fontSize: '12px'
									}}
									title={__('Dock to right', 'forjeon')}
								>
									📌
								</button>
							)}
							<button 
								onClick={() => {
									setIsVisible(false);
									toolbarPreferences.setVisible(false);
								}}
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									padding: '4px',
									color: '#646970'
								}}
							>
								✕
							</button>
						</div>
					</div>

					{/* Tab Navigation */}
					<div style={{
						display: 'flex',
						background: '#f6f7f7',
						borderBottom: '1px solid #ddd'
					}}>
						{tabs.map((tab) => (
							<button
								key={tab.name}
								onClick={() => {
								if (!tab.disabled) {
									setActiveTab(tab.name);
									toolbarPreferences.setActiveTab(tab.name);
								}
							}}
								disabled={tab.disabled}
								style={{
									flex: 1,
									padding: '10px 8px',
									border: 'none',
									borderRight: '1px solid #e0e0e0',
									background: activeTab === tab.name ? '#fff' : 'transparent',
									color: tab.disabled ? '#999' : (activeTab === tab.name ? '#0073aa' : '#646970'),
									fontSize: '11px',
									fontWeight: 500,
									textAlign: 'center',
									cursor: tab.disabled ? 'not-allowed' : 'pointer',
									opacity: tab.disabled ? 0.6 : 1
								}}
							>
								<div style={{ fontSize: '20px', marginBottom: '2px' }}>{tab.icon}</div>
								<div>{tab.title}</div>
								{tab.disabled && (
									<div style={{
										position: 'absolute',
										top: '2px',
										right: '2px',
										background: '#ff6b35',
										color: '#fff',
										fontSize: '8px',
										padding: '1px 4px',
										borderRadius: '8px',
										fontWeight: 600
									}}>
										{__('Soon', 'forjeon')}
									</div>
								)}
							</button>
						))}
					</div>

					{/* Active Tab Content */}
					<div style={{
						padding: '16px',
						maxHeight: '60vh',
						overflowY: 'auto'
					}}>
						<CurrentTabComponent />
					</div>
				</div>
			)}
			
			{/* Original FloatingPanel - disabled for now */}
			{false && isVisible && (
				<FloatingPanel
					ref={toolbarRef}
					position={position}
					onPositionChange={setPosition}
					isDocked={isDocked}
					onDockChange={setIsDocked}
					isMinimized={isMinimized}
					className="forjeon-main-toolbar"
				>
					{/* Toolbar Header */}
					<div className="forjeon-toolbar-header">
						<div className="forjeon-toolbar-title">
							<span className="forjeon-toolbar-logo">🎨</span>
							<h3>{__('Forjeon Toolbar', 'forjeon')}</h3>
						</div>
						<div className="forjeon-toolbar-actions">
							<Button
								variant="tertiary"
								onClick={() => setIsMinimized(!isMinimized)}
								icon={isMinimized ? 'maximize' : 'minimize'}
								label={isMinimized ? __('Maximize', 'forjeon') : __('Minimize', 'forjeon')}
								size="small"
							/>
							<Button
								variant="tertiary"
								onClick={() => setIsDocked(!isDocked)}
								icon={dragHandle}
								label={isDocked ? __('Undock', 'forjeon') : __('Dock', 'forjeon')}
								size="small"
							/>
							<Button
								variant="tertiary"
								onClick={() => setIsVisible(false)}
								icon={close}
								label={__('Close', 'forjeon')}
								size="small"
							/>
						</div>
					</div>

					{/* Toolbar Content - Only show if not minimized */}
					{!isMinimized && (
						<div className="forjeon-toolbar-content">
							{/* Tab Navigation */}
							<TabPanel
								tabs={tabs}
								activeTab={activeTab}
								onTabChange={setActiveTab}
								className="forjeon-toolbar-tabs"
							/>

							{/* Active Tab Content */}
							<div className="forjeon-toolbar-tab-content">
								<CurrentTabComponent />
							</div>
						</div>
					)}
				</FloatingPanel>
			)}
		</>
	);
	
	// Use React portal to mount to document body
	return portalTarget ? createPortal(toolbarElements, portalTarget) : null;
}