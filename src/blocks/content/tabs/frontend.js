/**
 * Tabs Block - Frontend JavaScript
 *
 * @package Forjeon
 * @since 1.0.0
 */

(function () {
	'use strict';

	// Check if we're in the browser
	if (typeof window === 'undefined') {
		return;
	}

	/**
	 * Tabs Class - Handles tab functionality
	 */
	class ForjeonTabs {
		constructor(container) {
			this.container = container;
			this.tabButtons = container.querySelectorAll('.forjeon-tab-button');
			this.tabPanels = container.querySelectorAll('.forjeon-tab-panel');
			this.accordionHeaders = container.querySelectorAll(
				'.forjeon-accordion-header'
			);
			this.activeTab = parseInt(container.dataset.activeTab) || 0;
			this.enableAccordion = container.dataset.enableAccordion === 'true';
			this.mobileBreakpoint =
				parseInt(container.dataset.mobileBreakpoint) || 768;
			this.isAccordionMode = false;

			this.init();
		}

		init() {
			// Set up event listeners
			this.setupTabButtons();
			this.setupAccordionHeaders();
			this.setupKeyboardNavigation();
			this.setupSwipeGestures();

			// Handle responsive behavior
			this.handleResize();
			window.addEventListener('resize', this.handleResize.bind(this));

			// Set initial active tab
			this.setActiveTab(this.activeTab, false);

			// Add loaded class for animations
			this.container.classList.add('forjeon-tabs-loaded');
		}

		setupTabButtons() {
			this.tabButtons.forEach((button, index) => {
				button.addEventListener('click', (e) => {
					e.preventDefault();
					this.setActiveTab(index);
				});

				// Improve accessibility
				button.setAttribute('role', 'tab');
				button.setAttribute(
					'tabindex',
					index === this.activeTab ? '0' : '-1'
				);
			});
		}

		setupAccordionHeaders() {
			this.accordionHeaders.forEach((header, index) => {
				header.addEventListener('click', (e) => {
					e.preventDefault();
					if (this.isAccordionMode) {
						this.toggleAccordionPanel(index);
					}
				});
			});
		}

		setupKeyboardNavigation() {
			this.container.addEventListener('keydown', (e) => {
				if (!this.isAccordionMode) {
					this.handleTabKeydown(e);
				} else {
					this.handleAccordionKeydown(e);
				}
			});
		}

		handleTabKeydown(e) {
			const focusedElement = document.activeElement;
			const tabIndex = Array.from(this.tabButtons).indexOf(
				focusedElement
			);

			if (tabIndex === -1) return;

			switch (e.key) {
				case 'ArrowLeft':
				case 'ArrowUp':
					e.preventDefault();
					this.focusPreviousTab(tabIndex);
					break;
				case 'ArrowRight':
				case 'ArrowDown':
					e.preventDefault();
					this.focusNextTab(tabIndex);
					break;
				case 'Home':
					e.preventDefault();
					this.focusTab(0);
					break;
				case 'End':
					e.preventDefault();
					this.focusTab(this.tabButtons.length - 1);
					break;
				case 'Enter':
				case ' ':
					e.preventDefault();
					this.setActiveTab(tabIndex);
					break;
			}
		}

		handleAccordionKeydown(e) {
			const focusedElement = document.activeElement;
			const headerIndex = Array.from(this.accordionHeaders).indexOf(
				focusedElement
			);

			if (headerIndex === -1) return;

			switch (e.key) {
				case 'Enter':
				case ' ':
					e.preventDefault();
					this.toggleAccordionPanel(headerIndex);
					break;
			}
		}

		focusPreviousTab(currentIndex) {
			const prevIndex =
				currentIndex === 0
					? this.tabButtons.length - 1
					: currentIndex - 1;
			this.focusTab(prevIndex);
		}

		focusNextTab(currentIndex) {
			const nextIndex =
				currentIndex === this.tabButtons.length - 1
					? 0
					: currentIndex + 1;
			this.focusTab(nextIndex);
		}

		focusTab(index) {
			this.tabButtons.forEach((button, i) => {
				button.setAttribute('tabindex', i === index ? '0' : '-1');
			});
			this.tabButtons[index].focus();
		}

		setActiveTab(index, animate = true) {
			if (index < 0 || index >= this.tabButtons.length) return;

			// Update active tab index
			this.activeTab = index;
			this.container.dataset.activeTab = index;

			// Update tab buttons
			this.tabButtons.forEach((button, i) => {
				const isActive = i === index;
				button.classList.toggle('active', isActive);
				button.setAttribute('aria-selected', isActive);
				button.setAttribute('tabindex', isActive ? '0' : '-1');
			});

			// Update tab panels
			this.tabPanels.forEach((panel, i) => {
				const isActive = i === index;
				panel.classList.toggle('active', isActive);

				if (isActive) {
					panel.removeAttribute('hidden');
					panel.setAttribute('tabindex', '0');

					// Announce to screen readers
					this.announceTabChange(panel);

					// Animate if requested
					if (
						animate &&
						!window.matchMedia('(prefers-reduced-motion: reduce)')
							.matches
					) {
						this.animateTabChange(panel);
					}
				} else {
					panel.setAttribute('hidden', '');
					panel.setAttribute('tabindex', '-1');
				}
			});

			// Dispatch custom event
			this.container.dispatchEvent(
				new CustomEvent('tabChanged', {
					detail: {
						activeTab: index,
						tabElement: this.tabPanels[index],
					},
				})
			);
		}

		toggleAccordionPanel(index) {
			const panel = this.tabPanels[index];
			const header = this.accordionHeaders[index];
			const isExpanded = header.getAttribute('aria-expanded') === 'true';

			// In accordion mode, multiple panels can be open
			header.setAttribute('aria-expanded', !isExpanded);
			panel.classList.toggle('active', !isExpanded);

			if (!isExpanded) {
				panel.removeAttribute('hidden');
				this.announceTabChange(panel);
			} else {
				panel.setAttribute('hidden', '');
			}
		}

		announceTabChange(panel) {
			// Create a temporary element for screen reader announcement
			const announcement = document.createElement('div');
			announcement.setAttribute('aria-live', 'polite');
			announcement.setAttribute('aria-atomic', 'true');
			announcement.className = 'sr-only';
			announcement.textContent = `Tab panel ${this.activeTab + 1} is now active`;

			this.container.appendChild(announcement);

			// Remove after announcement
			setTimeout(() => {
				if (announcement.parentNode) {
					announcement.parentNode.removeChild(announcement);
				}
			}, 1000);
		}

		animateTabChange(panel) {
			const content = panel.querySelector('.forjeon-tab-content');
			if (!content) return;

			// Reset animation
			content.style.animation = 'none';
			content.offsetHeight; // Trigger reflow
			content.style.animation = 'fadeIn 0.3s ease-in-out';
		}

		handleResize() {
			const wasAccordionMode = this.isAccordionMode;
			this.isAccordionMode =
				this.enableAccordion &&
				window.innerWidth <= this.mobileBreakpoint;

			// If mode changed, update display
			if (wasAccordionMode !== this.isAccordionMode) {
				this.updateDisplayMode();
			}
		}

		updateDisplayMode() {
			if (this.isAccordionMode) {
				// In accordion mode, set all panels to closed state
				this.accordionHeaders.forEach((header, index) => {
					const isActive = index === this.activeTab;
					header.setAttribute('aria-expanded', isActive);

					const panel = this.tabPanels[index];
					panel.classList.toggle('active', isActive);

					if (isActive) {
						panel.removeAttribute('hidden');
					} else {
						panel.setAttribute('hidden', '');
					}
				});
			} else {
				// In tab mode, ensure only active panel is shown
				this.setActiveTab(this.activeTab, false);
			}
		}

		setupSwipeGestures() {
			if (!('ontouchstart' in window)) return;

			let startX = 0;
			let startY = 0;
			let endX = 0;
			let endY = 0;

			this.container.addEventListener(
				'touchstart',
				(e) => {
					startX = e.touches[0].clientX;
					startY = e.touches[0].clientY;
				},
				{ passive: true }
			);

			this.container.addEventListener(
				'touchend',
				(e) => {
					endX = e.changedTouches[0].clientX;
					endY = e.changedTouches[0].clientY;
					this.handleSwipe();
				},
				{ passive: true }
			);
		}

		handleSwipe() {
			const deltaX = endX - startX;
			const deltaY = endY - startY;
			const minSwipeDistance = 50;

			// Only handle horizontal swipes that are longer than vertical
			if (
				Math.abs(deltaX) > Math.abs(deltaY) &&
				Math.abs(deltaX) > minSwipeDistance
			) {
				if (deltaX > 0) {
					// Swipe right - previous tab
					const prevIndex =
						this.activeTab === 0
							? this.tabButtons.length - 1
							: this.activeTab - 1;
					this.setActiveTab(prevIndex);
				} else {
					// Swipe left - next tab
					const nextIndex =
						this.activeTab === this.tabButtons.length - 1
							? 0
							: this.activeTab + 1;
					this.setActiveTab(nextIndex);
				}
			}
		}

		// Public API methods
		goToTab(index) {
			this.setActiveTab(index);
		}

		getActiveTab() {
			return this.activeTab;
		}

		getTotalTabs() {
			return this.tabButtons.length;
		}

		destroy() {
			// Remove event listeners
			window.removeEventListener('resize', this.handleResize.bind(this));

			// Remove classes
			this.container.classList.remove('forjeon-tabs-loaded');
		}
	}

	/**
	 * Initialize all tabs on the page
	 */
	function initTabs() {
		const tabContainers = document.querySelectorAll(
			'.forjeon-tabs-container'
		);

		tabContainers.forEach((container) => {
			// Skip if already initialized
			if (container.forjeonTabs) return;

			// Initialize tabs
			container.forjeonTabs = new ForjeonTabs(container);
		});
	}

	/**
	 * Initialize when DOM is ready
	 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTabs);
	} else {
		initTabs();
	}

	// Re-initialize on dynamic content changes (e.g., AJAX)
	if (typeof MutationObserver !== 'undefined') {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						// Element node
						if (
							node.classList &&
							node.classList.contains('forjeon-tabs-container')
						) {
							new ForjeonTabs(node);
						} else {
							const tabs =
								node.querySelectorAll &&
								node.querySelectorAll(
									'.forjeon-tabs-container'
								);
							if (tabs) {
								tabs.forEach((container) => {
									if (!container.forjeonTabs) {
										container.forjeonTabs = new ForjeonTabs(
											container
										);
									}
								});
							}
						}
					}
				});
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Expose to global scope for external access
	window.ForjeonTabs = ForjeonTabs;
})();
