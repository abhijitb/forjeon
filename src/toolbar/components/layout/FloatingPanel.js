/**
 * FloatingPanel Component
 * Draggable, dockable panel for the Forjeon toolbar
 * 
 * @package Forjeon
 * @since 1.0.0
 */

import { forwardRef, useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

/**
 * FloatingPanel Component
 * Provides draggable, dockable functionality
 */
export const FloatingPanel = forwardRef(({
	children,
	position = { x: 20, y: 20 },
	onPositionChange,
	isDocked = false,
	onDockChange,
	isMinimized = false,
	className,
	...props
}, ref) => {
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const panelRef = useRef(null);

	// Combine refs
	const combinedRef = (node) => {
		panelRef.current = node;
		if (ref) {
			if (typeof ref === 'function') {
				ref(node);
			} else {
				ref.current = node;
			}
		}
	};

	// Handle drag start
	const handleDragStart = (event) => {
		if (isDocked) return;

		const rect = panelRef.current.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;

		setDragOffset({ x: offsetX, y: offsetY });
		setIsDragging(true);

		// Prevent text selection during drag
		event.preventDefault();
	};

	// Handle drag move
	const handleDragMove = (event) => {
		if (!isDragging || isDocked) return;

		const newX = event.clientX - dragOffset.x;
		const newY = event.clientY - dragOffset.y;

		// Keep panel within viewport bounds
		const panelRect = panelRef.current.getBoundingClientRect();
		const maxX = window.innerWidth - panelRect.width;
		const maxY = window.innerHeight - panelRect.height;

		const boundedX = Math.max(0, Math.min(newX, maxX));
		const boundedY = Math.max(0, Math.min(newY, maxY));

		onPositionChange?.({ x: boundedX, y: boundedY });
	};

	// Handle drag end
	const handleDragEnd = () => {
		setIsDragging(false);
	};

	// Mouse event listeners for dragging
	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleDragMove);
			document.addEventListener('mouseup', handleDragEnd);

			return () => {
				document.removeEventListener('mousemove', handleDragMove);
				document.removeEventListener('mouseup', handleDragEnd);
			};
		}
	}, [isDragging, dragOffset]);

	// Auto-dock detection (when dragged to edges)
	useEffect(() => {
		if (!isDragging && onDockChange && position) {
			const threshold = 20;
			const { x, y } = position;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			// Auto-dock to edges
			if (x <= threshold || x >= windowWidth - threshold - 400) { // 400px estimated panel width
				onDockChange(true);
			} else if (y <= threshold) {
				onDockChange(true);
			}
		}
	}, [position, isDragging, onDockChange]);

	// Calculate panel styles
	const panelStyles = isDocked
		? {
			background: 'yellow', // Debug color for docked
			border: '3px solid red',
		} // Docked positioning handled by CSS
		: {
			position: 'fixed',
			left: `${position.x}px`,
			top: `${position.y}px`,
			zIndex: 100000, // High z-index to stay above editor elements
			background: 'lime', // Debug color for floating
			border: '3px solid blue',
			minWidth: '200px',
			minHeight: '100px',
		};
	
	console.log('FloatingPanel rendering with styles:', panelStyles, 'isDocked:', isDocked);

	return (
		<div
			ref={combinedRef}
			className={classnames('forjeon-floating-panel', className, {
				'is-docked': isDocked,
				'is-minimized': isMinimized,
				'is-dragging': isDragging,
			})}
			style={panelStyles}
			{...props}
		>
			{/* Drag Handle */}
			<div
				className="forjeon-panel-drag-handle"
				onMouseDown={handleDragStart}
				role="button"
				tabIndex={0}
				aria-label={__('Drag to move toolbar', 'forjeon')}
				title={isDocked ? __('Toolbar is docked', 'forjeon') : __('Drag to move', 'forjeon')}
				style={{ cursor: isDocked ? 'default' : 'move' }}
			>
				{/* Drag indicator dots */}
				<div className="forjeon-drag-indicator">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>

			{/* Panel Content */}
			<div className="forjeon-panel-content">
				{children}
			</div>

			{/* Resize Handle (for future enhancement) */}
			<div className="forjeon-panel-resize-handle" />
		</div>
	);
});

FloatingPanel.displayName = 'FloatingPanel';