# Forjeon Plugin File Structure

## Current State Analysis
The plugin currently has a basic structure with typography controls and a tabs block. We need to reorganize and expand this to support the comprehensive toolbar system.

## Proposed Plugin Structure

```
forjeon/
├── forjeon.php                          # Main plugin file
├── readme.txt                           # WordPress.org readme
├── composer.json                        # PHP dependencies
├── package.json                         # Node.js dependencies  
├── webpack.config.js                    # Build configuration
├── .gitignore                           # Git ignore rules
├── .editorconfig                        # Editor configuration
│
├── docs/                                # Documentation
│   ├── IMPLEMENTATION_PLAN.md          # Development roadmap
│   ├── FORJEON_TOOLBAR_MOCKUP.md       # UI/UX mockup
│   ├── PLUGIN_STRUCTURE.md             # This file
│   ├── API_REFERENCE.md                # API documentation
│   └── CHANGELOG.md                     # Version history
│
├── includes/                            # PHP Backend
│   │
│   ├── Core/                           # Core plugin functionality
│   │   ├── Plugin.php                  # Main plugin class
│   │   ├── Loader.php                  # Hook management
│   │   ├── Assets.php                  # Asset management
│   │   ├── Settings.php                # Plugin settings
│   │   └── Installer.php               # Installation/activation
│   │
│   ├── Toolbar/                        # Toolbar backend
│   │   ├── Toolbar_Manager.php         # Main toolbar controller
│   │   ├── Settings_Manager.php        # Toolbar settings
│   │   ├── State_Manager.php           # State persistence
│   │   └── Permission_Manager.php      # User permissions
│   │
│   ├── Controls/                       # Control systems
│   │   ├── Design/                     # Design controls
│   │   │   ├── Background_Control.php
│   │   │   ├── Border_Control.php
│   │   │   ├── Spacing_Control.php
│   │   │   ├── Shadow_Control.php
│   │   │   └── Visibility_Control.php
│   │   │
│   │   ├── Typography/                 # Typography controls
│   │   │   ├── Font_Control.php
│   │   │   ├── Size_Control.php
│   │   │   ├── Weight_Control.php
│   │   │   ├── Letter_Spacing_Control.php
│   │   │   └── Text_Shadow_Control.php
│   │   │
│   │   ├── Layout/                     # Layout controls
│   │   │   ├── Position_Control.php
│   │   │   ├── Flexbox_Control.php
│   │   │   ├── Grid_Control.php
│   │   │   └── Dimension_Control.php
│   │   │
│   │   └── Effects/                    # Effects controls
│   │       ├── Animation_Control.php
│   │       ├── Hover_Control.php
│   │       ├── Filter_Control.php
│   │       └── Transform_Control.php
│   │
│   ├── Blocks/                         # Block PHP handlers
│   │   ├── Base/                       # Base block classes
│   │   │   ├── Block_Base.php          # Abstract base class
│   │   │   ├── Dynamic_Block.php       # Dynamic block base
│   │   │   └── Static_Block.php        # Static block base
│   │   │
│   │   ├── Content/                    # Content blocks
│   │   │   ├── Tabs_Block.php          # ✅ Existing
│   │   │   ├── Accordion_Block.php     # Accordion/Toggle
│   │   │   ├── Testimonial_Block.php   # Testimonial
│   │   │   ├── Pricing_Block.php       # Pricing table
│   │   │   └── Team_Block.php          # Team member
│   │   │
│   │   ├── Interactive/                # Interactive blocks
│   │   │   ├── Progress_Block.php      # Progress bar
│   │   │   ├── Counter_Block.php       # Stats counter
│   │   │   ├── Rating_Block.php        # Star rating
│   │   │   ├── Countdown_Block.php     # Countdown timer
│   │   │   └── Form_Block.php          # Enhanced forms
│   │   │
│   │   ├── Media/                      # Media blocks
│   │   │   ├── Gallery_Block.php       # Advanced gallery
│   │   │   ├── Video_Block.php         # Video player
│   │   │   ├── Audio_Block.php         # Audio player
│   │   │   ├── Icon_Block.php          # Icon block
│   │   │   └── Before_After_Block.php  # Before/after images
│   │   │
│   │   └── Navigation/                 # Navigation blocks
│   │       ├── Breadcrumb_Block.php    # Breadcrumbs
│   │       ├── TOC_Block.php           # Table of contents
│   │       ├── Social_Share_Block.php  # Social sharing
│   │       └── Back_To_Top_Block.php   # Back to top
│   │
│   ├── Utilities/                      # Utility classes
│   │   ├── CSS_Generator.php           # ✅ Existing - Enhanced
│   │   ├── Font_Manager.php            # Google Fonts integration
│   │   ├── Icon_Manager.php            # Icon library management
│   │   ├── Animation_Generator.php     # CSS animation generator
│   │   ├── Responsive_Helper.php       # Responsive utilities
│   │   └── Performance_Monitor.php     # Performance tracking
│   │
│   ├── API/                            # REST API endpoints
│   │   ├── Settings_API.php            # Settings endpoints
│   │   ├── Fonts_API.php               # Font loading endpoints
│   │   ├── Icons_API.php               # Icon library endpoints
│   │   └── Templates_API.php           # Block templates
│   │
│   └── Legacy/                         # Backward compatibility
│       ├── Typography_Controls.php     # ✅ Existing - Migrate
│       └── Block_Extensions.php        # ✅ Existing - Migrate
│
├── src/                                # Frontend JavaScript/CSS
│   │
│   ├── toolbar/                        # Main toolbar system
│   │   ├── index.js                    # Toolbar entry point
│   │   ├── Toolbar.js                  # Main toolbar component
│   │   ├── ToolbarProvider.js          # Context provider
│   │   │
│   │   ├── components/                 # Reusable components
│   │   │   ├── ui/                     # Basic UI components
│   │   │   │   ├── Button.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Select.js
│   │   │   │   ├── Slider.js
│   │   │   │   ├── ColorPicker.js
│   │   │   │   ├── TabPanel.js
│   │   │   │   └── IconPicker.js
│   │   │   │
│   │   │   ├── layout/                 # Layout components
│   │   │   │   ├── FloatingPanel.js
│   │   │   │   ├── DockablePanel.js
│   │   │   │   ├── ResizablePanel.js
│   │   │   │   └── CollapsiblePanel.js
│   │   │   │
│   │   │   └── preview/                # Preview components
│   │   │       ├── LivePreview.js
│   │   │       ├── ResponsivePreview.js
│   │   │       └── AnimationPreview.js
│   │   │
│   │   ├── tabs/                       # Individual toolbar tabs
│   │   │   ├── DesignTab.js            # Design controls
│   │   │   ├── TypographyTab.js        # Typography controls
│   │   │   ├── LayoutTab.js            # Layout controls
│   │   │   ├── EffectsTab.js           # Effects & animations
│   │   │   ├── BlocksTab.js            # Custom blocks
│   │   │   └── AdvancedTab.js          # Advanced settings
│   │   │
│   │   ├── controls/                   # Control components
│   │   │   ├── design/                 # Design control components
│   │   │   │   ├── BackgroundControl.js
│   │   │   │   ├── BorderControl.js
│   │   │   │   ├── SpacingControl.js
│   │   │   │   ├── ShadowControl.js
│   │   │   │   └── VisibilityControl.js
│   │   │   │
│   │   │   ├── typography/             # Typography controls
│   │   │   │   ├── FontFamilyControl.js
│   │   │   │   ├── FontSizeControl.js
│   │   │   │   ├── FontWeightControl.js
│   │   │   │   ├── LetterSpacingControl.js
│   │   │   │   └── TextShadowControl.js
│   │   │   │
│   │   │   ├── layout/                 # Layout controls
│   │   │   │   ├── PositionControl.js
│   │   │   │   ├── FlexboxControl.js
│   │   │   │   ├── GridControl.js
│   │   │   │   └── DimensionControl.js
│   │   │   │
│   │   │   └── effects/                # Effects controls
│   │   │       ├── AnimationControl.js
│   │   │       ├── HoverControl.js
│   │   │       ├── FilterControl.js
│   │   │       └── TransformControl.js
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useToolbarState.js      # Toolbar state management
│   │   │   ├── useResponsive.js        # Responsive utilities
│   │   │   ├── useBlockSelection.js    # Block selection handling
│   │   │   ├── useLivePreview.js       # Live preview functionality
│   │   │   └── useKeyboardShortcuts.js # Keyboard shortcuts
│   │   │
│   │   ├── utils/                      # Utility functions
│   │   │   ├── css-generator.js        # CSS generation utilities
│   │   │   ├── responsive-utils.js     # Responsive breakpoint utilities
│   │   │   ├── color-utils.js          # Color manipulation
│   │   │   ├── animation-utils.js      # Animation helpers
│   │   │   └── block-utils.js          # Block manipulation utilities
│   │   │
│   │   └── styles/                     # Toolbar-specific styles
│   │       ├── toolbar.scss            # Main toolbar styles
│   │       ├── tabs.scss               # Tab-specific styles
│   │       ├── controls.scss           # Control component styles
│   │       └── animations.scss         # Animation styles
│   │
│   ├── blocks/                         # Block JavaScript
│   │   ├── shared/                     # Shared block components
│   │   │   ├── BlockControls.js        # Enhanced block controls
│   │   │   ├── InspectorControls.js    # Enhanced inspector
│   │   │   ├── ToolbarControls.js      # Toolbar integration
│   │   │   └── PreviewComponent.js     # Block preview
│   │   │
│   │   ├── content/                    # Content blocks
│   │   │   ├── tabs/                   # ✅ Existing tabs block
│   │   │   │   ├── index.js
│   │   │   │   ├── edit.js
│   │   │   │   ├── save.js
│   │   │   │   ├── block.json
│   │   │   │   └── style.scss
│   │   │   │
│   │   │   ├── accordion/              # Accordion block
│   │   │   ├── testimonial/            # Testimonial block
│   │   │   ├── pricing/                # Pricing table block
│   │   │   └── team/                   # Team member block
│   │   │
│   │   ├── interactive/                # Interactive blocks
│   │   │   ├── progress/               # Progress bar
│   │   │   ├── counter/                # Stats counter
│   │   │   ├── rating/                 # Star rating
│   │   │   ├── countdown/              # Countdown timer
│   │   │   └── form/                   # Enhanced forms
│   │   │
│   │   ├── media/                      # Media blocks
│   │   │   ├── gallery/                # Advanced gallery
│   │   │   ├── video/                  # Video player
│   │   │   ├── audio/                  # Audio player
│   │   │   ├── icon/                   # Icon block
│   │   │   └── before-after/           # Before/after images
│   │   │
│   │   └── navigation/                 # Navigation blocks
│   │       ├── breadcrumb/             # Breadcrumbs
│   │       ├── toc/                    # Table of contents
│   │       ├── social-share/           # Social sharing
│   │       └── back-to-top/            # Back to top
│   │
│   ├── styles/                         # Global styles
│   │   ├── main.scss                   # Main stylesheet entry
│   │   ├── variables/                  # SCSS variables
│   │   │   ├── colors.scss
│   │   │   ├── typography.scss
│   │   │   ├── spacing.scss
│   │   │   └── breakpoints.scss
│   │   │
│   │   ├── mixins/                     # SCSS mixins
│   │   │   ├── responsive.scss
│   │   │   ├── animations.scss
│   │   │   └── utilities.scss
│   │   │
│   │   ├── components/                 # Component styles
│   │   │   ├── buttons.scss
│   │   │   ├── forms.scss
│   │   │   ├── cards.scss
│   │   │   └── modals.scss
│   │   │
│   │   └── blocks/                     # Block-specific styles
│   │       ├── tabs.scss               # ✅ Existing
│   │       ├── accordion.scss
│   │       ├── progress.scss
│   │       └── [other-blocks].scss
│   │
│   ├── utils/                          # Shared utilities
│   │   ├── api.js                      # API communication
│   │   ├── storage.js                  # Local storage management
│   │   ├── validation.js               # Input validation
│   │   ├── formatting.js               # Text/data formatting
│   │   └── constants.js                # Application constants
│   │
│   ├── index.js                        # ✅ Main entry point
│   └── admin.js                        # Admin-specific functionality
│
├── assets/                             # Static assets
│   ├── icons/                          # SVG icons
│   │   ├── toolbar/                    # Toolbar icons
│   │   ├── blocks/                     # Block icons
│   │   └── ui/                         # UI icons
│   │
│   ├── images/                         # Plugin images
│   │   ├── screenshots/                # Plugin screenshots
│   │   ├── logos/                      # Plugin logos
│   │   └── placeholders/               # Placeholder images
│   │
│   └── fonts/                          # Custom fonts (if needed)
│
├── templates/                          # PHP templates
│   ├── blocks/                         # Block render templates
│   │   ├── tabs/                       # ✅ Existing
│   │   │   └── render.php
│   │   ├── accordion/
│   │   │   └── render.php
│   │   └── [other-blocks]/
│   │
│   ├── admin/                          # Admin page templates
│   │   ├── settings.php
│   │   ├── dashboard.php
│   │   └── help.php
│   │
│   └── frontend/                       # Frontend templates
│       └── toolbar-placeholder.php
│
├── languages/                          # Internationalization
│   ├── forjeon.pot                     # Translation template
│   └── [language-files]
│
├── tests/                              # Testing files
│   ├── php/                            # PHP unit tests
│   │   ├── Unit/                       # Unit tests
│   │   ├── Integration/                # Integration tests
│   │   └── bootstrap.php               # Test bootstrap
│   │
│   ├── js/                             # JavaScript tests
│   │   ├── unit/                       # Unit tests
│   │   ├── integration/                # Integration tests
│   │   └── e2e/                        # End-to-end tests
│   │
│   └── fixtures/                       # Test data
│
├── build/                              # Built assets (auto-generated)
│   ├── toolbar/                        # Toolbar assets
│   ├── blocks/                         # Block assets
│   ├── admin/                          # Admin assets
│   └── frontend/                       # Frontend assets
│
└── vendor/                             # Composer dependencies
    └── [php-dependencies]
```

