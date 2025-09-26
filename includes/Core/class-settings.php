<?php
/**
 * Forjeon Settings Manager
 * Handles plugin settings and configuration
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon\Core;

/**
 * Settings Manager Class
 *
 * Handles all plugin settings, user preferences, and configuration management.
 * Provides methods for registering settings, rendering admin pages, and managing
 * user-specific preferences for the Forjeon plugin.
 *
 * @since 1.0.0
 */
class Settings {

	/**
	 * Settings option name.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'forjeon_settings';

	/**
	 * User preferences option name.
	 *
	 * @var string
	 */
	const USER_PREFERENCES_NAME = 'forjeon_user_preferences';

	/**
	 * Default settings configuration.
	 *
	 * @var array
	 */
	private array $default_settings = array(
		'toolbar_enabled'           => true,
		'toolbar_position'          => 'floating',
		'toolbar_default_tab'       => 'typography',
		'header_button_enabled'     => true,
		'keyboard_shortcuts'        => true,
		'auto_save_preferences'     => true,
		'performance_mode'          => false,
		'debug_mode'                => false,
		'css_output_optimization'   => true,
		'load_frontend_assets'      => true,
		'enable_toolbar_animations' => true,
		'feature_flags'             => array(
			'typography_tab' => true,
			'design_tab'     => true,
			'layout_tab'     => false,
			'effects_tab'    => false,
			'blocks_tab'     => false,
			'advanced_tab'   => false,
		),
		'user_roles_access'         => array(
			'administrator' => true,
			'editor'        => true,
			'author'        => false,
			'contributor'   => false,
			'subscriber'    => false,
		),
	);

	/**
	 * Default user preferences configuration.
	 *
	 * @var array
	 */
	private array $default_user_preferences = array(
		'toolbar_position' => array(
			'x' => 100,
			'y' => 100,
		),
		'toolbar_visible'  => false,
		'active_tab'       => 'typography',
		'minimized'        => false,
		'docked'           => false,
	);

