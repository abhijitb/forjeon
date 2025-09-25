<?php
/**
 * Tabs Block Class
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon\Blocks\Content;

/**
 * Handles the Tabs block registration and functionality
 */
class Tabs_Block {

	/**
	 * Initialize the tabs block
	 */
	public function init() {
		// Register the block.
		add_action( 'init', array( $this, 'register_block' ) );

		// Add block category.
		add_filter( 'block_categories_all', array( $this, 'add_block_category' ), 10, 2 );

		// Enqueue frontend assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	/**
	 * Register the tabs block
	 */
	public function register_block() {
		// Register editor script.
		$editor_asset_file = FORJEON_PLUGIN_DIR . 'build/blocks/tabs/index.asset.php';
		$editor_asset_data = file_exists( $editor_asset_file ) ? include $editor_asset_file : array(
			'dependencies' => array(),
			'version'      => FORJEON_VERSION,
		);

		wp_register_script(
			'forjeon-tabs-editor',
			FORJEON_PLUGIN_URL . 'build/blocks/tabs/index.js',
			$editor_asset_data['dependencies'],
			$editor_asset_data['version'],
			false
		);

		wp_register_style(
			'forjeon-tabs-editor',
			FORJEON_PLUGIN_URL . 'build/blocks/tabs/index.css',
			array(),
			$editor_asset_data['version']
		);

		wp_register_style(
			'forjeon-tabs-frontend',
			FORJEON_PLUGIN_URL . 'build/index.css',
			array(),
			$editor_asset_data['version']
		);

		// Register the block using block.json.
		register_block_type(
			FORJEON_PLUGIN_DIR . 'src/blocks/content/tabs/block.json',
			array(
				'render_callback' => array( $this, 'render_block' ),
			)
		);
	}

	/**
	 * Add Forjeon block category
	 *
	 * @param array $categories Array of block categories.
	 * @return array Modified categories array.
	 */
	public function add_block_category( $categories ) {
		// Check if our category already exists.
		foreach ( $categories as $category ) {
			if ( 'forjeon' === $category['slug'] ) {
				return $categories;
			}
		}

		// Add our category at the beginning.
		return array_merge(
			array(
				array(
					'slug'  => 'forjeon',
					'title' => __( 'Forjeon Blocks', 'forjeon' ),
					'icon'  => 'admin-customizer',
				),
			),
			$categories
		);
	}

	/**
	 * Render the tabs block
	 *
	 * @return string Rendered block HTML.
	 */
	public function render_block() {
		// Include the render template.
		return include FORJEON_PLUGIN_DIR . 'templates/blocks/tabs/render.php';
	}

	/**
	 * Enqueue frontend assets
	 */
	public function enqueue_frontend_assets() {
		// Only enqueue if we have tabs blocks on the page.
		if ( ! $this->has_tabs_blocks() ) {
			return;
		}

		// Get frontend asset file info.
		$frontend_asset_file = FORJEON_PLUGIN_DIR . 'build/tabs-frontend.asset.php';
		$frontend_asset_data = file_exists( $frontend_asset_file ) ? include $frontend_asset_file : array(
			'dependencies' => array(),
			'version'      => FORJEON_VERSION,
		);

		// Enqueue the frontend JavaScript.
		wp_enqueue_script(
			'forjeon-tabs-frontend',
			FORJEON_PLUGIN_URL . 'build/tabs-frontend.js',
			$frontend_asset_data['dependencies'],
			$frontend_asset_data['version'],
			true
		);

		// Enqueue the frontend styles (included in main styles).
		wp_enqueue_style(
			'forjeon-tabs-frontend',
			FORJEON_PLUGIN_URL . 'build/index.css',
			array(),
			$frontend_asset_data['version']
		);

		// Localize script with settings.
		wp_localize_script(
			'forjeon-tabs-frontend',
			'forjeonTabsData',
			array(
				'breakpoint'               => 768,
				'animationDuration'        => 300,
				'enableKeyboardNavigation' => true,
				'enableSwipeOnMobile'      => true,
			)
		);
	}

	/**
	 * Check if the current page has tabs blocks
	 *
	 * @return bool
	 */
	private function has_tabs_blocks() {
		// Check if we're in the main query.
		if ( ! is_main_query() || is_admin() ) {
			return false;
		}

		global $post;
		if ( ! $post || ! has_blocks( $post ) ) {
			return false;
		}

		// Parse blocks and check for tabs.
		$blocks = parse_blocks( $post->post_content );
		return $this->has_tabs_in_blocks( $blocks );
	}

	/**
	 * Recursively check if blocks contain tabs
	 *
	 * @param array $blocks Array of blocks to check.
	 * @return bool
	 */
	private function has_tabs_in_blocks( $blocks ) {
		foreach ( $blocks as $block ) {
			// Check if this is a tabs block.
			if ( 'forjeon/tabs' === $block['blockName'] ) {
				return true;
			}

			// Check inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				if ( $this->has_tabs_in_blocks( $block['innerBlocks'] ) ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Get default tab data
	 *
	 * @return array
	 */
	public function get_default_tabs() {
		return array(
			array(
				'title'    => __( 'Tab 1', 'forjeon' ),
				'id'       => 'tab-1',
				'isActive' => true,
			),
			array(
				'title'    => __( 'Tab 2', 'forjeon' ),
				'id'       => 'tab-2',
				'isActive' => false,
			),
			array(
				'title'    => __( 'Tab 3', 'forjeon' ),
				'id'       => 'tab-3',
				'isActive' => false,
			),
		);
	}

	/**
	 * Sanitize tab data
	 *
	 * @param array $tabs Tabs data to sanitize.
	 * @return array
	 */
	public function sanitize_tabs( $tabs ) {
		if ( ! is_array( $tabs ) ) {
			return $this->get_default_tabs();
		}

		$sanitized = array();
		foreach ( $tabs as $index => $tab ) {
			$sanitized[ $index ] = array(
				// translators: %d is the tab index.
				'title'    => sanitize_text_field( $tab['title'] ?? sprintf( __( 'Tab %d', 'forjeon' ), $index + 1 ) ),
				'id'       => sanitize_html_class( $tab['id'] ?? 'tab-' . ( $index + 1 ) ),
				'isActive' => (bool) ( $tab['isActive'] ?? false ),
			);
		}

		return ! empty( $sanitized ) ? $sanitized : $this->get_default_tabs();
	}

	/**
	 * Render tabs navigation HTML
	 *
	 * @param array $tabs Array of tab data.
	 * @param int   $active_tab Currently active tab index.
	 * @return string Navigation HTML.
	 */
	public static function render_tabs_navigation( $tabs, $active_tab ) {
		$nav_html = '<div class="forjeon-tabs-nav" role="tablist" aria-orientation="horizontal">';

		foreach ( $tabs as $index => $tab ) {
			$tab_id    = sanitize_html_class( $tab['id'] ?? 'tab-' . $index );
			$is_active = $index === $active_tab;
			// translators: %d is the tab index.
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
	public static function render_tab_panel( $tab, $index, $is_active, $enable_accordion ) {
		$tab_id = sanitize_html_class( $tab['id'] ?? 'tab-' . $index );
		// translators: %d is the tab index.
		$title   = esc_html( $tab['title'] ?? sprintf( __( 'Tab %d', 'forjeon' ), $index + 1 ) );
		$content = $tab['content'] ?? '';

		$panel_html = sprintf(
			'<div class="forjeon-tab-panel %s" role="tabpanel" id="%s" aria-labelledby="%s" tabindex="0" %s>',
			$is_active ? 'active' : '',
			esc_attr( $tab_id . '-panel' ),
			esc_attr( $tab_id . '-button' ),
			$is_active ? '' : 'hidden'
		);

		// Add accordion header for mobile.
		if ( $enable_accordion ) {
			$panel_html .= sprintf(
				'<button class="forjeon-accordion-header" aria-expanded="%s" aria-controls="%s" data-tab-index="%s">%s<span class="forjeon-accordion-icon" aria-hidden="true"></span></button>',
				$is_active ? 'true' : 'false',
				esc_attr( $tab_id . '-content' ),
				esc_attr( $index ),
				$title
			);
		}

		// Add tab content.
		$panel_html .= sprintf( '<div class="forjeon-tab-content" id="%s">', esc_attr( $tab_id . '-content' ) );

		if ( ! empty( $content ) ) {
			$panel_html .= wp_kses_post( $content );
		} else {
			$panel_html .= '<p>' . esc_html__( 'Add content to this tab in the editor.', 'forjeon' ) . '</p>';
		}

		$panel_html .= '</div></div>';

		return $panel_html;
	}
}
