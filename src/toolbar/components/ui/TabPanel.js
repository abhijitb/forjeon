/**
 * TabPanel Component for Forjeon Toolbar
 * 
 * @package Forjeon
 * @since 1.0.0
 */

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * TabPanel Component
 * Renders navigation tabs for the toolbar
 */
export function TabPanel({ tabs, activeTab, onTabChange, className }) {
	return (
		<div className={classnames('forjeon-tab-panel', className)}>
			<div className="forjeon-tab-list" role="tablist" aria-orientation="horizontal">
				{tabs.map((tab) => (
					<Button
						key={tab.name}
						variant={activeTab === tab.name ? 'primary' : 'tertiary'}
						onClick={() => !tab.disabled && onTabChange(tab.name)}
						disabled={tab.disabled}
						className={classnames('forjeon-tab-button', {
							'is-active': activeTab === tab.name,
							'is-disabled': tab.disabled,
						})}
						role="tab"
						aria-selected={activeTab === tab.name}
						aria-controls={`forjeon-tab-${tab.name}`}
						title={tab.disabled ? __('Coming soon', 'forjeon') : tab.title}
					>
						<span className="forjeon-tab-icon" aria-hidden="true">
							{tab.icon}
						</span>
						<span className="forjeon-tab-label">{tab.title}</span>
						{tab.disabled && (
							<span className="forjeon-tab-badge">
								{__('Soon', 'forjeon')}
							</span>
						)}
					</Button>
				))}
			</div>
		</div>
	);
}