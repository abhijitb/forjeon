# Forjeon

**Crafted blocks, limitless design.**

A comprehensive WordPress Gutenberg enhancement plugin that transforms your block editor experience. Forjeon provides advanced design controls, professional blocks, and a powerful toolbar interface that rival premium page builders while maintaining WordPress native compatibility.

## 🎯 Vision

Forjeon aims to be the **ultimate Gutenberg enhancement suite** - providing all the advanced features found in premium plugins like EditorPlus, but with superior organization, performance, and user experience through our innovative dedicated toolbar interface.

## 🚀 Features

### ✅ Currently Available (Phase 1.1 Complete)
- **🎨 Forjeon Toolbar** - Floating/draggable toolbar with tabbed interface accessible via header button
- **Advanced Typography Controls** - Fine-tune letter spacing, line height, and text shadows with real-time preview
- **Professional Tabs Block** - Multi-style tabs with responsive accordion behavior and smooth animations
- **Header Integration** - Native WordPress editor header button (🎨 Forjeon) for seamless access
- **Clean Build System** - Zero-warning development environment with optimized Sass configuration

### 🚧 In Development (Phase 1.2-6 Roadmap)
- **Enhanced UI Components** - Design system with tokens, reusable components, and icon integration
- **Advanced Design Controls** - Background, border, spacing, shadow, and visibility controls
- **Layout Management** - Flexbox, Grid, positioning, and responsive controls  
- **Animation System** - Entrance animations, hover effects, scroll triggers, and custom keyframes
- **Professional Block Library** - 20+ blocks including Accordion, Progress, Counter, Rating, Countdown, Gallery+, Video Player, and more
- **Advanced Features** - Custom CSS editor, conditional logic, performance optimization, and global settings

### Developer Experience
- **PSR-4 Autoloading** - Modern PHP standards for clean code organization
- **Modular Architecture** - Extensible plugin structure for easy customization
- **WordPress Coding Standards** - Built-in linting and code quality tools
- **Composer Integration** - Modern dependency management

## 📋 Requirements

- **PHP:** 8.2 or higher
- **WordPress:** 6.5 or higher  
- **Node.js:** 18+ (for development)
- **Modern Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Installation

### Via Composer (Recommended)
```bash
composer require forjeon/forjeon
```

### Manual Installation
1. Download the plugin files
2. Upload to `/wp-content/plugins/forjeon/`
3. Activate the plugin through the 'Plugins' menu in WordPress

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Composer
- PHP 8.2+

### Setup Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forjeon
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Build assets**
   ```bash
   npm run build
   ```

### Development Commands
```bash
# Build for production (zero warnings!)
npm run build

# Development mode with watch
npm run start

# Setup Git hooks for branch protection
npm run setup

# Run tests
composer test

# Run tests with coverage
composer test:coverage

# Lint code
composer lint

# Auto-fix linting issues
composer lint:fix

# Run PHPStan analysis
composer phpstan

# Security check
composer security
```

## 🏗️ Architecture

Forjeon follows a **scalable, modular architecture** designed for maintainability and extensibility:

### Backend Structure (PHP)
```
includes/
├── Core/                      # Core plugin functionality
│   └── Plugin.php            # Main plugin class (singleton)
├── Toolbar/                   # Toolbar backend management
├── Controls/                  # Organized control systems
│   ├── Design/               # Background, border, spacing, shadow
│   ├── Typography/           # Font, size, weight, spacing controls  
│   ├── Layout/               # Position, flexbox, grid, dimensions
│   └── Effects/              # Animations, hover, filters, transforms
├── Blocks/                   # Block PHP handlers
│   ├── Content/              # Tabs, Accordion, Testimonial, Pricing
│   ├── Interactive/          # Progress, Counter, Rating, Countdown
│   ├── Media/                # Gallery, Video, Audio, Icon, Before/After
│   └── Navigation/           # Breadcrumb, TOC, Social, Back-to-Top
├── Utilities/                # Shared utilities
│   ├── CSS_Generator.php    # Dynamic CSS generation
│   ├── Font_Manager.php     # Google Fonts integration
│   └── Performance_Monitor.php # Performance tracking
└── Legacy/                   # Backward compatibility
    ├── Typography_Controls.php # Original typography system
    └── Block_Extensions.php   # Original block extensions
```

### Frontend Structure (JavaScript)
```
src/
├── toolbar/                  # Main toolbar system
│   ├── components/          # Reusable UI components
│   ├── tabs/                # Individual toolbar tabs (Design, Typography, etc.)
│   ├── controls/            # Control components organized by type
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Toolbar utilities
├── blocks/                   # Block JavaScript
│   ├── content/             # Content blocks (tabs, accordion, etc.)
│   ├── interactive/         # Interactive blocks
│   ├── media/               # Media blocks
│   └── navigation/          # Navigation blocks
├── styles/                   # SCSS organization
│   ├── variables/           # Design tokens and variables
│   ├── mixins/              # Reusable SCSS mixins
│   ├── components/          # Component-specific styles
│   └── blocks/              # Block-specific styles
└── utils/                    # Shared JavaScript utilities
```

### Key Architectural Benefits
- **🏗️ Scalable** - Easy to add new blocks, controls, and features
- **🔧 Maintainable** - Clear separation of concerns and logical organization  
- **👥 Team-Friendly** - Multiple developers can work without conflicts
- **⚡ Performance-Optimized** - Code splitting and lazy loading support
- **📏 Standards-Compliant** - Follows WordPress and modern development best practices

## 🎯 Use Cases

### For Site Builders
- Deliver feature-rich, design-flexible sites faster
- Reduce dependency on multiple plugins
- Maintain consistent design across projects

