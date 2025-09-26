# Branch Protection Setup Guide

## GitHub Branch Protection Rules

To protect the `main` branch from direct commits and pushes:

### 1. Repository Settings Method

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar
4. Click **Add rule** next to "Branch protection rules"
5. Configure the following settings:

#### Branch Name Pattern
```
main
```

#### Protection Settings
- ✅ **Restrict pushes that create files larger than 100MB**
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1` (or more)
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Add status checks: `CI/CD`, `Tests`, `Linting` (if you have them)
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (optional but recommended)
- ✅ **Require linear history** (optional)
- ✅ **Include administrators** (applies rules to admins too)
- ✅ **Restrict pushes to specific people or teams** (optional)
- ✅ **Allow force pushes to matching branches**: ❌ **Disabled**
- ✅ **Allow deletions**: ❌ **Disabled**

### 2. API Method (for automation)

You can also set this up programmatically using GitHub API:

```bash
curl -X PUT \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": ["continuous-integration", "tests"]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false
  }'
```

## Benefits

With these settings enabled:

- ✅ No direct commits to `main` branch
- ✅ All changes must go through Pull Requests
- ✅ Code review is mandatory
- ✅ Status checks must pass (CI/CD, tests, linting)
- ✅ Force pushes and deletions are prevented
- ✅ Branch must be up-to-date before merging

## Development Workflow

After protection is enabled, the workflow becomes:

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to feature branch: `git push origin feature/new-feature`
4. Create Pull Request on GitHub
5. Wait for reviews and status checks
6. Merge through GitHub interface (squash/merge/rebase)

## Local Development

Developers will need to work with feature branches:

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Work on feature
git add .
git commit -m "Your changes"
git push origin feature/your-feature-name

# Create PR through GitHub web interface
# After PR is merged, clean up
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```
