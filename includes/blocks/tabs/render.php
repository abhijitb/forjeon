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

$tabs = $attributes['tabs'] ?? array();
$active_tab = $attributes['activeTab'] ?? 0;
$tab_style = $attributes['tabStyle'] ?? 'default';
$tab_alignment = $attributes['tabAlignment'] ?? 'left';
$enable_accordion = $attributes['enableAccordionOnMobile'] ?? true;
$mobile_breakpoint = $attributes['mobileBreakpoint'] ?? 768;

// Generate unique ID for this tabs instance
$tabs_id = 'forjeon-tabs-' . wp_unique_id();

// Build class string
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

if ( empty( $tabs ) ) {
	return '<div class="forjeon-tabs-debug">No tabs data found. Attributes: ' . wp_json_encode( $attributes ) . '</div>';
}

ob_start();
?>
<div <?php echo $wrapper_attributes; ?>>
	<!-- Tab Navigation -->
	<div class="forjeon-tabs-nav" role="tablist" aria-orientation="horizontal">
		<?php foreach ( $tabs as $index => $tab ) : 
			$tab_id = sanitize_html_class( $tab['id'] ?? 'tab-' . $index );
			$is_active = $index === $active_tab;
		?>
			<button
				class="forjeon-tab-button <?php echo $is_active ? 'active' : ''; ?>"
				role="tab"
				id="<?php echo esc_attr( $tab_id . '-button' ); ?>"
				aria-controls="<?php echo esc_attr( $tab_id . '-panel' ); ?>"
				aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
				tabindex="<?php echo $is_active ? '0' : '-1'; ?>"
				data-tab-index="<?php echo esc_attr( $index ); ?>"
			>
				<?php echo esc_html( $tab['title'] ?? sprintf( __( 'Tab %d', 'forjeon' ), $index + 1 ) ); ?>
			</button>
		<?php endforeach; ?>
	</div>

	<!-- Tab Panels -->
	<div class="forjeon-tabs-content">
		<?php 
		foreach ( $tabs as $index => $tab ) : 
			$tab_id = sanitize_html_class( $tab['id'] ?? 'tab-' . $index );
			$is_active = $index === $active_tab;
		?>
			<div
				class="forjeon-tab-panel <?php echo $is_active ? 'active' : ''; ?>"
				role="tabpanel"
				id="<?php echo esc_attr( $tab_id . '-panel' ); ?>"
				aria-labelledby="<?php echo esc_attr( $tab_id . '-button' ); ?>"
				tabindex="0"
				<?php echo $is_active ? '' : 'hidden'; ?>
			>
				<?php if ( $enable_accordion ) : ?>
					<!-- Mobile accordion header -->
					<button
						class="forjeon-accordion-header"
						aria-expanded="<?php echo $is_active ? 'true' : 'false'; ?>"
						aria-controls="<?php echo esc_attr( $tab_id . '-content' ); ?>"
						data-tab-index="<?php echo esc_attr( $index ); ?>"
					>
						<?php echo esc_html( $tab['title'] ?? sprintf( __( 'Tab %d', 'forjeon' ), $index + 1 ) ); ?>
						<span class="forjeon-accordion-icon" aria-hidden="true"></span>
					</button>
				<?php endif; ?>
				
				<div 
					class="forjeon-tab-content"
					id="<?php echo esc_attr( $tab_id . '-content' ); ?>"
				>
					<?php 
					// Display the tab content from attributes
					$tab_content = $tab['content'] ?? '';
					if ( ! empty( $tab_content ) ) {
						echo wp_kses_post( $tab_content );
					} else {
						echo '<p>' . esc_html__( 'Add content to this tab in the editor.', 'forjeon' ) . '</p>';
					}
					?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</div>

<?php
return ob_get_clean();