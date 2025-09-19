# Forjeon

**Crafted blocks, limitless design.**

A comprehensive WordPress Gutenberg enhancement plugin that transforms your block editor experience. Forjeon provides advanced design controls, professional blocks, and a powerful toolbar interface that rival premium page builders while maintaining WordPress native compatibility.

## 🎯 Vision

Forjeon aims to be the **ultimate Gutenberg enhancement suite** - providing all the advanced features found in premium plugins like EditorPlus, but with superior organization, performance, and user experience through our innovative dedicated toolbar interface.

## 🚀 Features

### ✅ Currently Available
- **Advanced Typography Controls** - Fine-tune letter spacing, line height, and text shadows with real-time preview
- **Professional Tabs Block** - Multi-style tabs with responsive accordion behavior and smooth animations
- **Enhanced Block Editor** - Integrated sidebar with advanced typography options

### 🚧 In Development (Phase 1-6 Roadmap)
- **Dedicated Toolbar Interface** - Floating/dockable toolbar with organized tabs for all controls
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

### Phase 1: Foundation & Architecture (In Progress)
- [x] Plugin restructure and organization
- [x] Advanced typography controls
- [x] Professional tabs block
- [ ] Core toolbar infrastructure
- [ ] Floating/dockable toolbar system
- [ ] Tab navigation system

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
2. **Create a new post/page** and add a Tabs block from the Forjeon category
3. **Customize typography** using the enhanced controls in the sidebar
4. **Explore styling options** - Multiple tab styles, responsive behavior, and professional animations

### Current Features Tour
- **Enhanced Typography Panel** - Access advanced letter spacing, line height, and text shadow controls through the Forjeon sidebar
- **Professional Tabs Block** - Choose from Default, Pills, or Underline styles with responsive accordion behavior
- **Real-time Preview** - See changes instantly as you adjust typography and styling options

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

## 📄 License

Licensed under **GPL v2 or later** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

- **Plugin Documentation** - See `/docs/` directory for technical documentation
- **Implementation Plan** - See `/docs/IMPLEMENTATION_PLAN.md` for detailed roadmap
- **Plugin Structure** - See `/docs/PLUGIN_STRUCTURE.md` for architecture guide
- **Issues & Bugs** - Report via GitHub Issues
- **Feature Requests** - Share ideas via GitHub Discussions

## 🙏 Acknowledgments

- WordPress community for the amazing Gutenberg editor
- Contributors and users who help improve Forjeon
- The open-source community for inspiration and tools

---

**Forjeon** - Empowering WordPress creators with advanced Gutenberg capabilities.
