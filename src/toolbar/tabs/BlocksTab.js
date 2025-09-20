/**
 * Blocks Tab Component (Phase 2)
 * 
 * @package Forjeon
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';

/**
 * Blocks Tab - Coming in Phase 2
 * Will include block library, custom blocks, patterns
 */
export function BlocksTab() {
	return (
		<div className="forjeon-blocks-tab">
			<div className="forjeon-tab-placeholder">
				<h3>{__('🧩 Block Library', 'forjeon')}</h3>
				<p>{__('Extended block library and patterns are coming in Phase 2!', 'forjeon')}</p>
				<ul>
					<li>{__('📦 Custom Block Collection (testimonials, pricing, etc.)', 'forjeon')}</li>
					<li>{__('🎨 Pre-designed Block Patterns', 'forjeon')}</li>
					<li>{__('🔧 Block Variations Manager', 'forjeon')}</li>
					<li>{__('📋 Custom Block Templates', 'forjeon')}</li>
					<li>{__('🎯 Block Style Presets', 'forjeon')}</li>
				</ul>
			</div>
		</div>
	);
}