import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { createRoot } from 'react-dom/client';
import { Button } from '@wordpress/components';
import { settings } from '@wordpress/icons';

/**
 * Toolbar Toggle Component that injects a button directly into the header
 */
export function ToolbarToggle() {
	const [isVisible, setIsVisible] = useState(false);
	
	useEffect(() => {
		let buttonContainer = null;
		let reactRoot = null;

		const injectButton = () => {
			// Remove existing button if it exists
			const existingButton = document.querySelector('.forjeon-header-button-container');
			if (existingButton) {
				existingButton.remove();
			}

			// Target the editor header settings area specifically
			const targetArea = document.querySelector('.editor-header__settings');
			
			if (targetArea) {
				// Create container for our button
				buttonContainer = document.createElement('div');
				buttonContainer.className = 'forjeon-header-button-container';
				buttonContainer.style.cssText = `
					display: inline-flex;
					align-items: center;
					height: 100%;
				`;

				// Insert as the first child in the settings area
				if (targetArea.firstChild) {
					targetArea.insertBefore(buttonContainer, targetArea.firstChild);
				} else {
					targetArea.appendChild(buttonContainer);
				}

				// Create React root and render button
				reactRoot = createRoot(buttonContainer);
				renderButton();
			}
		};

		const renderButton = () => {
			if (reactRoot) {
				reactRoot.render(
					<Button
						variant={isVisible ? 'primary' : 'tertiary'}
						onClick={handleClick}
						label={__('Toggle Forjeon Toolbar', 'forjeon')}
						title={__('Toggle Forjeon Toolbar (Alt+F)', 'forjeon')}
						style={{
							minWidth: 'auto',
							padding: '8px 12px',
							fontSize: '14px',
							lineHeight: '1',
							display: 'flex',
							alignItems: 'center',
							gap: '6px',
						}}
					>
						<span style={{ fontSize: '24px' }}>🎨</span>
						<span>Forjeon</span>
					</Button>
				);
			}
		};

		const handleClick = () => {
			const newState = !isVisible;
			setIsVisible(newState);
			// Dispatch event for the main toolbar
			window.dispatchEvent(new CustomEvent('forjeon-toggle-toolbar'));
			// Also dispatch state change
			window.dispatchEvent(new CustomEvent('forjeon-toolbar-state', {
				detail: { isVisible: newState }
			}));
			// Re-render button with new state
			renderButton();
		};

		const handleStateChange = (e) => {
			setIsVisible(e.detail.isVisible);
			renderButton();
		};

		// Initial injection
		injectButton();

		// Retry injection after a delay for dynamic content
		const retryTimer = setTimeout(injectButton, 500);

		// Watch for DOM changes to re-inject if needed
		const observer = new MutationObserver(() => {
			if (!document.querySelector('.forjeon-header-button-container')) {
				injectButton();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		// Listen for toolbar state changes
		window.addEventListener('forjeon-toolbar-state', handleStateChange);

		return () => {
			clearTimeout(retryTimer);
			observer.disconnect();
			window.removeEventListener('forjeon-toolbar-state', handleStateChange);
			
			if (reactRoot) {
				reactRoot.unmount();
			}
			if (buttonContainer && buttonContainer.parentNode) {
				buttonContainer.parentNode.removeChild(buttonContainer);
			}
		};
	}, []);

	// This component doesn't render anything directly
	// The actual button is injected via DOM manipulation
	return null;
}