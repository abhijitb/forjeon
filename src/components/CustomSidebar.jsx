import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { PanelBody } from '@wordpress/components';
import { AdvancedTypographyPanel } from './AdvancedTypographyPanel';

/**
 * Custom Sidebar Component that creates a dedicated sidebar
 * for typography controls in the WordPress editor
 */
export function CustomSidebar() {
	return (
		<>
			<PluginSidebarMoreMenuItem
				target="forjeon-toolbar"
				icon="admin-customizer"
			>
				{__('Forjeon Toolbar', 'forjeon')}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name="forjeon-toolbar"
				title={__('Forjeon Toolbar', 'forjeon')}
				className="forjeon-toolbar-sidebar"
				icon="admin-customizer"
			>
				<PanelBody
					title={__('Typography Controls', 'forjeon')}
					initialOpen={true}
				>
					<AdvancedTypographyPanel />
				</PanelBody>
			</PluginSidebar>
		</>
	);
}
