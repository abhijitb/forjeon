/**
 * Tabs Block - Edit Component
 *
 * @package Forjeon
 * @since 1.0.0
 */

import { useState } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Button,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus, trash } from '@wordpress/icons';

const Edit = ({ attributes, setAttributes, clientId }) => {
	const {
		tabs,
		activeTab,
		tabStyle,
		tabAlignment,
		enableAccordionOnMobile,
		mobileBreakpoint,
	} = attributes;
	const [draggedIndex, setDraggedIndex] = useState(null);

	const blockProps = useBlockProps({
		className: `forjeon-tabs-editor forjeon-tabs-${tabStyle} forjeon-tabs-align-${tabAlignment}`,
	});

	// Ensure we have at least one tab
	if (!tabs || tabs.length === 0) {
		const defaultTabs = [
			{ title: __('Tab 1', 'forjeon'), id: 'tab-1', isActive: true, content: '' },
			{ title: __('Tab 2', 'forjeon'), id: 'tab-2', isActive: false, content: '' },
		];
		setAttributes({ tabs: defaultTabs, activeTab: 0 });
	}

	// Update tab title
	const updateTabTitle = (index, title) => {
		const newTabs = [...tabs];
		newTabs[index] = { ...newTabs[index], title };
		setAttributes({ tabs: newTabs });
	};

	// Update tab content
	const updateTabContent = (index, content) => {
		const newTabs = [...tabs];
		newTabs[index] = { ...newTabs[index], content };
		setAttributes({ tabs: newTabs });
	};

	// Add new tab
	const addTab = () => {
		const newIndex = tabs.length;
		const newTab = {
			title: __('New Tab', 'forjeon'),
			id: `tab-${newIndex + 1}`,
			isActive: false,
			content: '',
		};

		const newTabs = [...tabs, newTab];
		setAttributes({ tabs: newTabs });
	};

	// Remove tab
	const removeTab = (index) => {
		if (tabs.length <= 1) return; // Don't allow removing the last tab

		const newTabs = tabs.filter((_, i) => i !== index);
		let newActiveTab = activeTab;

		// Update active tab if needed
		if (index === activeTab) {
			newActiveTab = index > 0 ? index - 1 : 0;
		} else if (index < activeTab) {
			newActiveTab = activeTab - 1;
		}

		setAttributes({
			tabs: newTabs,
			activeTab: Math.min(newActiveTab, newTabs.length - 1),
		});
	};

	// Set active tab
	const setActiveTab = (index) => {
		const newTabs = tabs.map((tab, i) => ({
			...tab,
			isActive: i === index,
		}));

		setAttributes({
			tabs: newTabs,
			activeTab: index,
		});
	};

	// Drag and drop handlers
	const handleDragStart = (e, index) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e, dropIndex) => {
		e.preventDefault();

		if (draggedIndex === null || draggedIndex === dropIndex) {
			setDraggedIndex(null);
			return;
		}

		const newTabs = [...tabs];
		const draggedTab = newTabs[draggedIndex];

		// Remove the dragged tab and insert at new position
		newTabs.splice(draggedIndex, 1);
		newTabs.splice(dropIndex, 0, draggedTab);

		// Update active tab index if needed
		let newActiveTab = activeTab;
		if (draggedIndex === activeTab) {
			newActiveTab = dropIndex;
		} else if (draggedIndex < activeTab && dropIndex >= activeTab) {
			newActiveTab = activeTab - 1;
		} else if (draggedIndex > activeTab && dropIndex <= activeTab) {
			newActiveTab = activeTab + 1;
		}

		setAttributes({ tabs: newTabs, activeTab: newActiveTab });
		setDraggedIndex(null);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={plus}
						label={__('Add Tab', 'forjeon')}
						onClick={addTab}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={__('Tab Settings', 'forjeon')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Tab Style', 'forjeon')}
						value={tabStyle}
						options={[
							{
								label: __('Default', 'forjeon'),
								value: 'default',
							},
							{ label: __('Pills', 'forjeon'), value: 'pills' },
							{
								label: __('Underline', 'forjeon'),
								value: 'underline',
							},
						]}
						onChange={(value) => setAttributes({ tabStyle: value })}
					/>

					<SelectControl
						label={__('Tab Alignment', 'forjeon')}
						value={tabAlignment}
						options={[
							{ label: __('Left', 'forjeon'), value: 'left' },
							{ label: __('Center', 'forjeon'), value: 'center' },
							{ label: __('Right', 'forjeon'), value: 'right' },
						]}
						onChange={(value) =>
							setAttributes({ tabAlignment: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Mobile Settings', 'forjeon')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Accordion on Mobile', 'forjeon')}
						help={__(
							'Show tabs as accordion on mobile devices.',
							'forjeon'
						)}
						checked={enableAccordionOnMobile}
						onChange={(value) =>
							setAttributes({ enableAccordionOnMobile: value })
						}
					/>

					<RangeControl
						label={__('Mobile Breakpoint (px)', 'forjeon')}
						value={mobileBreakpoint}
						onChange={(value) =>
							setAttributes({ mobileBreakpoint: value })
						}
						min={320}
						max={1024}
						step={10}
					/>
				</PanelBody>

				<PanelBody
					title={__('Tab Management', 'forjeon')}
					initialOpen={false}
				>
					{tabs.map((tab, index) => (
						<div
							key={index}
							style={{
								marginBottom: '12px',
								padding: '12px',
								border: '1px solid #ddd',
								borderRadius: '4px',
							}}
						>
							<TextControl
								label={__('Tab Title', 'forjeon')}
								value={tab.title}
								onChange={(value) =>
									updateTabTitle(index, value)
								}
								placeholder={__('Enter tab title', 'forjeon')}
							/>
							<div style={{ marginTop: '8px' }}>
								<ButtonGroup>
									<Button
										variant={
											activeTab === index
												? 'primary'
												: 'secondary'
										}
										size="small"
										onClick={() => setActiveTab(index)}
									>
										{activeTab === index
											? __('Active', 'forjeon')
											: __('Make Active', 'forjeon')}
									</Button>
									{tabs.length > 1 && (
										<Button
											variant="secondary"
											size="small"
											icon={trash}
											onClick={() => removeTab(index)}
											isDestructive
										>
											{__('Remove', 'forjeon')}
										</Button>
									)}
								</ButtonGroup>
							</div>
						</div>
					))}
					<Button variant="secondary" icon={plus} onClick={addTab}>
						{__('Add Tab', 'forjeon')}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{/* Tab Navigation */}
				<div className="forjeon-tabs-nav">
					{tabs.map((tab, index) => (
						<button
							key={index}
							className={`forjeon-tab-button ${activeTab === index ? 'active' : ''}`}
							onClick={() => setActiveTab(index)}
							draggable
							onDragStart={(e) => handleDragStart(e, index)}
							onDragOver={handleDragOver}
							onDrop={(e) => handleDrop(e, index)}
							style={{
								cursor: 'pointer',
								opacity: draggedIndex === index ? 0.5 : 1,
							}}
						>
							{tab.title}
							{tabs.length > 1 && (
								<button
									className="forjeon-tab-remove"
									onClick={(e) => {
										e.stopPropagation();
										removeTab(index);
									}}
									style={{
										marginLeft: '8px',
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										color: '#cc1818',
									}}
								>
									×
								</button>
							)}
						</button>
					))}
				</div>

				{/* Tab Content */}
				<div className="forjeon-tabs-content">
					<div className="forjeon-tab-content-editor">
						<p className="forjeon-tab-info">
							{__('Editing content for:', 'forjeon')} <strong>{tabs[activeTab]?.title}</strong>
						</p>
						<RichText
							tagName="div"
							className="forjeon-tab-content"
							value={tabs[activeTab]?.content || ''}
							onChange={(content) => updateTabContent(activeTab, content)}
							placeholder={__('Add content for this tab...', 'forjeon')}
							multiline="p"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
