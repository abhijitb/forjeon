/**
 * Forjeon - Advanced Typography Controls
 * Main entry point for block editor integration
 */

import { registerPlugin } from '@wordpress/plugins';
import { CustomSidebar } from './components/CustomSidebar';
import './style.scss';

// Register the custom sidebar plugin
registerPlugin('forjeon-typography-sidebar', {
	render: CustomSidebar,
	icon: 'admin-customizer'
});
