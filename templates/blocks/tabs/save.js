/**
 * Tabs Block - Save Component
 *
 * @package Forjeon
 * @since 1.0.0
 */

import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	// For dynamic blocks, we return null as rendering is handled server-side
	// The attributes are saved and will be available in render.php
	return null;
};

export default Save;
