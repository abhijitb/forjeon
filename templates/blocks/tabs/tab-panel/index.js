/**
 * Tab Panel Block - Individual tab content
 *
 * @package Forjeon
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

/**
 * Edit component for Tab Panel
 */
const Edit = ({ attributes, setAttributes, context }) => {
	const blockProps = useBlockProps({
		className: 'forjeon-tab-panel-editor',
	});

	return (
		<div {...blockProps}>
			<div className="forjeon-tab-panel-content">
				<InnerBlocks
					templateLock={false}
					placeholder={__('Add content for this tab...', 'forjeon')}
					template={[
						[
							'core/paragraph',
							{
								placeholder: __(
									'Start writing or add blocks for this tab content...',
									'forjeon'
								),
							},
						],
					]}
				/>
			</div>
		</div>
	);
};

/**
 * Save component for Tab Panel
 */
const Save = () => {
	const blockProps = useBlockProps.save({
		className: 'forjeon-tab-panel-content',
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
};

/**
 * Register the Tab Panel block
 */
registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
	icon: {
		src: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect
					x="3"
					y="6"
					width="18"
					height="12"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<path
					d="M7 10h10M7 14h6"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		),
	},
});
