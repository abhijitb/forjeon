<?php
/**
 * Forjeon Settings Manager
 * Handles plugin settings and configuration
 *
 * @package Forjeon
 * @since 1.0.0
 */

namespace Forjeon\Core;

class Settings {
	
	/**
	 * Settings option name
	 */
	const OPTION_NAME = 'forjeon_settings';
	
	/**
	 * User preferences option name
	 */
	const USER_PREFERENCES_NAME = 'forjeon_user_preferences';
	
	/**
	 * Default settings
	 */
	private array $default_settings = [
		'toolbar_enabled' => true,
		'toolbar_position' => 'floating',
		'toolbar_default_tab' => 'typography',
		'header_button_enabled' => true,
		'keyboard_shortcuts' => true,
		'auto_save_preferences' => true,
		'performance_mode' => false,
		'debug_mode' => false,
		'css_output_optimization' => true,
		'load_frontend_assets' => true,
		'enable_toolbar_animations' => true,
		'feature_flags' => [
			'typography_tab' => true,
			'design_tab' => false,
			'layout_tab' => false,
			'effects_tab' => false,
			'blocks_tab' => false,
			'advanced_tab' => false,
		],
		'user_roles_access' => [
			'administrator' => true,
			'editor' => true,
			'author' => false,
			'contributor' => false,
			'subscriber' => false,
		],
	];
	
	/**
	 * Default user preferences
	 */
	private array $default_user_preferences = [
		'toolbar_position' => ['x' => 100, 'y' => 100],
		'toolbar_visible' => false,
		'active_tab' => 'typography',
		'minimized' => false,
		'docked' => false,
	];
	
	/**
	 * Initialize settings
	 */
	public function init(): void {
		add_action('admin_menu', [$this, 'add_admin_menu']);
		add_action('admin_init', [$this, 'register_settings']);
		add_action('wp_ajax_forjeon_save_user_preferences', [$this, 'save_user_preferences']);
		add_action('wp_ajax_forjeon_get_user_preferences', [$this, 'get_user_preferences']);
	}
	
	/**
	 * Add admin menu page
	 */
	public function add_admin_menu(): void {
		add_options_page(
			__('Forjeon Settings', 'forjeon'),
			__('Forjeon', 'forjeon'),
			'manage_options',
			'forjeon-settings',
			[$this, 'render_settings_page']
		);
	}
	
	/**
	 * Register settings
	 */
	public function register_settings(): void {
		register_setting(
			'forjeon_settings_group',
			self::OPTION_NAME,
			[
				'type' => 'array',
				'default' => $this->default_settings,
				'sanitize_callback' => [$this, 'sanitize_settings'],
			]
		);
		
		// General Settings Section
		add_settings_section(
			'forjeon_general_section',
			__('General Settings', 'forjeon'),
			[$this, 'render_general_section'],
			'forjeon-settings'
		);
		
		// Toolbar Settings Section
		add_settings_section(
			'forjeon_toolbar_section',
			__('Toolbar Settings', 'forjeon'),
			[$this, 'render_toolbar_section'],
			'forjeon-settings'
		);
		
		// Feature Flags Section
		add_settings_section(
			'forjeon_features_section',
			__('Feature Settings', 'forjeon'),
			[$this, 'render_features_section'],
			'forjeon-settings'
		);
		
		// Advanced Settings Section
		add_settings_section(
			'forjeon_advanced_section',
			__('Advanced Settings', 'forjeon'),
			[$this, 'render_advanced_section'],
			'forjeon-settings'
		);
		
		// Add individual settings fields
		$this->add_settings_fields();
	}
	
