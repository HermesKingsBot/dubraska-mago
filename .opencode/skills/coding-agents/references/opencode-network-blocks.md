# OpenCode Network Blocks — Venezuela/IP Reference

## Discovery (2026-06-22)

When configuring OpenCode as a coding agent from a server in Venezuela (or
similar regions), multiple API endpoints are blocked by Cloudflare:

| Service | Endpoint | Error | Cause |
|---------|----------|-------|-------|
| OpenCode Zen | `https://opencode.ai/zen/v1/*` | HTTP 403 error 1010 | Cloudflare IP block |
| OpenCode Go | `https://opencode.ai/zen/go/v1/*` | HTTP 403 error 1010 | Cloudflare IP block |
| OpenRouter | `https://openrouter.ai/api/v1/*` | HTTP 401 | Invalid/expired key (not IP block) |

**Error 1010** = Cloudflare "Access Denied" — the server IP is on a blocklist.
This is NOT a credential problem. The same key works from a different IP.

## Affected Configurations

- Crush (`@charmland/crush`) → OpenCode Zen/Go endpoints
- Direct curl to `api.opencode.ai`
- OpenCode CLI `providers login` command

## Working Alternatives from Venezuela

1. **OpenCode built-in models** (`opencode/deepseek-v4-flash-free`): Uses Grok hosting,
   NOT Cloudflare. Works without API key.
2. **OpenRouter via OpenCode CLI**: `opencode run --model "openrouter/..."` — OpenRouter
   API is not behind Cloudflare, works fine with valid key.
3. **VPN/Proxy**: Route traffic through US/Europe to reach Zen/Go.

## Key Format Quick Reference

- OpenRouter: `sk-or-v1-...`
- OpenCode Zen keys: `sk-...` (different format, non-OpenRouter)
- Expired keys: return HTTP 401 on OpenRouter
