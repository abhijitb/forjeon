# Forjeon

**Crafted blocks, limitless design.**

A WordPress Gutenberg enhancement plugin that helps site builders, designers, and developers create visually compelling websites by providing advanced blocks, design controls, and styling options missing from the default Gutenberg editor.

## 🚀 Features

### Core Enhancements
- **Advanced Typography Controls** - Fine-tune letter spacing, line height, and text shadows
- **Missing Blocks** - Tabs, Accordion, Icon, Counter, Progress Bar, Countdown Timer
- **Advanced Visual Controls** - Responsive spacing, typography, colors, borders, shadows
- **Shape Dividers** - Built-in SVG dividers for modern layouts
- **Animations** - No-code animations like Fade, Slide, Zoom, Flip
- **Icon Integration** - Insert and style icons inline with text and blocks
- **Custom CSS Editor** - Block-specific or global CSS editing for power users

### Developer Experience
- **PSR-4 Autoloading** - Modern PHP standards for clean code organization
- **Modular Architecture** - Extensible plugin structure for easy customization
- **WordPress Coding Standards** - Built-in linting and code quality tools
- **Composer Integration** - Modern dependency management

## 📋 Requirements

- **PHP:** 8.2 or higher
- **WordPress:** 6.0 or higher
- **Gutenberg:** Built-in (WordPress 5.0+)

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

The plugin follows a modular architecture with clear separation of concerns:

```
forjeon/
├── includes/                    # PHP classes
│   ├── Forjeon_Plugin.php     # Main plugin class
│   ├── Block_Extensions.php   # Gutenberg block enhancements
│   ├── Typography_Controls.php # Typography management
│   └── CSS_Generator.php      # CSS generation utilities
├── src/                        # JavaScript/React components
│   ├── components/            # React components
│   │   ├── AdvancedTypographyPanel.jsx
│   │   ├── LetterSpacingControl.jsx
│   │   ├── LineHeightControl.jsx
│   └── └── TextShadowControl.jsx
│   └── index.js               # Main entry point
└── composer.json              # PHP dependencies
```

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
- Extensible plugin architecture
- Modern PHP standards and tools
- Clean, maintainable codebase

## 🔌 Configuration

The plugin can be configured through WordPress admin settings. Key configuration options include:

- **Feature Toggles** - Enable/disable specific blocks or controls
- **Design Standards** - Set default typography, spacing, and color schemes
- **Performance Options** - Control asset loading and optimization

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Testing requirements
- Pull request process
- Development workflow

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [Link to docs]
- **Issues:** [GitHub Issues](https://github.com/forjeon/forjeon/issues)
- **Discussions:** [GitHub Discussions](https://github.com/forjeon/forjeon/discussions)

## 🙏 Acknowledgments

- WordPress community for the amazing Gutenberg editor
- Contributors and users who help improve Forjeon
- The open-source community for inspiration and tools

---

**Forjeon** - Empowering WordPress creators with advanced Gutenberg capabilities.
