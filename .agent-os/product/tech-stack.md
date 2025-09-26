# Technical Stack

## Application Framework
- **Framework:** WordPress Plugin (Custom)
- **Language:** PHP 8.2+ (WordPress recommended)
- **Standards:** WordPress Coding Standards (WPCS)

## Database System
- **Primary Database:** MySQL 8.0+ / MariaDB (via WordPress core)
- **Abstraction Layer:** WordPress `$wpdb` + WP_Query

## Frontend Framework
- **JavaScript Framework:** React (latest stable, Gutenberg-compatible)
- **Build Tool:** Vite
- **Import Strategy:** Node.js ES Modules
- **Package Manager:** npm
- **Node Version:** 22 LTS

## Styling & UI
- **CSS Framework:** TailwindCSS 4.0+
- **UI Component Library:** Custom Gutenberg-compatible React components
- **Font Provider:** Google Fonts
- **Icon Library:** Lucide React components

## Infrastructure
- **Application Hosting:** WordPress hosting providers (e.g., DigitalOcean, WP Engine, SiteGround)
- **Database Hosting:** Same as application (managed via WP)
- **Asset Hosting:** WordPress Media Library
- **CDN:** Cloudflare or CloudFront
- **Deployment Solution:** GitHub Actions → WordPress.org SVN / hosting provider

## Development
- **Code Repository URL:** https://github.com/abhijitb/forjeon
- **CI/CD Platform:** GitHub Actions
- **Testing Frameworks:** 
  - **PHP:** PHPUnit (WordPress test suite)
  - **JavaScript:** Jest (via @wordpress/scripts)
- **Linting & Standards:**
  - **PHP:** PHPCS with WordPress Coding Standards
  - **JavaScript:** ESLint via `@wordpress/scripts`
  - **CSS:** Stylelint via `@wordpress/scripts`
- **Pre-Commit Hooks:** Husky + lint-staged (optional)
- **Version Control:** Git + GitHub

