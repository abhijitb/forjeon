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

/**
 * Render tabs navigation HTML
 *
 * @param array $tabs Array of tab data.
 * @param int   $active_tab Currently active tab index.
 * @return string Navigation HTML.
 */
function render_tabs_navigation( $tabs, $active_tab ) {
	$nav_html = '<div class="forjeon-tabs-nav" role="tablist" aria-orientation="horizontal">';
	
	foreach ( $tabs as $index => $tab ) {
		$tab_id = sanitize_html_class( $tab['id'] ?? 'tab-' . $index );
		$is_active = $index === $active_tab;
		$title = esc_html( $tab['title'] ?? sprintf( __( 'Tab %d', 'forjeon' ), $index + 1 ) );
		
		$nav_html .= sprintf(
			'<button class="forjeon-tab-button %s" role="tab" id="%s" aria-controls="%s" aria-selected="%s" tabindex="%s" data-tab-index="%s">%s</button>',
			$is_active ? 'active' : '',
			esc_attr( $tab_id . '-button' ),
			esc_attr( $tab_id . '-panel' ),
			$is_active ? 'true' : 'false',
			$is_active ? '0' : '-1',
			esc_attr( $index ),
			$title
		);
	}
	
	$nav_html .= '</div>';
	return $nav_html;
}

/**
 * Render tab panel HTML
 *
 * @param array $tab Tab data.
 * @param int   $index Tab index.
 * @param bool  $is_active Whether tab is active.
 * @param bool  $enable_accordion Whether accordion is enabled.
 * @return string Panel HTML.
 */
function render_tab_panel( $tab, $index, $is_active, $enable_accordion ) {
	$tab_id = sanitize_html_class( $tab['id'] ?? 'tab-' . $index );
	$title = esc_html( $tab['title'] ?? sprintf( __( 'Tab %d', 'forjeon' ), $index + 1 ) );
	$content = $tab['content'] ?? '';
	
	$panel_html = sprintf(
		'<div class="forjeon-tab-panel %s" role="tabpanel" id="%s" aria-labelledby="%s" tabindex="0" %s>',
		$is_active ? 'active' : '',
		esc_attr( $tab_id . '-panel' ),
		esc_attr( $tab_id . '-button' ),
		$is_active ? '' : 'hidden'
	);
	
	// Add accordion header for mobile
	if ( $enable_accordion ) {
		$panel_html .= sprintf(
			'<button class="forjeon-accordion-header" aria-expanded="%s" aria-controls="%s" data-tab-index="%s">%s<span class="forjeon-accordion-icon" aria-hidden="true"></span></button>',
			$is_active ? 'true' : 'false',
			esc_attr( $tab_id . '-content' ),
			esc_attr( $index ),
			$title
		);
	}
	
	// Add tab content
	$panel_html .= sprintf( '<div class="forjeon-tab-content" id="%s">', esc_attr( $tab_id . '-content' ) );
	
	if ( ! empty( $content ) ) {
		$panel_html .= wp_kses_post( $content );
	} else {
		$panel_html .= '<p>' . esc_html__( 'Add content to this tab in the editor.', 'forjeon' ) . '</p>';
	}
	
	$panel_html .= '</div></div>';
	
	return $panel_html;
}

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

// Build HTML using string concatenation
$html = sprintf( '<div %s>', $wrapper_attributes );
$html .= render_tabs_navigation( $tabs, $active_tab );
$html .= '<div class="forjeon-tabs-content">';

foreach ( $tabs as $index => $tab ) {
	$is_active = $index === $active_tab;
	$html .= render_tab_panel( $tab, $index, $is_active, $enable_accordion );
}

$html .= '</div></div>';

return $html;