### For Content Creators
- Create engaging layouts without developer help
- Add animations and interactive elements
- Maintain professional appearance

### For Developers
- Extensible plugin architecture with PSR-4 autoloading
- Modern PHP 8.2+ and React 18+ development stack
- Comprehensive testing and code quality tools
- Clean, well-documented, maintainable codebase

## 🗺️ Development Roadmap

### Phase 1: Foundation & Architecture ✅ **COMPLETED**
- [x] Plugin restructure and organization
- [x] Advanced typography controls
- [x] Professional tabs block
- [x] Core toolbar infrastructure ✅
- [x] Floating/dockable toolbar system ✅
- [x] Tab navigation system ✅
- [x] **BONUS**: Header button integration ✅
- [x] **BONUS**: Clean build system ✅

### Phase 2: Core Styling Features
- [ ] Design controls (background, border, spacing, shadow)
- [ ] Enhanced typography with Google Fonts
- [ ] Layout controls (position, flexbox, grid)
- [ ] Real-time preview system

### Phase 3: Interactive Features
- [ ] Animation system (entrance, hover, scroll-triggered)
- [ ] Enhanced block library (accordion, progress, counter, rating)
- [ ] Interactive elements and micro-interactions

### Phase 4: Advanced Content Blocks
- [ ] Media blocks (gallery+, video player, before/after)
- [ ] Content blocks (testimonial, pricing, team, timeline)
- [ ] Navigation blocks (breadcrumb, TOC, social share)

### Phase 5: Professional Features
- [ ] Custom CSS editor with syntax highlighting
- [ ] Conditional logic and dynamic content
- [ ] Performance optimization tools
- [ ] Global settings management

### Phase 6: Enterprise Features
- [ ] Import/export system
- [ ] Design system sharing
- [ ] Team collaboration features
- [ ] Marketplace integration

## 🚀 Getting Started

### Quick Start
1. **Install and activate** the Forjeon plugin
2. **Create a new post/page** and look for the **🎨 Forjeon** button in the editor header
3. **Click the Forjeon button** to open the floating toolbar
4. **Explore typography controls** - Select any text block and use the Typography tab
5. **Add professional blocks** - Insert a Tabs block from the Forjeon category

### Current Features Tour
- **🎨 Forjeon Toolbar** - Click the header button to access a floating, draggable toolbar with tabbed interface
- **Advanced Typography Controls** - Real-time preview for letter spacing, line height, and text shadow adjustments
- **Professional Tabs Block** - Choose from Default, Pills, or Underline styles with responsive accordion behavior
- **Header Integration** - Seamless access via native WordPress editor header button (no sidebar clutter)
- **Drag & Drop Interface** - Move the toolbar anywhere within the viewport for optimal workflow

## 🔌 Configuration

Configuration through WordPress admin settings (coming in Phase 2):

- **Feature Toggles** - Enable/disable specific blocks or controls
- **Design Standards** - Set default typography, spacing, and color schemes  
- **Performance Options** - Control asset loading and optimization
- **Toolbar Settings** - Customize toolbar position, behavior, and appearance

## 🤝 Contributing

We welcome contributions! Key areas for contribution:

- **Feature Development** - Help implement Phase 1-6 roadmap features
- **Testing & QA** - Cross-browser testing, accessibility testing
- **Documentation** - User guides, developer documentation, code examples
- **Design & UX** - Interface improvements, user experience enhancements

### Development Guidelines
- Follow WordPress coding standards
- Use PSR-4 autoloading for PHP classes
- Write comprehensive tests for new features
- Maintain backward compatibility
- **Use feature branches** - No direct commits to main branch
- **Create Pull Requests** for all changes
- **Get code reviews** before merging

## 📄 License

Licensed under **GPL v2 or later** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

- **Plugin Documentation** - See `/docs/` directory for technical documentation
- **Implementation Plan** - See `/docs/IMPLEMENTATION_PLAN.md` for detailed roadmap
- **Plugin Structure** - See `/docs/PLUGIN_STRUCTURE.md` for architecture guide
- **Branch Protection** - See `/docs/BRANCH_PROTECTION.md` for development workflow
- **Issues & Bugs** - Report via GitHub Issues
- **Feature Requests** - Share ideas via GitHub Discussions

## 🏗️ Technical Implementation Details

### Header Button Integration
The Forjeon toolbar is accessed via a **🎨 Forjeon** button integrated directly into the WordPress editor header using DOM manipulation:

- **Target**: `.editor-header__settings` class for precise placement
- **Technology**: React 18 `createRoot` API for modern component mounting
- **Positioning**: First button in the right-side settings area
- **State Sync**: Custom events for toolbar visibility synchronization

### Floating Toolbar System
- **Draggable Interface**: Full viewport drag with boundary detection
- **Responsive Design**: Adapts to different screen sizes and orientations  
- **State Management**: React Context API for centralized state
- **Tab System**: Modular tab architecture for organized controls

### Clean Build Process
- **Zero Warnings**: Optimized webpack configuration with Sass deprecation handling
- **Modern Standards**: ES6+, React 18, WordPress coding standards
- **Performance**: Code splitting and optimized bundle sizes
- **Development**: Hot reload and clean development environment

### Keyboard Shortcuts
- **Alt + F**: Toggle Forjeon toolbar visibility
- **Escape**: Close toolbar when open
- **Click & Drag**: Move toolbar anywhere within viewport

## 🙏 Acknowledgments

- WordPress community for the amazing Gutenberg editor
- Contributors and users who help improve Forjeon
- The open-source community for inspiration and tools

---

**Forjeon** - Empowering WordPress creators with advanced Gutenberg capabilities.
