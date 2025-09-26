#!/bin/bash

# Setup script to install Git hooks for branch protection.
# Run this script after cloning the repository: ./setup-git-hooks.sh

echo "🔧 Setting up Git hooks for branch protection..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a Git repository. Please run this from the project root."
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-push hook
if [ -f ".githooks/pre-push" ]; then
    cp .githooks/pre-push .git/hooks/pre-push
    chmod +x .git/hooks/pre-push
    echo "✅ Pre-push hook installed successfully"
else
    echo "❌ Error: .githooks/pre-push not found"
    exit 1
fi

# Verify installation
if [ -x ".git/hooks/pre-push" ]; then
    echo "✅ Git hooks setup complete!"
    echo ""
    echo "🛡️  Branch protection is now active:"
    echo "   • Direct pushes to 'main' branch are blocked"
    echo "   • Use feature branches for development"
    echo "   • Create Pull Requests for code review"
    echo ""
    echo "📚 Development workflow:"
    echo "   1. git checkout -b feature/your-feature"
    echo "   2. git commit -m 'Your changes'"
    echo "   3. git push origin feature/your-feature"
    echo "   4. Create Pull Request on GitHub"
else
    echo "❌ Error: Failed to install Git hooks"
    exit 1
fi