	/**
	 * Add settings fields
	 */
	private function add_settings_fields(): void {
		// General settings
		add_settings_field(
			'toolbar_enabled',
			__('Enable Toolbar', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_general_section',
			['field' => 'toolbar_enabled', 'description' => __('Enable the Forjeon toolbar in the block editor.', 'forjeon')]
		);
		
		add_settings_field(
			'header_button_enabled',
			__('Enable Header Button', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_general_section',
			['field' => 'header_button_enabled', 'description' => __('Show the Forjeon button in the editor header.', 'forjeon')]
		);
		
		add_settings_field(
			'keyboard_shortcuts',
			__('Enable Keyboard Shortcuts', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_general_section',
			['field' => 'keyboard_shortcuts', 'description' => __('Enable keyboard shortcuts (Alt+F to toggle toolbar).', 'forjeon')]
		);
		
		// Toolbar settings
		add_settings_field(
			'toolbar_position',
			__('Default Toolbar Position', 'forjeon'),
			[$this, 'render_select_field'],
			'forjeon-settings',
			'forjeon_toolbar_section',
			[
				'field' => 'toolbar_position',
				'options' => [
					'floating' => __('Floating', 'forjeon'),
					'docked' => __('Docked to Right', 'forjeon'),
				],
				'description' => __('Default position for the toolbar when first opened.', 'forjeon')
			]
		);
		
		add_settings_field(
			'toolbar_default_tab',
			__('Default Active Tab', 'forjeon'),
			[$this, 'render_select_field'],
			'forjeon-settings',
			'forjeon_toolbar_section',
			[
				'field' => 'toolbar_default_tab',
				'options' => [
					'typography' => __('Typography', 'forjeon'),
					'design' => __('Design', 'forjeon'),
					'layout' => __('Layout', 'forjeon'),
					'effects' => __('Effects', 'forjeon'),
					'blocks' => __('Blocks', 'forjeon'),
					'advanced' => __('Advanced', 'forjeon'),
				],
				'description' => __('Which tab should be active when toolbar opens.', 'forjeon')
			]
		);
		
		add_settings_field(
			'auto_save_preferences',
			__('Auto-save User Preferences', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_toolbar_section',
			['field' => 'auto_save_preferences', 'description' => __('Automatically save toolbar position and state for each user.', 'forjeon')]
		);
		
		// Advanced settings
		add_settings_field(
			'performance_mode',
			__('Performance Mode', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_advanced_section',
			['field' => 'performance_mode', 'description' => __('Optimize for performance by reducing animations and effects.', 'forjeon')]
		);
		
		add_settings_field(
			'debug_mode',
			__('Debug Mode', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_advanced_section',
			['field' => 'debug_mode', 'description' => __('Enable debug logging for troubleshooting.', 'forjeon')]
		);
		
		add_settings_field(
			'css_output_optimization',
			__('CSS Output Optimization', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_advanced_section',
			['field' => 'css_output_optimization', 'description' => __('Optimize CSS output by minifying and removing unused styles.', 'forjeon')]
		);
		
		add_settings_field(
			'load_frontend_assets',
			__('Load Frontend Assets', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_advanced_section',
			['field' => 'load_frontend_assets', 'description' => __('Load Forjeon styles and scripts on the frontend when needed.', 'forjeon')]
		);
		
		add_settings_field(
			'enable_toolbar_animations',
			__('Enable Toolbar Animations', 'forjeon'),
			[$this, 'render_checkbox_field'],
			'forjeon-settings',
			'forjeon_advanced_section',
			['field' => 'enable_toolbar_animations', 'description' => __('Enable animations and transitions in the toolbar interface.', 'forjeon')]
		);
	}
	
	/**
	 * Render settings page
	 */
	public function render_settings_page(): void {
		if (!current_user_can('manage_options')) {
			return;
		}
		
		// Display settings errors (WordPress will automatically show success message)
		settings_errors('forjeon_messages');
		?>
		<div class="wrap">
			<h1><?php echo esc_html(get_admin_page_title()); ?></h1>
			
			<div class="forjeon-settings-header">
				<p><?php _e('Configure Forjeon settings to customize your block editor enhancement experience.', 'forjeon'); ?></p>
			</div>
			
			<form action="options.php" method="post">
				<?php
				settings_fields('forjeon_settings_group');
				do_settings_sections('forjeon-settings');
				submit_button(__('Save Settings', 'forjeon'));
				?>
			</form>
			
			<div class="forjeon-settings-footer">
				<h3><?php _e('Need Help?', 'forjeon'); ?></h3>
				<p><?php _e('Visit our documentation for guides and troubleshooting tips.', 'forjeon'); ?></p>
				<ul>
					<li><strong><?php _e('Keyboard Shortcuts:', 'forjeon'); ?></strong> <?php _e('Alt+F to toggle toolbar, Escape to close', 'forjeon'); ?></li>
					<li><strong><?php _e('Current Version:', 'forjeon'); ?></strong> <?php echo esc_html(FORJEON_VERSION); ?></li>
					<li><strong><?php _e('Plugin Status:', 'forjeon'); ?></strong> <span style="color: #46b450;"><?php _e('Active', 'forjeon'); ?></span></li>
				</ul>
			</div>
		</div>
		
		<style>
		.forjeon-settings-header {
			background: #f9f9f9;
			border: 1px solid #e5e5e5;
			padding: 15px;
			margin: 20px 0;
			border-radius: 4px;
		}
		
		.forjeon-settings-footer {
			background: #fff;
			border: 1px solid #e5e5e5;
			padding: 20px;
			margin: 30px 0;
			border-radius: 4px;
		}
		
		.forjeon-settings-footer h3 {
			margin-top: 0;
		}
		
		.forjeon-settings-footer ul {
			list-style: disc;
			margin-left: 20px;
		}
		</style>
		<?php
	}
	
	/**
	 * Render section descriptions
	 */
	public function render_general_section(): void {
		echo '<p>' . __('General plugin settings that affect the overall behavior.', 'forjeon') . '</p>';
	}
	
	public function render_toolbar_section(): void {
		echo '<p>' . __('Configure how the Forjeon toolbar behaves and appears.', 'forjeon') . '</p>';
	}
	
	public function render_features_section(): void {
		echo '<p>' . __('Enable or disable specific features and tabs.', 'forjeon') . '</p>';
	}
	
	public function render_advanced_section(): void {
		echo '<p>' . __('Advanced settings for performance and debugging.', 'forjeon') . '</p>';
	}
	
	/**
	 * Render checkbox field
	 */
	public function render_checkbox_field(array $args): void {
		$settings = $this->get_settings();
		$value = $settings[$args['field']] ?? false;
		$checked = checked($value, true, false);
		
		printf(
			'<label><input type="checkbox" name="%s[%s]" value="1" %s> %s</label>',
			esc_attr(self::OPTION_NAME),
			esc_attr($args['field']),
			$checked,
			esc_html($args['description'])
		);
	}
	
	/**
	 * Render select field
	 */
	public function render_select_field(array $args): void {
		$settings = $this->get_settings();
		$value = $settings[$args['field']] ?? '';
		
		printf('<select name="%s[%s]">', esc_attr(self::OPTION_NAME), esc_attr($args['field']));
		
		foreach ($args['options'] as $option_value => $option_label) {
			$selected = selected($value, $option_value, false);
			printf(
				'<option value="%s" %s>%s</option>',
				esc_attr($option_value),
				$selected,
				esc_html($option_label)
			);
		}
		
		echo '</select>';
		
		if (!empty($args['description'])) {
			printf('<p class="description">%s</p>', esc_html($args['description']));
		}
	}
	
	/**
	 * Sanitize settings
	 */
	public function sanitize_settings(array $input): array {
		$sanitized = [];
		
		// Boolean fields
		$boolean_fields = [
			'toolbar_enabled', 
			'header_button_enabled', 
			'keyboard_shortcuts', 
			'auto_save_preferences', 
			'performance_mode', 
			'debug_mode',
			'css_output_optimization',
			'load_frontend_assets',
			'enable_toolbar_animations'
		];
		foreach ($boolean_fields as $field) {
			$sanitized[$field] = !empty($input[$field]);
		}
		
		// String fields
		$sanitized['toolbar_position'] = in_array($input['toolbar_position'] ?? '', ['floating', 'docked']) ? $input['toolbar_position'] : 'floating';
		$sanitized['toolbar_default_tab'] = in_array($input['toolbar_default_tab'] ?? '', ['typography', 'design', 'layout', 'effects', 'blocks', 'advanced']) ? $input['toolbar_default_tab'] : 'typography';
		
		// Feature flags
		$sanitized['feature_flags'] = $this->default_settings['feature_flags'];
		if (isset($input['feature_flags']) && is_array($input['feature_flags'])) {
			foreach ($input['feature_flags'] as $flag => $value) {
				if (array_key_exists($flag, $this->default_settings['feature_flags'])) {
					$sanitized['feature_flags'][$flag] = !empty($value);
				}
			}
		}
		
		return $sanitized;
	}
	
	/**
	 * Get settings
	 */
	public function get_settings(): array {
		$settings = get_option(self::OPTION_NAME, $this->default_settings);
		return wp_parse_args($settings, $this->default_settings);
	}
	
	/**
	 * Get specific setting
	 */
	public function get_setting(string $key, $default = null) {
		$settings = $this->get_settings();
		return $settings[$key] ?? $default;
	}
	
	/**
	 * Check if current user has access to Forjeon features
	 */
	public function current_user_has_access(): bool {
		$user = wp_get_current_user();
		if (!$user->ID) {
			return false;
		}
		
		$settings = $this->get_settings();
		$user_roles_access = $settings['user_roles_access'] ?? $this->default_settings['user_roles_access'];
		
		// Check each user role
		foreach ($user->roles as $role) {
			if (!empty($user_roles_access[$role])) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Check if toolbar should be loaded for current user
	 */
	public function should_load_toolbar(): bool {
		// Check if toolbar is globally enabled
		if (!$this->get_setting('toolbar_enabled', true)) {
			return false;
		}
		
		// Check if current user has access
		if (!$this->current_user_has_access()) {
			return false;
		}
		
		// Check if we're in the block editor
		if (!$this->is_block_editor()) {
			return false;
		}
		
		return true;
	}
	
	/**
	 * Check if we're in the block editor
	 */
	private function is_block_editor(): bool {
		// Check if we're in the admin and have the block editor functions
		if (!is_admin() || !function_exists('get_current_screen')) {
			return false;
		}
		
		$screen = get_current_screen();
		if (!$screen) {
			return false;
		}
		
		// Check if it's a post edit screen with block editor
		return $screen->is_block_editor();
	}
	
	/**
	 * Save user preferences via AJAX
	 */
	public function save_user_preferences(): void {
		if (!wp_verify_nonce($_POST['nonce'] ?? '', 'forjeon_user_preferences')) {
			wp_die(__('Security check failed.', 'forjeon'));
		}
		
		$user_id = get_current_user_id();
		if (!$user_id) {
			wp_die(__('User not logged in.', 'forjeon'));
		}
		
		$preferences = $_POST['preferences'] ?? '{}';
		if (is_string($preferences)) {
			$preferences = json_decode($preferences, true) ?: [];
		}
		$sanitized_preferences = $this->sanitize_user_preferences($preferences);
		
		update_user_meta($user_id, self::USER_PREFERENCES_NAME, $sanitized_preferences);
		
		wp_send_json_success(['message' => __('Preferences saved.', 'forjeon')]);
	}
	
	/**
	 * Get user preferences via AJAX
	 */
	public function get_user_preferences(): void {
		if (!wp_verify_nonce($_POST['nonce'] ?? '', 'forjeon_user_preferences')) {
			wp_die(__('Security check failed.', 'forjeon'));
		}
		
		$user_id = get_current_user_id();
		if (!$user_id) {
			wp_die(__('User not logged in.', 'forjeon'));
		}
		
		$preferences = $this->get_user_preferences_for_user($user_id);
		wp_send_json_success($preferences);
	}
	
	/**
	 * Get user preferences for specific user
	 */
	public function get_user_preferences_for_user(int $user_id): array {
		$preferences = get_user_meta($user_id, self::USER_PREFERENCES_NAME, true);
		if (!is_array($preferences)) {
			$preferences = [];
		}
		return wp_parse_args($preferences, $this->default_user_preferences);
	}
	
	/**
	 * Sanitize user preferences
	 */
	private function sanitize_user_preferences($input): array {
		if (!is_array($input)) {
			$input = [];
		}
		
		$sanitized = [];
		
		// Toolbar position
		if (isset($input['toolbar_position']) && is_array($input['toolbar_position'])) {
			$x = isset($input['toolbar_position']['x']) ? intval($input['toolbar_position']['x']) : 100;
			$y = isset($input['toolbar_position']['y']) ? intval($input['toolbar_position']['y']) : 100;
			
			// Ensure position is within reasonable bounds
			$sanitized['toolbar_position'] = [
				'x' => max(0, min($x, 2000)),
				'y' => max(0, min($y, 2000)),
			];
		} else {
			$sanitized['toolbar_position'] = ['x' => 100, 'y' => 100];
		}
		
		// Boolean preferences
		$boolean_fields = ['toolbar_visible', 'minimized', 'docked'];
		foreach ($boolean_fields as $field) {
			$sanitized[$field] = !empty($input[$field]);
		}
		
		// Active tab
		$valid_tabs = ['typography', 'design', 'layout', 'effects', 'blocks', 'advanced'];
		$sanitized['active_tab'] = in_array($input['active_tab'] ?? '', $valid_tabs) ? $input['active_tab'] : 'typography';
		
		return $sanitized;
	}
}