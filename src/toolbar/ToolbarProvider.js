/**
 * Forjeon Toolbar Context Provider
 * 
 * @package Forjeon
 * @since 1.0.0
 */

import { createContext, useContext, useReducer, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

// Create toolbar context
const ToolbarContext = createContext();

// Toolbar state reducer
function toolbarReducer(state, action) {
	switch (action.type) {
		case 'SET_SELECTED_BLOCK':
			return {
				...state,
				selectedBlock: action.payload,
			};
		case 'SET_BLOCK_ATTRIBUTES':
			return {
				...state,
				blockAttributes: {
					...state.blockAttributes,
					[action.blockId]: {
						...state.blockAttributes[action.blockId],
						...action.attributes,
					},
				},
			};
		case 'SET_TOOLBAR_SETTINGS':
			return {
				...state,
				toolbarSettings: {
					...state.toolbarSettings,
					...action.payload,
				},
			};
		case 'SET_RESPONSIVE_MODE':
			return {
				...state,
				responsiveMode: action.payload,
			};
		case 'SET_LIVE_PREVIEW':
			return {
				...state,
				livePreviewEnabled: action.payload,
			};
		default:
			return state;
	}
}

// Initial state
const initialState = {
	selectedBlock: null,
	blockAttributes: {},
	toolbarSettings: {
		position: { x: 20, y: 20 },
		isDocked: false,
		isMinimized: false,
		activeTab: 'typography',
	},
	responsiveMode: 'desktop', // desktop, tablet, mobile
	livePreviewEnabled: true,
};

/**
 * Toolbar Provider Component
 * Provides global state management for the toolbar
 */
export function ToolbarProvider({ children }) {
	const [state, dispatch] = useReducer(toolbarReducer, initialState);

	// WordPress block editor integration
	const { selectedBlockId, selectedBlock } = useSelect(
		(select) => {
			const {
				getSelectedBlockClientId,
				getBlock,
			} = select(blockEditorStore);

			const clientId = getSelectedBlockClientId();
			return {
				selectedBlockId: clientId,
				selectedBlock: clientId ? getBlock(clientId) : null,
			};
		},
		[]
	);

	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	// Update selected block in toolbar state when WordPress selection changes
	useEffect(() => {
		if (selectedBlock) {
			dispatch({
				type: 'SET_SELECTED_BLOCK',
				payload: selectedBlock,
			});
		}
	}, [selectedBlock]);

	// Action creators
	const actions = {
		// Update block attributes both in toolbar state and WordPress
		updateBlockAttributes: (blockId, attributes) => {
			// Update toolbar state
			dispatch({
				type: 'SET_BLOCK_ATTRIBUTES',
				blockId,
				attributes,
			});

			// Update WordPress block
			if (blockId && selectedBlockId === blockId) {
				updateBlockAttributes(blockId, attributes);
			}
		},

		// Set toolbar settings
		setToolbarSettings: (settings) => {
			dispatch({
				type: 'SET_TOOLBAR_SETTINGS',
				payload: settings,
			});
		},

		// Set responsive preview mode
		setResponsiveMode: (mode) => {
			dispatch({
				type: 'SET_RESPONSIVE_MODE',
				payload: mode,
			});
		},

		// Toggle live preview
		setLivePreview: (enabled) => {
			dispatch({
				type: 'SET_LIVE_PREVIEW',
				payload: enabled,
			});
		},

		// Get current block attributes (merged from WordPress and toolbar state)
		getCurrentBlockAttributes: () => {
			if (!selectedBlock) return {};
			
			const wpAttributes = selectedBlock.attributes || {};
			const toolbarAttributes = state.blockAttributes[selectedBlock.clientId] || {};
			
			return {
				...wpAttributes,
				...toolbarAttributes,
			};
		},

		// Check if current block supports specific features
		blockSupports: (feature) => {
			if (!selectedBlock) return false;
			
			const blockType = selectedBlock.name;
			
			// Define which blocks support which features
			const supportMatrix = {
				typography: [
					'core/paragraph',
					'core/heading',
					'core/list',
					'core/quote',
					'core/pullquote',
					'forjeon/tabs',
				],
				design: ['*'], // All blocks support design controls
				layout: ['*'], // All blocks support layout controls
				effects: ['*'], // All blocks support effects
			};

			const supportedBlocks = supportMatrix[feature] || [];
			return supportedBlocks.includes('*') || supportedBlocks.includes(blockType);
		},
	};

	const contextValue = {
		...state,
		...actions,
		selectedBlockId,
	};

	return (
		<ToolbarContext.Provider value={contextValue}>
			{children}
		</ToolbarContext.Provider>
	);
}

/**
 * Hook to use toolbar context
 */
export function useToolbar() {
	const context = useContext(ToolbarContext);
	if (!context) {
		throw new Error('useToolbar must be used within a ToolbarProvider');
	}
	return context;
}

/**
 * Hook for block-specific toolbar features
 */
export function useBlockToolbar() {
	const toolbar = useToolbar();
	const { selectedBlock, selectedBlockId } = toolbar;

	return {
		...toolbar,
		hasSelectedBlock: !!selectedBlock,
		selectedBlockType: selectedBlock?.name,
		selectedBlockAttributes: toolbar.getCurrentBlockAttributes(),
		updateCurrentBlockAttributes: (attributes) => {
			if (selectedBlockId) {
				toolbar.updateBlockAttributes(selectedBlockId, attributes);
			}
		},
	};
}