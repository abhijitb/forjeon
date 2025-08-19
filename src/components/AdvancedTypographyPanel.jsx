import { __ } from '@wordpress/i18n';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import { LineHeightControl } from './LineHeightControl';
import { LetterSpacingControl } from './LetterSpacingControl';
import { TextShadowControl } from './ TextShadowControl';

/**
 * Advanced Typography Panel Component
 * Integrates with the block editor to provide typography controls
 */
export function AdvancedTypographyPanel() {
	const { selectedBlock, selectedBlockClientId } = useSelect((select) => {
		const { getSelectedBlock, getSelectedBlockClientId } = select(blockEditorStore);
		return {
			selectedBlock: getSelectedBlock(),
			selectedBlockClientId: getSelectedBlockClientId(),
		};
	}, []);

	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	// Check if the selected block supports typography controls
	const supportsTypography = selectedBlock && isTypographyBlock(selectedBlock.name);

	if (!supportsTypography) {
		return null;
	}

	const handleTypographyChange = (property, value) => {
		if (selectedBlockClientId) {
			updateBlockAttributes(selectedBlockClientId, {
				[property]: value,
			});
		}
	};

	return (
		<PluginDocumentSettingPanel
			name="forjeon-advanced-typography"
			title={__('Advanced Typography', 'forjeon')}
			className="forjeon-typography-panel"
		>
			<LineHeightControl
				value={selectedBlock?.attributes?.lineHeight}
				onChange={(value) => handleTypographyChange('lineHeight', value)}
			/>
			
			<LetterSpacingControl
				value={selectedBlock?.attributes?.letterSpacing}
				onChange={(value) => handleTypographyChange('letterSpacing', value)}
			/>
			
			<TextShadowControl
				value={selectedBlock?.attributes?.textShadow}
				onChange={(value) => handleTypographyChange('textShadow', value)}
			/>
		</PluginDocumentSettingPanel>
	);
}

/**
 * Check if a block supports typography controls
 *
 * @param {string} blockName Block name to check
 * @return {boolean} Whether the block supports typography
 */
function isTypographyBlock(blockName) {
	const typographyBlocks = [
		'core/paragraph',
		'core/heading',
		'core/list',
		'core/quote',
		'core/pullquote',
		'core/verse',
		'core/code',
		'core/preformatted',
	];

	return typographyBlocks.includes(blockName);
}
