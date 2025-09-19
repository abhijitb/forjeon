/**
 * Tabs Block - Editor Interface
 *
 * @package Forjeon
 * @since 1.0.0
 */

import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './editor.scss';

// Import the tab panel block
import './tab-panel/index.js';

/**
 * Register the Tabs block
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
				<path
					d="M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<path d="M3 8h18" stroke="currentColor" strokeWidth="2" />
				<path d="M8 4v4" stroke="currentColor" strokeWidth="2" />
				<path d="M16 4v4" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
	},
	example: {
		attributes: {
			tabs: [
				{
					title: __('Design', 'forjeon'),
					id: 'design-tab',
					isActive: true,
				},
				{
					title: __('Development', 'forjeon'),
					id: 'development-tab',
					isActive: false,
				},
				{
					title: __('Marketing', 'forjeon'),
					id: 'marketing-tab',
					isActive: false,
				},
			],
		},
		innerBlocks: [
			{
				name: 'forjeon/tab-panel',
				attributes: {
					content: __(
						'Beautiful design is the foundation of great user experience.',
						'forjeon'
					),
				},
			},
			{
				name: 'forjeon/tab-panel',
				attributes: {
					content: __(
						'Clean, efficient code brings designs to life.',
						'forjeon'
					),
				},
			},
			{
				name: 'forjeon/tab-panel',
				attributes: {
					content: __(
						'Strategic marketing connects products with the right audience.',
						'forjeon'
					),
				},
			},
		],
	},
});
