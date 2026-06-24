# GitHub Pull Request Workflow

Complete guide for managing the PR lifecycle. Each section shows the `gh` way first, then the `git` + `curl` fallback.

## Prerequisites

- Authenticated with GitHub (see `references/auth.md`)
- Inside a git repository with a GitHub remote

## Quick Auth Detection

```bash
if command -v gh &>/dev/null && gh auth status &>/dev/null; then
  AUTH=***  AUTH=***  if [ -z "$GITHUB_TOKEN" ]; then
    if _hermes_env="${HERMES_HOME:-$HOME/.hermes}/.env"; [ -f "$_hermes_env" ] && grep -q "^GITHUB_TOKEN=*** "$_hermes_env"; then
      GITHUB_TOKEN=*** "^GITHUB_TOKEN=*** "$_hermes_env" | head -1 | cut -d= -f2 | tr -d '\n\r')
    elif grep -q "github.com" ~/.git-credentials 2>/dev/null; then
      GITHUB_TOKEN=*** "github.com" ~/.git-credentials | head -1 | sed 's|https://[^:]*:\([^@]*\)@.*|\1|')
    fi
  fi
fi
echo "Using: $AUTH"
```

## 1. Branch Creation

```bash
git fetch origin
git checkout main && git pull origin main
git checkout -b feat/add-user-auth
```

Branch naming: `feat/`, `fix/`, `refactor/`, `docs/`, `ci/`

## 2. Making Commits

```bash
git add src/auth.py tests/test_auth.py
git commit -m "feat: add JWT-based user authentication

- Add login/register endpoints
- Add User model with password hashing
- Add auth middleware for protected routes"
```

## 3. Pushing and Creating a PR

```bash
git push -u origin HEAD

# With gh
gh pr create --title "feat: add JWT auth" --body "## Summary\n..."

# With curl
BRANCH=$(git branch --show-current)
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$OWNER/$REPO/pulls \
  -d "{\"title\":\"feat: ...\",\"head\":\"$BRANCH\",\"base\":\"main\"}"
```

## 4. Monitoring CI Status

```bash
gh pr checks
gh pr checks --watch

# With curl
SHA=$(git rev-parse HEAD)
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$OWNER/$REPO/commits/$SHA/status \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['state'])"
```

## 5. Auto-Fixing CI Failures

Loop: check CI → read failure logs → fix code → push → re-check (max 3 attempts).

```bash
gh run list --branch $(git branch --show-current) --limit 5
gh run view <RUN_ID> --log-failed
# Fix with patch/write_file, then:
git add . && git commit -m "fix: resolve CI failure" && git push
```

## 6. Merging

```bash
gh pr merge --squash --delete-branch
gh pr merge --auto --squash --delete-branch  # auto-merge

# With curl
curl -s -X PUT -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$OWNER/$REPO/pulls/$PR_NUMBER/merge \
  -d '{"merge_method":"squash","commit_title":"feat: ..."}'
```

## 7. Complete Workflow Example

```bash
git checkout main && git pull origin main
git checkout -b fix/login-redirect-bug
# (make changes)
git add src/auth/login.py && git commit -m "fix: preserve ?next= after login"
git push -u origin HEAD
gh pr create --title "fix: preserve redirect after login" --body "..."
gh pr checks --watch
gh pr merge --squash --delete-branch
```

## Useful PR Commands

| Action | gh | git + curl |
|--------|-----|-----------|
| List my PRs | `gh pr list --author @me` | `curl .../pulls?state=open` |
| View PR diff | `gh pr diff` | `git diff main...HEAD` |
| Add comment | `gh pr comment N --body "..."` | `curl POST .../issues/N/comments` |
| Request review | `gh pr edit N --add-reviewer user` | `curl POST .../pulls/N/requested_reviewers` |
| Close PR | `gh pr close N` | `curl PATCH .../pulls/N -d '{"state":"closed"}'` |
| Checkout PR | `gh pr checkout N` | `git fetch origin pull/N/head:pr-N && git checkout pr-N` |
