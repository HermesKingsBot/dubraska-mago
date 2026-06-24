# GitHub Code Review

Perform code reviews on local changes before pushing, or review open PRs on GitHub. Most of this skill uses plain `git` — the `gh`/`curl` split only matters for PR-level interactions.

## Prerequisites

- Authenticated with GitHub (see `references/auth.md`)
- Inside a git repository

## 1. Reviewing Local Changes (Pre-Push)

```bash
# Staged changes
git diff --staged

# All changes vs main
git diff main...HEAD

# File names only
git diff main...HEAD --name-only

# Stat summary
git diff main...HEAD --stat
```

### Review Strategy

1. Get the big picture: `git diff main...HEAD --stat && git log main..HEAD --oneline`
2. Review file by file with `read_file` for full context
3. Check for common issues:
   ```bash
   git diff main...HEAD | grep -n "print(\|console\.log\|TODO\|FIXME\|HACK\|XXX\|debugger"
   git diff main...HEAD --stat | sort -t'|' -k2 -rn | head -10  # large files
   git diff main...HEAD | grep -in "password\|secret\|api_key\|token.*=\|private_key"
   git diff main...HEAD | grep -n "<<<<<<\|>>>>>>\|======="  # merge conflict markers
   ```

### Review Output Format

```
## Code Review Summary

### Critical
- **src/auth.py:45** — SQL injection: user input passed directly to query.

### Warnings
- **src/models/user.py:23** — Password stored in plaintext. Use bcrypt or argon2.
- **src/api/routes.py:112** — No rate limiting on login endpoint.

### Suggestions
- **src/utils/helpers.py:8** — Duplicates logic in `src/core/utils.py:34`. Consolidate.
- **tests/test_auth.py** — Missing edge case: expired token test.

### Looks Good
- Clean separation of concerns in the middleware layer
```

## 2. Reviewing a Pull Request on GitHub

```bash
gh pr view 123
gh pr diff 123
gh pr diff 123 --name-only

# Check out locally for full review
git fetch origin pull/123/head:pr-123
git checkout pr-123
# Now use read_file, search_files, run tests, etc.
```

## 3. Leaving Comments on a PR

```bash
# General comment
gh pr comment 123 --body "Overall looks good, a few suggestions below."

# Inline comment
HEAD_SHA=$(gh pr view 123 --json headRefOid --jq '.headRefOid')
gh api repos/$OWNER/$REPO/pulls/123/comments \
  --method POST \
  -f body="This could be simplified with a list comprehension." \
  -f path="src/auth/login.py" \
  -f commit_id="$HEAD_SHA" \
  -f line=45 -f side="RIGHT"
```

## 4. Submitting a Formal Review

```bash
gh pr review 123 --approve --body "LGTM!"
gh pr review 123 --request-changes --body "See inline comments."
gh pr review 123 --comment --body "Some suggestions, nothing blocking."
```

## 5. Review Checklist

- **Correctness**: Edge cases handled, error paths graceful
- **Security**: No hardcoded secrets, input validation, no injection
- **Code Quality**: Clear naming, DRY, single responsibility
- **Testing**: New paths tested, happy + error cases
- **Performance**: No N+1 queries, appropriate caching
- **Documentation**: Public APIs documented, "why" comments present

## 6. Pre-Push Review Workflow

1. `git diff main...HEAD --stat` — scope of changes
2. `git diff main...HEAD` — full diff
3. For each changed file, use `read_file` if you need more context
4. Apply the checklist above
5. Present structured findings; offer to fix critical issues before push

## 7. End-to-End PR Review

1. Set up: `source "${HERMES_HOME:-$HOME/.hermes}/skills/github/references/auth.md"`
2. Gather context: `gh pr view N && gh pr diff N --name-only`
3. Check out: `git fetch origin pull/N/head:pr-N && git checkout pr-N`
4. Read diff: `git diff main...HEAD` (file-by-file for large PRs)
5. Run checks: `python -m pytest 2>&1 | tail -20`, `ruff check . 2>&1 | head -30`
6. Apply review checklist
7. Post review: `gh pr review N --approve/--request-changes ...`
8. Summary comment: `gh pr comment N --body "$(cat <<'EOF'\n## Code Review Summary\n...\nEOF\n)"`
9. Cleanup: `git checkout main && git branch -D pr-N`

## Decision: Approve vs Request Changes vs Comment

- **Approve** — no critical/warning issues, only minor suggestions or all clear
- **Request Changes** — any critical or warning-level issue
- **Comment** — observations and suggestions, nothing blocking
