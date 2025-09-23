/**
 * Forjeon User Preferences Manager
 * Handles saving and loading user preferences via WordPress AJAX
 */

class PreferencesManager {
	constructor() {
		this.preferences = window.forjeonData?.userPreferences || {};
		this.settings = window.forjeonData?.settings || {};
		this.integration = window.forjeonData?.integration || {};
		this.nonce = window.forjeonData?.userPreferencesNonce || '';
		this.ajaxUrl = window.forjeonData?.ajaxUrl || '/wp-admin/admin-ajax.php';
		this.isAdmin = window.forjeonData?.isAdmin || false;
		this.currentUserId = window.forjeonData?.currentUserId || 0;
		
		// Debounce save operations to avoid excessive requests
		const debounceTime = this.integration.auto_save_preferences ? 1000 : 5000;
		this.debouncedSave = this.debounce(this.savePreferences.bind(this), debounceTime);
	}
	
	/**
	 * Get a preference value
	 */
	get(key, defaultValue = null) {
		return this.preferences[key] !== undefined ? this.preferences[key] : defaultValue;
	}
	
	/**
	 * Set a preference value
	 */
	set(key, value) {
		this.preferences[key] = value;
		
		// Auto-save if enabled
		if (this.settings.auto_save_preferences) {
			this.debouncedSave();
		}
	}
	
	/**
	 * Set multiple preferences at once
	 */
	setMultiple(preferences) {
		Object.assign(this.preferences, preferences);
		
		// Auto-save if enabled
		if (this.settings.auto_save_preferences) {
			this.debouncedSave();
		}
	}
	
	/**
	 * Get all preferences
	 */
	getAll() {
		return { ...this.preferences };
	}
	
	/**
	 * Save preferences to server
	 */
	async savePreferences() {
		if (!this.nonce) {
			console.warn('Forjeon: No nonce available for saving preferences');
			return false;
		}
		
		try {
			const formData = new FormData();
			formData.append('action', 'forjeon_save_user_preferences');
			formData.append('nonce', this.nonce);
			formData.append('preferences', JSON.stringify(this.preferences));
			
			const response = await fetch(this.ajaxUrl, {
				method: 'POST',
				body: formData,
			});
			
			const data = await response.json();
			
			if (data.success) {
				if (this.settings.debug_mode) {
					console.log('Forjeon: Preferences saved successfully');
				}
				return true;
			} else {
				console.error('Forjeon: Failed to save preferences:', data.data);
				return false;
			}
		} catch (error) {
			console.error('Forjeon: Error saving preferences:', error);
			return false;
		}
	}
	
	/**
	 * Load preferences from server
	 */
	async loadPreferences() {
		if (!this.nonce) {
			console.warn('Forjeon: No nonce available for loading preferences');
			return false;
		}
		
		try {
			const formData = new FormData();
			formData.append('action', 'forjeon_get_user_preferences');
			formData.append('nonce', this.nonce);
			
			const response = await fetch(this.ajaxUrl, {
				method: 'POST',
				body: formData,
			});
			
			const data = await response.json();
			
			if (data.success) {
				this.preferences = data.data;
				console.log('Forjeon: Preferences loaded successfully');
				return true;
			} else {
				console.error('Forjeon: Failed to load preferences:', data.data);
				return false;
			}
		} catch (error) {
			console.error('Forjeon: Error loading preferences:', error);
			return false;
		}
	}
	
	/**
	 * Save preferences immediately (bypassing debounce)
	 */
	async saveNow() {
		return await this.savePreferences();
	}
	
	/**
	 * Reset preferences to defaults
	 */
	reset() {
		this.preferences = {
			toolbar_position: { x: 100, y: 100 },
			toolbar_visible: false,
			active_tab: 'typography',
			minimized: false,
			docked: false,
		};
		
		// Save reset preferences
		if (this.settings.auto_save_preferences) {
			this.saveNow();
		}
	}
	
	/**
	 * Debounce utility function
	 */
	debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}
	
	/**
	 * Check if a setting is enabled
	 */
	isSettingEnabled(settingKey) {
		return this.settings[settingKey] === true;
	}
	
	/**
	 * Get plugin setting
	 */
	getSetting(key, defaultValue = null) {
		return this.settings[key] !== undefined ? this.settings[key] : defaultValue;
	}
}

// Create and export singleton instance
export const preferences = new PreferencesManager();

// Helper functions for common preferences
export const toolbarPreferences = {
	getPosition: () => preferences.get('toolbar_position', { x: 100, y: 100 }),
	setPosition: (position) => preferences.set('toolbar_position', position),
	
	getVisible: () => preferences.get('toolbar_visible', false),
	setVisible: (visible) => preferences.set('toolbar_visible', visible),
	
	getActiveTab: () => preferences.get('active_tab', 'typography'),
	setActiveTab: (tab) => preferences.set('active_tab', tab),
	
	getMinimized: () => preferences.get('minimized', false),
	setMinimized: (minimized) => preferences.set('minimized', minimized),
	
	getDocked: () => preferences.get('docked', false),
	setDocked: (docked) => preferences.set('docked', docked),
};

// Settings helpers
export const settings = {
	isToolbarEnabled: () => preferences.integration?.toolbar_enabled ?? true,
	isHeaderButtonEnabled: () => preferences.integration?.header_button_enabled ?? true,
	areKeyboardShortcutsEnabled: () => preferences.integration?.keyboard_shortcuts ?? true,
	isAutoSaveEnabled: () => preferences.integration?.auto_save_preferences ?? true,
	isPerformanceModeEnabled: () => preferences.settings?.performance_mode ?? false,
	isDebugModeEnabled: () => preferences.integration?.debug_mode ?? false,
	
	getDefaultTab: () => preferences.settings?.toolbar_default_tab ?? 'typography',
	getDefaultPosition: () => preferences.settings?.toolbar_position ?? 'floating',
	
	getFeatureFlags: () => preferences.settings?.feature_flags ?? {},
	isFeatureEnabled: (feature) => {
		const flags = settings.getFeatureFlags();
		return flags[feature] === true;
	},
	
	// Admin helpers
	isAdmin: () => preferences.isAdmin ?? false,
	getCurrentUserId: () => preferences.currentUserId ?? 0,
};