## Key Organizational Principles

### 1. Separation of Concerns
- **PHP Backend** (`includes/`) - Server-side logic, REST APIs, block registration
- **JavaScript Frontend** (`src/`) - React components, toolbar interface, block editors
- **Styles** (`src/styles/`, `assets/`) - SCSS stylesheets organized by component
- **Templates** (`templates/`) - PHP render templates for dynamic blocks

### 2. Modular Architecture
- Each major feature area has its own namespace
- Shared utilities and base classes prevent code duplication
- Clear inheritance hierarchy for blocks and controls

### 3. Scalability
- New blocks can be added easily following the established pattern
- Control systems are modular and reusable
- Toolbar tabs can be extended without affecting others

### 4. Developer Experience
- Clear file naming conventions
- Logical directory structure
- Separation of concerns between backend and frontend

### 5. Build System Integration
- Entry points clearly defined for webpack
- Asset organization supports code splitting
- Development and production build optimization

## Migration Strategy

### Phase 1: Restructure Existing Code
1. Move current files to new locations
2. Update import/export statements
3. Refactor class namespaces
4. Update build configuration

### Phase 2: Implement Base Architecture
1. Create abstract base classes
2. Implement core toolbar infrastructure
3. Set up state management system
4. Create utility functions

### Phase 3: Migrate Existing Features
1. Move typography controls to new system
2. Migrate tabs block to new structure
3. Update CSS generation system
4. Test backward compatibility

### Phase 4: Add New Features
1. Implement new toolbar tabs
2. Add new blocks following established patterns
3. Enhance existing functionality
4. Performance optimization

## Benefits of This Structure

1. **Maintainability** - Clear organization makes code easy to find and modify
2. **Scalability** - Structure supports adding new features without reorganization
3. **Team Development** - Multiple developers can work on different areas without conflicts
4. **Testing** - Modular structure makes unit and integration testing easier
5. **Performance** - Organized asset loading and code splitting opportunities
6. **WordPress Standards** - Follows WordPress plugin development best practices

This structure will support the entire roadmap from basic toolbar to advanced enterprise features while maintaining code quality and developer productivity.