# Conventional Commits

## Format

```
<type>(<scope>): <short description>

Longer explanation if needed. Wrap at 72 characters.

Closes #<issue-number>
```

## Types

| Type | Meaning |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring without behavior change |
| `docs` | Documentation changes |
| `test` | Adding or fixing tests |
| `ci` | CI/CD changes |
| `chore` | Maintenance, dependencies, etc. |
| `perf` | Performance improvement |

## Rules

- Use imperative mood: "add" not "adds" or "added"
- Don't capitalize first letter
- No period at the end of subject line
- Subject line ≤ 72 characters
- Separate subject from body with blank line
- Wrap body at 72 characters

## Examples

```
feat: add JWT-based user authentication

- Add login/register endpoints
- Add User model with password hashing
- Add auth middleware for protected routes
- Add unit tests for auth flow

Closes #42
```

```
fix: preserve redirect URL after login

Previously all users were redirected to /dashboard after login,
ignoring the ?next= query parameter. Now the redirect respects
the parameter when present.

Closes #18
```
