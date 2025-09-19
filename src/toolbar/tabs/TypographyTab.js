import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { LineHeightControl } from '../controls/typography/LineHeightControl';
import { LetterSpacingControl } from '../controls/typography/LetterSpacingControl';
import { TextShadowControl } from '../controls/typography/TextShadowControl';

/**
 * Advanced Typography Panel Component
 */
export function AdvancedTypographyPanel() {
	const { selectedBlock, selectedBlockClientId } = useSelect((select) => {
		const { getSelectedBlock, getSelectedBlockClientId } =
			select(blockEditorStore);
		return {
			selectedBlock: getSelectedBlock(),
			selectedBlockClientId: getSelectedBlockClientId(),
		};
	}, []);

	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	// Check if the selected block supports typography controls
	const supportsTypography =
		selectedBlock && isTypographyBlock(selectedBlock.name);

	if (!supportsTypography) {
		return (
			<div
				style={{ padding: '16px', color: '#666', fontStyle: 'italic' }}
			>
				{__('Select a text block to customize typography', 'forjeon')}
			</div>
		);
	}

	const handleTypographyChange = (property, value) => {
		if (selectedBlockClientId) {
			updateBlockAttributes(selectedBlockClientId, {
				[property]: value,
			});
		}
	};

	return (
		<div
			className="forjeon-typography-panel"
			style={{
				margin: '16px 0',
			}}
		>
			<p
				style={{
					margin: '0 0 16px 0',
					fontSize: '13px',
					color: '#0073aa',
				}}
			>
				{__('Customize typography for:', 'forjeon')}{' '}
				{selectedBlock?.name.replace('core/', '')}
			</p>

			<LineHeightControl
				value={selectedBlock?.attributes?.lineHeight}
				onChange={(value) =>
					handleTypographyChange('lineHeight', value)
				}
			/>

			<LetterSpacingControl
				value={selectedBlock?.attributes?.letterSpacing}
				onChange={(value) =>
					handleTypographyChange('letterSpacing', value)
				}
			/>

			<TextShadowControl
				value={selectedBlock?.attributes?.textShadow}
				onChange={(value) =>
					handleTypographyChange('textShadow', value)
				}
			/>
		</div>
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
