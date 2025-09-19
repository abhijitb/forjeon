<?php
/**
 * Main Forjeon Plugin Class
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon\Core;

/**
 * Main plugin class that handles initialization and core functionality
 */
class Plugin {

	/**
	 * Plugin instance
	 *
	 * @var Plugin
	 */
	private static $instance = null;

	/**
	 * Block extensions instance
	 *
	 * @var Block_Extensions
	 */
	private $block_extensions;

	/**
	 * Typography controls instance
	 *
	 * @var Typography_Controls
	 */
	private $typography_controls;

	/**
	 * CSS generator instance
	 *
	 * @var CSS_Generator
	 */
	private $css_generator;

	/**
	 * Tabs block instance
	 *
	 * @var Tabs_Block
	 */
	private $tabs_block;

	/**
	 * Get plugin instance
	 *
	 * @return Plugin
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	private function __construct() {
		// Initialize components
		$this->init_components();
	}

	/**
	 * Initialize plugin components
	 */
	private function init_components() {
		// Initialize block extensions
		$this->block_extensions = new \Forjeon\Legacy\Block_Extensions();

		// Initialize typography controls
		$this->typography_controls = new \Forjeon\Legacy\Typography_Controls();

		// Initialize CSS generator
		$this->css_generator = new \Forjeon\Utilities\CSS_Generator();

		// Initialize tabs block
		$this->tabs_block = new \Forjeon\Blocks\Content\Tabs_Block();
	}

	/**
	 * Initialize the plugin
	 */
	public function init() {
		// Hook into WordPress
		$this->setup_hooks();

		// Initialize components
		$this->block_extensions->init();
		$this->typography_controls->init();
		$this->css_generator->init();
		$this->tabs_block->init();

		// Load text domain for internationalization
		$this->load_textdomain();
	}

	/**
	 * Set up WordPress hooks
	 */
	private function setup_hooks() {
		// Admin hooks
		add_action( 'admin_init', array( $this, 'admin_init' ) );

		// Block editor hooks
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );

		// Plugin action links
		add_filter( 'plugin_action_links_' . FORJEON_PLUGIN_BASENAME, array( $this, 'plugin_action_links' ) );
	}

	/**
	 * Admin initialization
	 */
	public function admin_init() {
		// Add admin notices if needed
		if ( ! $this->check_requirements() ) {
			add_action( 'admin_notices', array( $this, 'requirements_notice' ) );
		}
	}

	/**
	 * Enqueue block editor assets
	 */
	public function enqueue_block_editor_assets() {
		// Get asset dependencies and version
		$asset_file = include( FORJEON_PLUGIN_DIR . 'build/index.asset.php' );

		// Enqueue the main JavaScript file
		wp_enqueue_script(
			'forjeon-block-editor',
			FORJEON_PLUGIN_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		// Localize script with data
		wp_localize_script(
			'forjeon-block-editor',
			'forjeonData',
			array(
				'version' => FORJEON_VERSION,
				'pluginUrl' => FORJEON_PLUGIN_URL,
				'nonce' => wp_create_nonce( 'forjeon_nonce' ),
				'typography' => array(
					'defaults' => $this->get_typography_defaults(),
					'presets' => $this->get_text_shadow_presets(),
				),
			)
		);

		// Enqueue block editor styles
		wp_enqueue_style(
			'forjeon-block-editor',
			FORJEON_PLUGIN_URL . 'build/style-index.css',
			array(),
			$asset_file['version']
		);
	}

	/**
	 * Check if plugin requirements are met
	 *
	 * @return bool
	 */
	private function check_requirements() {
		// Check if Gutenberg is available
		if ( ! function_exists( 'register_block_type' ) ) {
			return false;
		}

		// Check if block editor is available
		if ( ! function_exists( 'wp_enqueue_script' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Display requirements notice
	 */
	public function requirements_notice() {
		?>
		<div class="notice notice-error">
			<p>
				<?php esc_html_e( 'Forjeon requires Gutenberg block editor to function properly.', 'forjeon' ); ?>
			</p>
		</div>
		<?php
	}

	/**
	 * Get typography defaults
	 *
	 * @return array
	 */
	private function get_typography_defaults() {
		return array(
			'lineHeight' => array(
				'min' => 0.5,
				'max' => 3.0,
				'step' => 0.1,
				'default' => 1.5,
				'units' => array(
					array(
						'value' => '',
						'label' => 'Unitless',
					),
					array(
						'value' => 'em',
						'label' => 'em',
					),
					array(
						'value' => 'px',
						'label' => 'px',
					),
				),
			),
			'letterSpacing' => array(
				'min' => -0.1,
				'max' => 0.5,
				'step' => 0.01,
				'default' => 0,
				'units' => array(
					array(
						'value' => 'em',
						'label' => 'em',
					),
					array(
						'value' => 'px',
						'label' => 'px',
					),
				),
			),
			'textShadow' => array(
				'x' => array(
					'min' => -10,
					'max' => 10,
					'step' => 1,
					'default' => 0,
				),
				'y' => array(
					'min' => -10,
					'max' => 10,
					'step' => 1,
					'default' => 0,
				),
				'blur' => array(
					'min' => 0,
					'max' => 20,
					'step' => 1,
					'default' => 0,
				),
				'color' => '#000000',
			),
		);
	}

	/**
	 * Get text shadow presets
	 *
	 * @return array
	 */
	private function get_text_shadow_presets() {
		return array(
			'soft' => array(
				'label' => 'Soft',
				'value' => '0 2px 4px rgba(0, 0, 0, 0.1)',
			),
			'medium' => array(
				'label' => 'Medium',
				'value' => '0 4px 8px rgba(0, 0, 0, 0.15)',
			),
			'strong' => array(
				'label' => 'Strong',
				'value' => '0 8px 16px rgba(0, 0, 0, 0.2)',
			),
			'glow' => array(
				'label' => 'Glow',
				'value' => '0 0 20px rgba(0, 123, 170, 0.5)',
			),
		);
	}

	/**
	 * Check if frontend assets should be loaded
	 *
	 * @return bool
	 */
	private function should_load_frontend_assets() {
		// Check if we're in the main query
		if ( ! is_main_query() ) {
			return false;
		}

		// Check if we have blocks with typography controls
		global $post;
		if ( $post && has_blocks( $post ) ) {
			$blocks = parse_blocks( $post->post_content );
			return $this->has_typography_blocks( $blocks );
		}

		return false;
	}

	/**
	 * Check if content has blocks with typography controls
	 *
	 * @param array $blocks Array of blocks.
	 * @return bool
	 */
	private function has_typography_blocks( $blocks ) {
		foreach ( $blocks as $block ) {
			// Check if block has typography attributes
			if ( isset( $block['attrs']['lineHeight'] ) ||
				 isset( $block['attrs']['letterSpacing'] ) ||
				 isset( $block['attrs']['textShadow'] ) ) {
				return true;
			}

			// Check inner blocks
			if ( ! empty( $block['innerBlocks'] ) ) {
				if ( $this->has_typography_blocks( $block['innerBlocks'] ) ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Load plugin text domain
	 */
	private function load_textdomain() {
		load_plugin_textdomain(
			'forjeon',
			false,
			dirname( FORJEON_PLUGIN_BASENAME ) . '/languages'
		);
	}

	/**
	 * Add plugin action links
	 *
	 * @param array $links Plugin action links.
	 * @return array
	 */
	public function plugin_action_links( $links ) {
		$settings_link = sprintf(
			'<a href="%s">%s</a>',
			admin_url( 'options-general.php?page=forjeon' ),
			esc_html__( 'Settings', 'forjeon' )
		);

		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Get block extensions instance
	 *
	 * @return Block_Extensions
	 */
	public function get_block_extensions() {
		return $this->block_extensions;
	}

	/**
	 * Get typography controls instance
	 *
	 * @return Typography_Controls
	 */
	public function get_typography_controls() {
		return $this->typography_controls;
	}

	/**
	 * Get CSS generator instance
	 *
	 * @return CSS_Generator
	 */
	public function get_css_generator() {
		return $this->css_generator;
	}

	/**
	 * Get tabs block instance
	 *
	 * @return Tabs_Block
	 */
	public function get_tabs_block() {
		return $this->tabs_block;
	}
}
