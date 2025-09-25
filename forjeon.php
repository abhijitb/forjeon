<?php
/**
 * Plugin Name: Forjeon - Gutenberg Enhancement Plugin
 * Plugin URI: https://github.com/abhijitb/forjeon
 * Description: Enhance Gutenberg with advanced typography controls including line height, letter spacing, and text shadows. Crafted blocks, limitless design.
 * Version: 1.0.0
 * Author: Abhijit Bhatnagar
 * Author URI: https://github.com/abhijitb
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: forjeon
 * Domain Path: /languages
 * Requires at least: 6.5
 * Tested up to: 6.5
 * Requires PHP: 8.2
 * Network: false
 *
 * @package Forjeon
 * @version 1.0.0
 * @author Abhijit Bhatnagar
 * @license GPL v2 or later
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'FORJEON_VERSION', '1.0.0' );
define( 'FORJEON_PLUGIN_FILE', __FILE__ );
define( 'FORJEON_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'FORJEON_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'FORJEON_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Load Composer autoloader.
if ( file_exists( FORJEON_PLUGIN_DIR . 'vendor/autoload.php' ) ) {
	require_once FORJEON_PLUGIN_DIR . 'vendor/autoload.php';
}

// Initialize the plugin.
add_action( 'plugins_loaded', 'forjeon_init' );

/**
 * Initialize the Forjeon plugin
 */
function forjeon_init() {
	// Check WordPress version.
	if ( version_compare( get_bloginfo( 'version' ), '6.5', '<' ) ) {
		add_action( 'admin_notices', 'forjeon_wordpress_version_notice' );
		return;
	}

	// Check PHP version.
	if ( version_compare( PHP_VERSION, '8.2', '<' ) ) {
		add_action( 'admin_notices', 'forjeon_php_version_notice' );
		return;
	}

	// Initialize the main plugin class using singleton pattern.
	$forjeon = \Forjeon\Core\Plugin::get_instance();
	$forjeon->init();
}

/**
 * Display WordPress version requirement notice
 */
function forjeon_wordpress_version_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<?php
			printf(
				/* translators: %s: WordPress version */
				esc_html__( 'Forjeon requires WordPress version %s or higher. Please update WordPress to use this plugin.', 'forjeon' ),
				'6.5'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Display PHP version requirement notice
 */
function forjeon_php_version_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<?php
			printf(
				/* translators: %s: PHP version */
				esc_html__( 'Forjeon requires PHP version %s or higher. Please contact your hosting provider to upgrade PHP.', 'forjeon' ),
				'8.2'
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Plugin activation hook
 */
register_activation_hook( __FILE__, 'forjeon_activate' );

/**
 * Plugin activation hook.
 */
function forjeon_activate() {
	// Set default options.
	add_option( 'forjeon_version', FORJEON_VERSION );

	// Flush rewrite rules.
	flush_rewrite_rules();
}

/**
 * Plugin deactivation hook
 */
register_deactivation_hook( __FILE__, 'forjeon_deactivate' );

/**
 * Plugin deactivation hook.
 */
function forjeon_deactivate() {
	// Clean up if needed.
	flush_rewrite_rules();
}