	/**
	 * Initialize settings
	 */
	public function init(): void {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'wp_ajax_forjeon_save_user_preferences', array( $this, 'save_user_preferences' ) );
		add_action( 'wp_ajax_forjeon_get_user_preferences', array( $this, 'get_user_preferences' ) );
	}

	/**
	 * Add admin menu page
	 */
	public function add_admin_menu(): void {
		add_menu_page(
			__( 'Forjeon Settings', 'forjeon' ),           // Page title.
			__( 'Forjeon', 'forjeon' ),                    // Menu title.
			'manage_options',                             // Capability.
			'forjeon-settings',                          // Menu slug.
			array( $this, 'render_settings_page' ),             // Callback function.
			'data:image/svg+xml;base64,' . base64_encode( '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L19 7L17.74 10.74L23 12L17.74 13.26L19 17L13.09 15.74L12 22L10.91 15.74L5 17L6.26 13.26L1 12L6.26 10.74L5 7L10.91 8.26L12 2Z"/></svg>' ), // Icon.
			30                                           // Position (after Comments).
		);

		// Add submenu items for future expansion.
		add_submenu_page(
			'forjeon-settings',
			__( 'Forjeon Settings', 'forjeon' ),
			__( 'Settings', 'forjeon' ),
			'manage_options',
			'forjeon-settings',
			array( $this, 'render_settings_page' )
		);

		// Add getting started submenu for future use.
		add_submenu_page(
			'forjeon-settings',
			__( 'Getting Started', 'forjeon' ),
			__( 'Getting Started', 'forjeon' ),
			'manage_options',
			'forjeon-getting-started',
			array( $this, 'render_getting_started_page' )
		);
	}

	/**
	 * Register settings
	 */
	public function register_settings(): void {
		register_setting(
			'forjeon_settings_group',
			self::OPTION_NAME,
			array(
				'type'              => 'array',
				'default'           => $this->default_settings,
				'sanitize_callback' => array( $this, 'sanitize_settings' ),
			)
		);

		// General Settings Section.
		add_settings_section(
			'forjeon_general_section',
			__( 'General Settings', 'forjeon' ),
			array( $this, 'render_general_section' ),
			'forjeon-settings'
		);

		// Toolbar Settings Section.
		add_settings_section(
			'forjeon_toolbar_section',
			__( 'Toolbar Settings', 'forjeon' ),
			array( $this, 'render_toolbar_section' ),
			'forjeon-settings'
		);

		// Feature Flags Section.
		add_settings_section(
			'forjeon_features_section',
			__( 'Feature Settings', 'forjeon' ),
			array( $this, 'render_features_section' ),
			'forjeon-settings'
		);

		// Advanced Settings Section.
		add_settings_section(
			'forjeon_advanced_section',
			__( 'Advanced Settings', 'forjeon' ),
			array( $this, 'render_advanced_section' ),
			'forjeon-settings'
		);

		// Add individual settings fields.
		$this->add_settings_fields();
	}

	/**
	 * Add settings fields
	 */
	private function add_settings_fields(): void {
		// General settings.
		add_settings_field(
			'toolbar_enabled',
			__( 'Enable Toolbar', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_general_section',
			array(
				'field'       => 'toolbar_enabled',
				'description' => __( 'Enable the Forjeon toolbar in the block editor.', 'forjeon' ),
			)
		);

		add_settings_field(
			'header_button_enabled',
			__( 'Enable Header Button', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_general_section',
			array(
				'field'       => 'header_button_enabled',
				'description' => __( 'Show the Forjeon button in the editor header.', 'forjeon' ),
			)
		);

		add_settings_field(
			'keyboard_shortcuts',
			__( 'Enable Keyboard Shortcuts', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_general_section',
			array(
				'field'       => 'keyboard_shortcuts',
				'description' => __( 'Enable keyboard shortcuts (Alt+F to toggle toolbar).', 'forjeon' ),
			)
		);

		// Toolbar settings.
		add_settings_field(
			'toolbar_position',
			__( 'Default Toolbar Position', 'forjeon' ),
			array( $this, 'render_select_field' ),
			'forjeon-settings',
			'forjeon_toolbar_section',
			array(
				'field'       => 'toolbar_position',
				'options'     => array(
					'floating' => __( 'Floating', 'forjeon' ),
					'docked'   => __( 'Docked to Right', 'forjeon' ),
				),
				'description' => __( 'Default position for the toolbar when first opened.', 'forjeon' ),
			)
		);

		add_settings_field(
			'toolbar_default_tab',
			__( 'Default Active Tab', 'forjeon' ),
			array( $this, 'render_select_field' ),
			'forjeon-settings',
			'forjeon_toolbar_section',
			array(
				'field'       => 'toolbar_default_tab',
				'options'     => array(
					'typography' => __( 'Typography', 'forjeon' ),
					'design'     => __( 'Design', 'forjeon' ),
					'layout'     => __( 'Layout', 'forjeon' ),
					'effects'    => __( 'Effects', 'forjeon' ),
					'blocks'     => __( 'Blocks', 'forjeon' ),
					'advanced'   => __( 'Advanced', 'forjeon' ),
				),
				'description' => __( 'Which tab should be active when toolbar opens.', 'forjeon' ),
			)
		);

		add_settings_field(
			'auto_save_preferences',
			__( 'Auto-save User Preferences', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_toolbar_section',
			array(
				'field'       => 'auto_save_preferences',
				'description' => __( 'Automatically save toolbar position and state for each user.', 'forjeon' ),
			)
		);

		// Advanced settings.
		add_settings_field(
			'performance_mode',
			__( 'Performance Mode', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_advanced_section',
			array(
				'field'       => 'performance_mode',
				'description' => __( 'Optimize for performance by reducing animations and effects.', 'forjeon' ),
			)
		);

		add_settings_field(
			'debug_mode',
			__( 'Debug Mode', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_advanced_section',
			array(
				'field'       => 'debug_mode',
				'description' => __( 'Enable debug logging for troubleshooting.', 'forjeon' ),
			)
		);

		add_settings_field(
			'css_output_optimization',
			__( 'CSS Output Optimization', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_advanced_section',
			array(
				'field'       => 'css_output_optimization',
				'description' => __( 'Optimize CSS output by minifying and removing unused styles.', 'forjeon' ),
			)
		);

		add_settings_field(
			'load_frontend_assets',
			__( 'Load Frontend Assets', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_advanced_section',
			array(
				'field'       => 'load_frontend_assets',
				'description' => __( 'Load Forjeon styles and scripts on the frontend when needed.', 'forjeon' ),
			)
		);

		add_settings_field(
			'enable_toolbar_animations',
			__( 'Enable Toolbar Animations', 'forjeon' ),
			array( $this, 'render_checkbox_field' ),
			'forjeon-settings',
			'forjeon_advanced_section',
			array(
				'field'       => 'enable_toolbar_animations',
				'description' => __( 'Enable animations and transitions in the toolbar interface.', 'forjeon' ),
			)
		);

		// Feature flags.
		$features = array(
			'typography_tab' => __( 'Typography Tab', 'forjeon' ),
			'design_tab'     => __( 'Design Tab', 'forjeon' ),
			'layout_tab'     => __( 'Layout Tab (Coming Soon)', 'forjeon' ),
			'effects_tab'    => __( 'Effects Tab (Coming Soon)', 'forjeon' ),
			'blocks_tab'     => __( 'Blocks Tab (Coming Soon)', 'forjeon' ),
			'advanced_tab'   => __( 'Advanced Tab (Coming Soon)', 'forjeon' ),
		);

		$enabled_features = array( 'typography_tab', 'design_tab' );

		foreach ( $features as $feature_key => $feature_label ) {
			add_settings_field(
				"feature_flags_{$feature_key}",
				$feature_label,
				array( $this, 'render_feature_flag_field' ),
				'forjeon-settings',
				'forjeon_features_section',
				array(
					'field'       => $feature_key,
					'description' => $this->get_feature_description( $feature_key ),
					'disabled'    => ! in_array( $feature_key, $enabled_features ),
				)
			);
		}
	}

	/**
	 * Render settings page
	 */
	public function render_settings_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$current_tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : 'general';
		$tabs        = array(
			'general'  => array(
				'label' => __( 'General', 'forjeon' ),
				'icon'  => '⚙️',
			),
			'toolbar'  => array(
				'label' => __( 'Toolbar', 'forjeon' ),
				'icon'  => '🎨',
			),
			'features' => array(
				'label' => __( 'Features', 'forjeon' ),
				'icon'  => '🚀',
			),
			'advanced' => array(
				'label' => __( 'Advanced', 'forjeon' ),
				'icon'  => '🔧',
			),
		);

		// Display settings errors (WordPress will automatically show success message).
		settings_errors( 'forjeon_messages' );
		?>
		<div class="wrap forjeon-settings-wrap">
			<h1 class="forjeon-settings-title">
				<span class="forjeon-logo">🎨</span>
				<?php echo esc_html( get_admin_page_title() ); ?>
			</h1>
			
			<div class="forjeon-settings-header">
				<div class="header-content">
					<p><?php esc_html_e( 'Configure Forjeon to customize your block editor enhancement experience.', 'forjeon' ); ?></p>
				</div>
				<div class="header-help">
					<div class="help-item">
						<strong><?php esc_html_e( 'Keyboard Shortcuts:', 'forjeon' ); ?></strong>
						<code>Alt + F</code> <?php esc_html_e( 'Toggle toolbar', 'forjeon' ); ?> • 
						<code>Escape</code> <?php esc_html_e( 'Close toolbar', 'forjeon' ); ?>
					</div>
					<div class="help-item">
						<strong><?php esc_html_e( 'Status:', 'forjeon' ); ?></strong>
						<span class="status-active"><?php esc_html_e( 'Active & Running', 'forjeon' ); ?></span>
					</div>
				</div>
			</div>
			
			<!-- Tab Navigation with Save Button -->
			<div class="forjeon-tab-wrapper">
				<nav class="forjeon-tab-nav">
					<?php foreach ( $tabs as $tab_key => $tab_data ) : ?>
						<a href="<?php echo esc_url( add_query_arg( 'tab', $tab_key ) ); ?>" 
							class="forjeon-tab <?php echo $current_tab === $tab_key ? 'active' : ''; ?>">
							<span class="tab-icon"><?php echo esc_attr( $tab_data['icon'] ); ?></span>
							<span class="tab-label"><?php echo esc_html( $tab_data['label'] ); ?></span>
						</a>
					<?php endforeach; ?>
				</nav>
				<div class="forjeon-save-button-wrapper">
					<?php submit_button( __( 'Save Settings', 'forjeon' ), 'primary', 'submit', false, array( 'form' => 'forjeon-settings-form' ) ); ?>
				</div>
			</div>
			
			<!-- Tab Content -->
			<div class="forjeon-tab-content">
				<form id="forjeon-settings-form" action="options.php" method="post">
					<?php
					settings_fields( 'forjeon_settings_group' );

					// Add hidden field to ensure form submission always has data.
					printf( '<input type="hidden" name="%s[_form_submitted]" value="1" />', esc_attr( self::OPTION_NAME ) );

					// Render different sections based on active tab.
					switch ( $current_tab ) {
						case 'general':
							$this->render_tab_content(
								'general',
								array(
									'forjeon_general_section',
								)
							);
							break;
						case 'toolbar':
							$this->render_tab_content(
								'toolbar',
								array(
									'forjeon_toolbar_section',
								)
							);
							break;
						case 'features':
							$this->render_tab_content(
								'features',
								array(
									'forjeon_features_section',
								)
							);
							break;
						case 'advanced':
							$this->render_tab_content(
								'advanced',
								array(
									'forjeon_advanced_section',
								)
							);
							break;
					}
					?>
				</form>
			</div>
			
		</div>
		
		<style>
		.forjeon-settings-wrap {
			max-width: 1200px;
		}
		
		.forjeon-settings-title {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 20px;
			font-size: 24px;
			font-weight: 600;
		}
		
		.forjeon-logo {
			font-size: 32px;
		}
		
		.forjeon-version {
			background: #0073aa;
			color: white;
			padding: 4px 8px;
			border-radius: 12px;
			font-size: 12px;
			font-weight: 500;
		}
		
		.forjeon-settings-header {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			padding: 24px;
			margin: 0 0 24px 0;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 32px;
			align-items: center;
		}
		
		.header-content p {
			margin: 0;
			font-size: 16px;
			opacity: 0.95;
		}
		
		.header-help {
			display: flex;
			flex-direction: column;
			gap: 8px;
			font-size: 14px;
		}
		
		.help-item {
			opacity: 0.95;
		}
		
		.help-item code {
			background: rgba(255,255,255,0.2);
			color: white;
			padding: 2px 6px;
			border-radius: 3px;
			font-family: monospace;
			font-size: 12px;
		}
		
		.status-active {
			color: #46b450;
			font-weight: 600;
			background: rgba(255,255,255,0.9);
			padding: 2px 8px;
			border-radius: 12px;
			font-size: 12px;
		}
		
		.forjeon-tab-wrapper {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			background: #f1f1f1;
			border-radius: 8px 8px 0 0;
			border-bottom: 1px solid #ddd;
		}
		
		.forjeon-tab-nav {
			display: flex;
			gap: 0;
		}
		
		.forjeon-save-button-wrapper {
			padding: 8px 16px;
		}
		
		.forjeon-save-button-wrapper .button-primary {
			height: 36px;
			padding: 0 16px;
			font-weight: 600;
			border-radius: 6px;
			border: none;
			background: #0073aa;
			box-shadow: 0 2px 4px rgba(0,115,170,0.3);
			transition: all 0.2s ease;
		}
		
		.forjeon-save-button-wrapper .button-primary:hover {
			background: #005a87;
			transform: translateY(-1px);
			box-shadow: 0 4px 8px rgba(0,115,170,0.4);
		}
		
		.forjeon-tab {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 16px 24px;
			text-decoration: none;
			color: #666;
			border-bottom: 3px solid transparent;
			transition: all 0.2s ease;
			font-weight: 500;
		}
		
		.forjeon-tab:hover {
			background: #e8e8e8;
			color: #333;
		}
		
		.forjeon-tab.active {
			background: white;
			color: #0073aa;
			border-bottom-color: #0073aa;
		}
		
		.tab-icon {
			font-size: 16px;
		}
		
		.forjeon-tab-content {
			background: white;
			padding: 32px;
			border-radius: 0 0 8px 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		
		
		/* Settings Field Styling */
		.forjeon-section-title {
			color: #333;
			font-size: 18px;
			margin: 0 0 16px 0;
			padding-bottom: 8px;
			border-bottom: 2px solid #0073aa;
		}
		
		.form-table th {
			font-weight: 600;
			color: #333;
			width: 200px;
		}
		
		.form-table td {
			padding-left: 20px;
		}
		
		.form-table td input[type="checkbox"] {
			margin: 0 8px 0 0;
			vertical-align: middle;
		}
		
		.form-table td label {
			display: flex;
			align-items: center;
			gap: 8px;
			cursor: pointer;
			line-height: 1.4;
		}
		
		.form-table select {
			min-width: 200px;
		}
		
		.description {
			color: #666;
			font-style: italic;
			margin-top: 4px;
			line-height: 1.4;
		}
		
		@media (max-width: 782px) {
			.forjeon-tab-content {
				padding: 20px;
			}
			
			.forjeon-tab {
				padding: 12px 16px;
			}
			
			.forjeon-settings-title {
				flex-direction: column;
				align-items: flex-start;
				gap: 8px;
			}
			
			.forjeon-settings-header {
				grid-template-columns: 1fr;
				gap: 16px;
				text-align: center;
			}
			
			.header-help {
				align-items: center;
			}
			
			.forjeon-tab-wrapper {
				flex-direction: column;
				align-items: stretch;
			}
			
			.forjeon-save-button-wrapper {
				order: -1;
				padding: 12px 16px;
				text-align: center;
				background: #e8e8e8;
				border-bottom: 1px solid #ddd;
			}
		}
		</style>
		<?php
	}

	/**
	 * Render getting started page (placeholder for future implementation)
	 */
	public function render_getting_started_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap forjeon-settings-wrap">
			<h1 class="forjeon-settings-title">
				<span class="forjeon-logo">🎨</span>
				<?php esc_html_e( 'Getting Started with Forjeon', 'forjeon' ); ?>
			</h1>
			
			<div class="forjeon-settings-header">
				<div class="header-content">
					<p><?php esc_html_e( 'Learn how to use Forjeon to enhance your block editor experience.', 'forjeon' ); ?></p>
				</div>
			</div>
			
			<div class="forjeon-tab-content">
				<div style="text-align: center; padding: 60px 20px;">
					<h2><?php esc_html_e( 'Coming Soon!', 'forjeon' ); ?></h2>
					<p><?php esc_html_e( 'This section will contain helpful guides and tutorials to get you started with Forjeon.', 'forjeon' ); ?></p>
					<p>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=forjeon-settings' ) ); ?>" class="button button-primary">
							<?php esc_html_e( 'Go to Settings', 'forjeon' ); ?>
						</a>
					</p>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render tab content with sections.
	 *
	 * @param string $tab_name The name of the tab being rendered.
	 * @param array  $sections Array of section IDs to render for this tab.
	 */
	private function render_tab_content( string $tab_name, array $sections ): void {
		foreach ( $sections as $section ) {
			$this->do_settings_sections_for( $section, 'forjeon-settings' );
		}
	}

	/**
	 * Helper function to render specific sections.
	 *
	 * @param string $section_id The ID of the section to render.
	 * @param string $page       The page slug where the section belongs.
	 */
	private function do_settings_sections_for( string $section_id, string $page ): void {
		global $wp_settings_sections, $wp_settings_fields;

		if ( ! isset( $wp_settings_sections[ $page ][ $section_id ] ) ) {
			return;
		}

		$section = $wp_settings_sections[ $page ][ $section_id ];

		if ( $section['title'] ) {
			echo "<h2 class='forjeon-section-title'>" . esc_html( $section['title'] ) . "</h2>\n";
		}

		if ( $section['callback'] ) {
			call_user_func( $section['callback'], $section );
		}

		if ( ! isset( $wp_settings_fields[ $page ][ $section_id ] ) ) {
			return;
		}

		echo '<table class="form-table" role="presentation">';
		do_settings_fields( $page, $section_id );
		echo '</table>';
	}

	/**
	 * Render section descriptions
	 */
	public function render_general_section(): void {
		echo '<p>' . esc_html__( 'General plugin settings that affect the overall behavior.', 'forjeon' ) . '</p>';
	}

	/**
	 * Render toolbar section description.
	 */
	public function render_toolbar_section(): void {
		echo '<p>' . esc_html__( 'Configure how the Forjeon toolbar behaves and appears.', 'forjeon' ) . '</p>';
	}

	/**
	 * Render features section description.
	 */
	public function render_features_section(): void {
		echo '<p>' . esc_html__( 'Enable or disable specific features and tabs.', 'forjeon' ) . '</p>';
	}

	/**
	 * Render advanced section description.
	 */
	public function render_advanced_section(): void {
		echo '<p>' . esc_html__( 'Advanced settings for performance and debugging.', 'forjeon' ) . '</p>';
	}

	/**
	 * Render checkbox field.
	 *
	 * @param array $args Field arguments including 'id', 'label', etc.
	 */
	public function render_checkbox_field( array $args ): void {
		$settings = $this->get_settings();
		$value    = $settings[ $args['field'] ] ?? false;
		$checked  = checked( $value, true, false );

		printf(
			'<label><input type="checkbox" name="%s[%s]" value="1" %s> %s</label>',
			esc_attr( self::OPTION_NAME ),
			esc_attr( $args['field'] ),
			esc_attr( $checked ),
			esc_html( $args['description'] )
		);
	}

	/**
	 * Render select field.
	 *
	 * @param array $args Field arguments including 'field', 'options', 'description', etc.
	 */
	public function render_select_field( array $args ): void {
		$settings = $this->get_settings();
		$value    = $settings[ $args['field'] ] ?? '';

		printf( '<select name="%s[%s]">', esc_attr( self::OPTION_NAME ), esc_attr( $args['field'] ) );

		foreach ( $args['options'] as $option_value => $option_label ) {
			$selected = selected( $value, $option_value, false );
			printf(
				'<option value="%s" %s>%s</option>',
				esc_attr( $option_value ),
				esc_attr( $selected ),
				esc_html( $option_label )
			);
		}

		echo '</select>';

		if ( ! empty( $args['description'] ) ) {
			printf( '<p class="description">%s</p>', esc_html( $args['description'] ) );
		}
	}

	/**
	 * Render feature flag field.
	 *
	 * @param array $args Field arguments including 'field', 'description', 'disabled', etc.
	 */
	public function render_feature_flag_field( array $args ): void {
		$settings      = $this->get_settings();
		$feature_flags = $settings['feature_flags'] ?? array();
		$value         = $feature_flags[ $args['field'] ] ?? false;
		$disabled      = $args['disabled'] ?? false;

		$field_name = sprintf( '%s[feature_flags][%s]', self::OPTION_NAME, $args['field'] );

		printf(
			'<label><input type="checkbox" name="%s" value="1" %s %s> %s</label>',
			esc_attr( $field_name ),
			checked( $value, true, false ),
			disabled( $disabled, true, false ),
			esc_html( $args['description'] )
		);

		if ( $disabled ) {
			echo '<p class="description" style="color: #ff6b35; font-weight: 500;">' .
				esc_html__( 'This feature is not yet available. It will be enabled in future updates.', 'forjeon' ) .
				'</p>';
		}
	}

	/**
	 * Get feature description.
	 *
	 * @param string $feature The feature key to get description for.
	 * @return string The feature description or empty string if not found.
	 */
	private function get_feature_description( string $feature ): string {
		$descriptions = array(
			'typography_tab' => esc_html__( 'Enable advanced typography controls in the toolbar.', 'forjeon' ),
			'design_tab'     => esc_html__( 'Enable design controls for backgrounds, borders, and colors.', 'forjeon' ),
			'layout_tab'     => esc_html__( 'Enable layout controls for spacing, positioning, and dimensions.', 'forjeon' ),
			'effects_tab'    => esc_html__( 'Enable visual effects like shadows, animations, and transforms.', 'forjeon' ),
			'blocks_tab'     => esc_html__( 'Enable custom blocks library and block management.', 'forjeon' ),
			'advanced_tab'   => esc_html__( 'Enable advanced CSS editing and custom code injection.', 'forjeon' ),
		);

		return $descriptions[ $feature ] ?? '';
	}

	/**
	 * Sanitize settings input.
	 *
	 * @param mixed $input The input data to sanitize.
	 * @return array Sanitized settings array.
	 */
	public function sanitize_settings( $input ): array {
		// Handle null or non-array input.
		if ( ! is_array( $input ) ) {
			$input = array();
		}

		// If no form submission, return current settings.
		if ( empty( $input['_form_submitted'] ) ) {
			return $this->get_settings();
		}

		$sanitized = array();

		// Boolean fields - defaults to false if not present.
		$boolean_fields = array(
			'toolbar_enabled',
			'header_button_enabled',
			'keyboard_shortcuts',
			'auto_save_preferences',
			'performance_mode',
			'debug_mode',
			'css_output_optimization',
			'load_frontend_assets',
			'enable_toolbar_animations',
		);
		foreach ( $boolean_fields as $field ) {
			$sanitized[ $field ] = ! empty( $input[ $field ] );
		}

		// String fields.
		$sanitized['toolbar_position']    = in_array( $input['toolbar_position'] ?? '', array( 'floating', 'docked' ) ) ? $input['toolbar_position'] : 'floating';
		$sanitized['toolbar_default_tab'] = in_array( $input['toolbar_default_tab'] ?? '', array( 'typography', 'design', 'layout', 'effects', 'blocks', 'advanced' ) ) ? $input['toolbar_default_tab'] : 'typography';

		// Feature flags - defaults to false if not present.
		$sanitized['feature_flags'] = array();
		foreach ( $this->default_settings['feature_flags'] as $flag => $default_value ) {
			$sanitized['feature_flags'][ $flag ] = ! empty( $input['feature_flags'][ $flag ] );
		}

		// User roles access (for future implementation).
		$sanitized['user_roles_access'] = $this->default_settings['user_roles_access'];

		return $sanitized;
	}

	/**
	 * Get settings
	 */
	public function get_settings(): array {
		$settings = get_option( self::OPTION_NAME, $this->default_settings );
		return wp_parse_args( $settings, $this->default_settings );
	}

	/**
	 * Get specific setting by key.
	 *
	 * @param string $key     The setting key to retrieve.
	 * @param mixed  $default The default value if setting doesn't exist.
	 * @return mixed The setting value or default.
	 */
	public function get_setting( string $key, $default = null ) {
		$settings = $this->get_settings();
		return $settings[ $key ] ?? $default;
	}

	/**
	 * Check if current user has access to Forjeon features
	 */
	public function current_user_has_access(): bool {
		$user = wp_get_current_user();
		if ( ! $user->ID ) {
			return false;
		}

		$settings          = $this->get_settings();
		$user_roles_access = $settings['user_roles_access'] ?? $this->default_settings['user_roles_access'];

		// Check each user role.
		foreach ( $user->roles as $role ) {
			if ( ! empty( $user_roles_access[ $role ] ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if toolbar should be loaded for current user
	 */
	public function should_load_toolbar(): bool {
		// Check if toolbar is globally enabled.
		if ( ! $this->get_setting( 'toolbar_enabled', true ) ) {
			return false;
		}

		// Check if current user has access.
		if ( ! $this->current_user_has_access() ) {
			return false;
		}

		// Check if we're in the block editor.
		if ( ! $this->is_block_editor() ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if we're in the block editor
	 */
	private function is_block_editor(): bool {
		// Check if we're in the admin and have the block editor functions.
		if ( ! is_admin() || ! function_exists( 'get_current_screen' ) ) {
			return false;
		}

		$screen = get_current_screen();
		if ( ! $screen ) {
			return false;
		}

		// Check if it's a post edit screen with block editor.
		return $screen->is_block_editor();
	}

	/**
	 * Save user preferences via AJAX
	 */
	public function save_user_preferences(): void {
		if ( ! wp_verify_nonce( isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '', 'forjeon_user_preferences' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'forjeon' ) );
		}

		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			wp_die( esc_html__( 'User not logged in.', 'forjeon' ) );
		}

		$preferences_raw = isset( $_POST['preferences'] ) ? sanitize_text_field( wp_unslash( $_POST['preferences'] ) ) : '{}';
		if ( is_string( $preferences_raw ) ) {
			$decoded_preferences = json_decode( $preferences_raw, true );
			$preferences = $decoded_preferences ? $decoded_preferences : array();
		} else {
			$preferences = is_array( $preferences_raw ) ? $preferences_raw : array();
		}
		$sanitized_preferences = $this->sanitize_user_preferences( $preferences );

		update_user_meta( $user_id, self::USER_PREFERENCES_NAME, $sanitized_preferences );

		wp_send_json_success( array( 'message' => esc_html__( 'Preferences saved.', 'forjeon' ) ) );
	}

	/**
	 * Get user preferences via AJAX
	 */
	public function get_user_preferences(): void {
		if ( ! wp_verify_nonce( isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '', 'forjeon_user_preferences' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'forjeon' ) );
		}

		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			wp_die( esc_html__( 'User not logged in.', 'forjeon' ) );
		}

		$preferences = $this->get_user_preferences_for_user( $user_id );
		wp_send_json_success( $preferences );
	}

	/**
	 * Get user preferences for specific user.
	 *
	 * @param int $user_id The user ID to get preferences for.
	 * @return array The user preferences array.
	 */
	public function get_user_preferences_for_user( int $user_id ): array {
		$preferences = get_user_meta( $user_id, self::USER_PREFERENCES_NAME, true );
		if ( ! is_array( $preferences ) ) {
			$preferences = array();
		}
		return wp_parse_args( $preferences, $this->default_user_preferences );
	}

	/**
	 * Sanitize user preferences input.
	 *
	 * @param mixed $input The input data to sanitize.
	 * @return array Sanitized user preferences array.
	 */
	private function sanitize_user_preferences( $input ): array {
		if ( ! is_array( $input ) ) {
			$input = array();
		}

		$sanitized = array();

		// Toolbar position.
		if ( isset( $input['toolbar_position'] ) && is_array( $input['toolbar_position'] ) ) {
			$x = isset( $input['toolbar_position']['x'] ) ? intval( $input['toolbar_position']['x'] ) : 100;
			$y = isset( $input['toolbar_position']['y'] ) ? intval( $input['toolbar_position']['y'] ) : 100;

			// Ensure position is within reasonable bounds.
			$sanitized['toolbar_position'] = array(
				'x' => max( 0, min( $x, 2000 ) ),
				'y' => max( 0, min( $y, 2000 ) ),
			);
		} else {
			$sanitized['toolbar_position'] = array(
				'x' => 100,
				'y' => 100,
			);
		}

		// Boolean preferences.
		$boolean_fields = array( 'toolbar_visible', 'minimized', 'docked' );
		foreach ( $boolean_fields as $field ) {
			$sanitized[ $field ] = ! empty( $input[ $field ] );
		}

		// Active tab.
		$valid_tabs              = array( 'typography', 'design', 'layout', 'effects', 'blocks', 'advanced' );
		$sanitized['active_tab'] = in_array( $input['active_tab'] ?? '', $valid_tabs ) ? $input['active_tab'] : 'typography';

		return $sanitized;
	}
}