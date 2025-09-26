# Branch Protection & Development Workflow

This document outlines the branch protection strategy for the Forjeon WordPress plugin to maintain code quality and prevent direct commits to the main branch.

## 🛡️ Protection Strategy

### 1. Repository Level Protection (GitHub)

The `main` branch is protected at the repository level with the following rules:

- ❌ **No direct pushes** to main branch
- ✅ **Pull Request required** for all changes
- ✅ **Code review mandatory** (minimum 1 approval)
- ✅ **Status checks must pass** (CI/CD, tests, linting)
- ✅ **Branch must be up-to-date** before merging
- ❌ **Force pushes disabled**
- ❌ **Branch deletion disabled**

### 2. Local Git Hooks

Pre-push hooks prevent accidental direct pushes to main:

- **Location**: `.githooks/pre-push`
- **Auto-setup**: Runs during `npm install` (postinstall script)
- **Manual setup**: `npm run setup` or `./setup-git-hooks.sh`

### 3. Automated CI/CD Checks

GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

- ✅ **PHP Linting** (WordPress Coding Standards)
- ✅ **Static Analysis** (PHPStan)
- ✅ **Unit Tests** with coverage
- ✅ **Security Checks**
- ✅ **JavaScript Build** verification
- ✅ **Multi-version testing** (PHP 8.2+, Node 18+)

## 🔄 Development Workflow

### For New Features

```bash
# 1. Start from main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... code, commit, code, commit ...

# 4. Push feature branch
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub
# - Add description and context
# - Request reviewers
# - Link to issues if applicable

# 6. After PR approval and merge
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

### For Bug Fixes

```bash
# 1. Create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/issue-description

# 2. Fix the bug
# ... make minimal, focused changes ...

# 3. Push and create PR
git push origin hotfix/issue-description
# Create PR with "fixes #issue-number" in description

# 4. After merge, clean up
git checkout main
git pull origin main
git branch -d hotfix/issue-description
```

### For Documentation

```bash
# 1. Create docs branch
git checkout main
git pull origin main
git checkout -b docs/update-description

# 2. Update documentation
# ... edit README, docs, comments ...

# 3. Push and create PR
git push origin docs/update-description
```

## 🚨 Emergency Procedures

### Hotfix for Production Issues

If you need to push directly to main for critical issues:

```bash
# Option 1: Bypass local hook (NOT RECOMMENDED)
git push --no-verify origin main

# Option 2: Temporary disable GitHub protection
# 1. Go to GitHub repo settings
# 2. Temporarily disable branch protection
# 3. Push critical fix
# 4. Re-enable protection immediately
```

### Repository Maintenance

For repository maintenance tasks:

```bash
# Create maintenance branch
git checkout -b maintenance/task-description

# Perform maintenance
# ... version bumps, dependency updates, etc ...

# Follow normal PR process
git push origin maintenance/task-description
```

## 📋 Pull Request Guidelines

### PR Title Format

```
type(scope): description

Examples:
- feat(toolbar): add new typography controls
- fix(tabs): resolve responsive accordion issue
- docs(readme): update installation instructions
- chore(deps): update WordPress dependencies
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Checklist
- [ ] Code follows WordPress coding standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new linting errors
```

### Code Review Checklist

Reviewers should check:

- ✅ **Code Quality**: Follows WordPress standards
- ✅ **Functionality**: Changes work as expected
- ✅ **Performance**: No performance regressions
- ✅ **Security**: No security vulnerabilities
- ✅ **Documentation**: Updated if needed
- ✅ **Tests**: Adequate test coverage
- ✅ **Backwards Compatibility**: No breaking changes

## 🔧 Setup Instructions

### For New Team Members

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd forjeon
   ```

2. **Install dependencies** (auto-runs hook setup)
   ```bash
   npm install
   composer install
   ```

3. **Verify protection is active**
   ```bash
   # This should fail with protection message
   git push origin main
   ```

### Manual Hook Setup

If automatic setup fails:

```bash
# Make setup script executable
chmod +x setup-git-hooks.sh

# Run setup
./setup-git-hooks.sh

# Or use npm script
npm run setup
```

## 🛠️ Troubleshooting

### "Direct pushes to main are not allowed"

**Problem**: Getting blocked when trying to push to main.
**Solution**: This is working correctly! Create a feature branch instead.

```bash
git checkout -b feature/your-changes
git push origin feature/your-changes
```

### CI/CD Checks Failing

**Problem**: Pull Request checks are failing.
**Solution**: Fix the issues locally before merging.

```bash
# Run checks locally
composer lint          # PHP linting
composer phpstan       # Static analysis
composer test          # Unit tests
npm run build          # JavaScript build
```

### Hook Setup Fails

**Problem**: Git hooks not installing properly.
**Solution**: Manual installation.

```bash
# Check if .git directory exists
ls -la .git

# Copy hook manually
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## 📊 Monitoring & Metrics

### Branch Protection Status

Check protection status:
- **GitHub**: Repository Settings → Branches
- **Local**: Try pushing to main (should be blocked)
- **CI/CD**: Check Actions tab for workflow status

### Development Metrics

Track these metrics for healthy development:

- **PR Review Time**: Target < 24 hours
- **CI/CD Success Rate**: Target > 95%
- **Direct Push Attempts**: Should be 0
- **Branch Coverage**: All features developed in branches

## 🎯 Best Practices

### Branch Naming

```bash
# Features
feature/add-animation-controls
feature/implement-grid-layout

# Bug fixes
fix/tabs-responsive-issue
hotfix/critical-toolbar-crash

# Documentation
docs/update-api-reference
docs/add-contributing-guide

# Maintenance
chore/update-dependencies
maintenance/clean-unused-code
```

### Commit Messages

Follow conventional commits:

```bash
git commit -m "feat(toolbar): add drag and drop functionality"
git commit -m "fix(tabs): resolve accordion responsive behavior"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(typography): add unit tests for spacing controls"
```

### Code Review

- **Be thorough but kind** in reviews
- **Test the changes** locally when possible
- **Ask questions** if something is unclear
- **Suggest improvements** constructively
- **Approve promptly** when ready

## 📚 Additional Resources

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

---

**Remember**: Branch protection is about maintaining code quality and enabling collaboration, not restricting development. When in doubt, create a branch and open a PR! 🚀
