import { __ } from '@wordpress/i18n';
import { PluginSidebar } from '@wordpress/editor';
import { PanelBody } from '@wordpress/components';
import { AdvancedTypographyPanel } from './AdvancedTypographyPanel';

/**
 * Custom Sidebar Component that creates a dedicated sidebar
 * for typography controls in the WordPress editor
 */
export function CustomSidebar() {
	return (
		<PluginSidebar
			name="forjeon-typography-sidebar"
			title={__('Forjeon Typography', 'forjeon')}
			className="forjeon-typography-sidebar"
			icon="admin-customizer"
			isPinnable={true}
		>
			<PanelBody
				title={__('Typography Controls', 'forjeon')}
				initialOpen={true}
			>
				<AdvancedTypographyPanel />
			</PanelBody>
		</PluginSidebar>
	);
}
