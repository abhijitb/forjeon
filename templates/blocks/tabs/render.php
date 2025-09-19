<?php
/**
 * Tabs Block Server-side Render
 *
 * @package Forjeon
 * @since 1.0.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string  Rendered block HTML.
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Forjeon\Blocks\Content\Tabs_Block;

// Extract attributes
$tabs = $attributes['tabs'] ?? array();
$active_tab = $attributes['activeTab'] ?? 0;
$tab_style = $attributes['tabStyle'] ?? 'default';
$tab_alignment = $attributes['tabAlignment'] ?? 'left';
$enable_accordion = $attributes['enableAccordionOnMobile'] ?? true;
$mobile_breakpoint = $attributes['mobileBreakpoint'] ?? 768;

// Early return for empty tabs
if ( empty( $tabs ) ) {
	return '<div class="forjeon-tabs-debug">No tabs data found. Attributes: ' . wp_json_encode( $attributes ) . '</div>';
}

// Generate unique ID and classes
$tabs_id = 'forjeon-tabs-' . wp_unique_id();
$classes = array(
	'forjeon-tabs-container',
	'forjeon-tabs-' . $tab_style,
	'forjeon-tabs-align-' . $tab_alignment
);

$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => implode( ' ', $classes ),
	'id' => $tabs_id,
	'data-active-tab' => $active_tab,
	'data-tab-style' => $tab_style,
	'data-tab-alignment' => $tab_alignment,
	'data-enable-accordion' => $enable_accordion ? 'true' : 'false',
	'data-mobile-breakpoint' => $mobile_breakpoint
) );

// Build HTML using static methods from Tabs_Block class
$html = sprintf( '<div %s>', $wrapper_attributes );
$html .= Tabs_Block::render_tabs_navigation( $tabs, $active_tab );
$html .= '<div class="forjeon-tabs-content">';

foreach ( $tabs as $index => $tab ) {
	$is_active = $index === $active_tab;
	$html .= Tabs_Block::render_tab_panel( $tab, $index, $is_active, $enable_accordion );
}

$html .= '</div></div>';

return $html;
