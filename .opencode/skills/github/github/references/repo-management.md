# GitHub Repository Management

Create, clone, fork, configure, and manage GitHub repositories. Each section shows `gh` first, then `git` + `curl` fallback.

## Prerequisites

- Authenticated with GitHub (see `references/auth.md`)

## Setup

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

REMOTE_URL=$(git remote get-url origin)
OWNER_REPO=$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/]||; s|\.git$||')
OWNER=$(echo "$OWNER_REPO" | cut -d/ -f1)
REPO=$(echo "$OWNER_REPO" | cut -d/ -f2)
```

## 1. Cloning Repositories

```bash
git clone https://github.com/owner/repo-name.git
git clone --depth 1 https://github.com/owner/repo-name.git  # shallow
gh repo clone owner/repo-name  # with gh
```

## 2. Creating Repositories

```bash
gh repo create my-project --public --clone
gh repo create my-project --private --description "Desc" --license MIT --clone
gh repo create my-project --source . --public --push  # from existing dir

# Via API
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user/repos \
  -d '{"name":"my-project","private":false,"auto_init":true,"license_template":"mit"}'
```

## 3. Forking

```bash
gh repo fork owner/repo-name --clone

# Via API
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo-name/forks
sleep 3
git clone https://github.com/$GH_USER/repo-name.git
git remote add upstream https://github.com/owner/repo-name.git
```

## 4. Repository Information

```bash
gh repo view owner/repo-name
gh search repos "query" --language python --sort stars

# Via API
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$OWNER/$REPO | python3 -c "
import sys, json
r = json.load(sys.stdin)
print(f\"{r['full_name']} | ★{r['stargazers_count']} | {r.get('language','')} | {r.get('description','')}\")"
```

## 5. Repository Settings

```bash
gh repo edit --description "New" --visibility public
gh repo edit --default-branch main --enable-auto-merge
gh repo edit --add-topic "python,automation"
```

## 6. Branch Protection

```bash
curl -s -X PUT -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$OWNER/$REPO/branches/main/protection \
  -d '{
    "required_status_checks": {"strict": true, "contexts": ["ci/test"]},
    "enforce_admins": false,
    "required_pull_request_reviews": {"required_approving_review_count": 1},
    "restrictions": null
  }'
```

## 7. Secrets Management (GitHub Actions)

```bash
gh secret set API_KEY --body "value"
gh secret list
gh secret delete API_KEY
```

## 8. Releases

```bash
gh release create v1.0.0 --title "v1.0.0" --generate-notes
gh release create v1.0.0 ./dist/binary --title "v1.0.0" --notes "Release notes"
gh release download v1.0.0 --dir ./downloads
```

## 9. GitHub Actions Workflows

```bash
gh workflow list
gh run list --limit 10
gh run view <RUN_ID> --log-failed
gh run rerun <RUN_ID>
gh run rerun <RUN_ID> --failed
gh workflow run ci.yml --ref main
```

## 10. Gists

```bash
gh gist create script.py --public --desc "Useful script"
gh gist list
```

## Quick Reference Table

| Action | gh | git + curl |
|--------|-----|-----------|
| Clone | `gh repo clone o/r` | `git clone https://github.com/o/r.git` |
| Create repo | `gh repo create name --public` | `curl POST /user/repos` |
| Fork | `gh repo fork o/r --clone` | `curl POST /repos/o/r/forks` |
| Repo info | `gh repo view o/r` | `curl GET /repos/o/r` |
| Edit settings | `gh repo edit --...` | `curl PATCH /repos/o/r` |
| Create release | `gh release create v1.0` | `curl POST /repos/o/r/releases` |
| List workflows | `gh workflow list` | `curl GET /repos/o/r/actions/workflows` |
| Rerun CI | `gh run rerun ID` | `curl POST /repos/o/r/actions/runs/ID/rerun` |
| Set secret | `gh secret set KEY` | `curl PUT /repos/o/r/actions/secrets/KEY` |
