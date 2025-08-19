/**
 * Forjeon - Advanced Typography Controls
 * Main entry point for block editor integration
 */

import { registerPlugin } from '@wordpress/plugins';
import { AdvancedTypographyPanel } from './components/AdvancedTypographyPanel';

// Register the advanced typography panel plugin
registerPlugin('forjeon-advanced-typography', {
	render: AdvancedTypographyPanel,
	icon: 'editor-textcolor',
});
