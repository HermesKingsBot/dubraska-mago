---
name: coding-agents
description: "Autonomous coding agent CLIs: Claude Code, OpenAI Codex, OpenCode, and Hermes Agent. Use for delegating coding tasks to autonomous agents, code review, refactoring, and multi-agent workflows."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [coding-agents, claude-code, codex, opencode, hermes, delegation]
    related_skills: [claude-code, codex, opencode, hermes-agent]
---

# Coding Agents — CLI Delegation

Umbrella for autonomous coding agent CLIs. All support delegating coding tasks, file editing, shell commands, and git workflows.

## When to Use

| Agent | Best For |
|-------|----------|
| **Claude Code** | Full-featured coding, PR review, multi-turn sessions |
| **Codex (OpenAI)** | Quick tasks, CI/CD integration, headless environments |
| **OpenCode** | Lightweight coding, Go projects |
| **Hermes Agent** | Multi-platform, persistent memory, skills system |

## Quick Start

### Claude Code
```bash
npm install -g @anthropic-ai/claude-code
claude -p "Fix the auth bug" --allowedTools "Read,Edit" --max-turns 10
```

### Codex
```bash
npm install -g @openai/codex
codex "Add error handling to API calls" --model o4-mini
```

### OpenCode — `opencode` (real, v1.17.9+)

**Two distinct tools share the "OpenCode" name:**

| Tool | Package | Purpose | Status |
|------|---------|---------|--------|
| **OpenCode** (real) | `opencode` via `curl install | bash` | Open-source coding agent with built-in free models ✅ | **Working** |
| **Crush** (old alias) | `@charmland/crush` via npm | Multi-agent orchestration wrapper | ⚠️ Cloudflare-blocked from some IPs |

**Install OpenCode (real):**
```bash
curl -fsSL https://opencode.ai/install | bash
# Binary at: ~/.opencode/bin/opencode
# Config DB at: ~/.local/share/opencode/opencode.db (SQLite)
export PATH=~/.opencode/bin:$PATH
opencode --version
```

**Built-in free models** (no API key needed — Grok-hosted):
```
opencode/deepseek-v4-flash-free    ✅ reliable for simple tasks
opencode/mimo-v2.5-free            ✅ slightly slower, good quality
opencode/nemotron-3-ultra-free      ⚠️ slow for file exploration
opencode/north-mini-code-free       ⚠️ limited
```

**Usage pattern:**
```bash
cd <project>
opencode run --model "opencode/deepseek-v4-flash-free" "Your task here"
opencode run --model "opencode/mimo-v2.5-free" "Another task"
```

**⚠️ Known limitations:**
- Free models are **slow** for multi-step file exploration (glob + read + edit). Best for single-file edits or focused questions.
- TUI-based providers login (`opencode providers login`) requires interactive PTY — does NOT work with piped input or background processes. No known workaround for headless servers without PTY.
- For complex/deep codebase work, consider writing the changes directly or using a paid provider (OpenRouter key) with `opencode run --model "openrouter/qwen/qwen3-coder:free"`.

### OpenRouter as OpenCode backend

```bash
cd <project>
opencode run --model "openrouter/qwen/qwen3-coder:free" "Task"
opencode run --model "openrouter/nvidia/nemotron-3-super-120b-a12b:free" "Task"
```

Requires `OPENROUTER_API_KEY` env var. Works from any IP (no Cloudflare block).

### Cloudflare-Blocked Endpoints (avoid from Venezuela IPs)

| Provider ID | Endpoint | Status | Notes |
|-------------|----------|--------|-------|
| `opencode-go` | `https://opencode.ai/zen/go/v1` | ❌ Error 1010 | Cloudflare IP block |
| `opencode-zen` | `https://opencode.ai/zen/v1` | ❌ Error 1010 | Cloudflare IP block |
| `opencode` (models) | Built-in | ✅ Works | Uses Grok-hosted models |

The `$OPENCODE_API_KEY` placeholder in providers.json is only relevant for Zen/Go (blocked). The built-in `opencode/deepseek-v4-flash-free` etc. auth through Grok and needs no key.

### Key Validation Pattern

When API keys fail, verify the key format and test before configuring agents:

- **OpenRouter keys** always start with `sk-or-v1-...`. Keys with `sk-` prefix
  (e.g. `sk-XTU...`, `sk-t6Z...`) are NOT OpenRouter — they belong to other
  providers (OpenCode Zen, DeepSeek, etc.)
- **Expired/invalid keys** return HTTP 401 "Missing Authentication header"
  (OpenRouter) or HTTP 403 "error code: 1010" (Cloudflare-blocked endpoints)
- **Quick validation** — test a key with a simple curl before committing to config:
  ```bash
  curl -s -w "\nHTTP:%{http_code}" "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"qwen/qwen3-coder:free","messages":[{"role":"user","content":"hi"}],"max_tokens":5}'
  ```
- If HTTP 401 → key is invalid/expired
- If HTTP 403 with Cloudflare error → IP is blocked (use VPN or different server)
- If HTTP 429 → rate limited (wait or rotate keys)

**Free model rotation for OpenRouter** (when keys have daily rate limits):
12+ free coding models available, all via `openrouter/<model>:free`:
```
qwen/qwen3-coder:free                (480B A35B — best for coding)
qwen/qwen3-next-80b:free             (80B A3B)
google/gemma-4-31b-it:free           (31B — vision-capable)
nvidia/nemotron-3-nano-30b-a3b:free
deepseek/deepseek-chat:free
qwen/qwen3-235b-a22b-instruct-2507:free
nvidia/nemotron-3-super-550b-a55b:free
```

### Key Validation Pattern

When API keys fail, verify the key format and test before configuring agents:

- **OpenRouter keys** always start with `sk-or-v1-...`. Keys with `sk-` prefix
  (e.g. `sk-XTU...`, `sk-t6Z...`) are NOT OpenRouter — they belong to other
  providers (OpenCode Zen, DeepSeek, etc.)
- **Expired/invalid keys** return HTTP 401 "Missing Authentication header"
  (OpenRouter) or HTTP 403 "error code: 1010" (Cloudflare-blocked endpoints)
- **Quick validation** — test a key with a simple curl before committing to config:
  ```bash
  curl -s -w "\nHTTP:%{http_code}" "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"qwen/qwen3-coder:free","messages":[{"role":"user","content":"hi"}],"max_tokens":5}'
  ```
- If HTTP 401 → key is invalid/expired
- If HTTP 403 with Cloudflare error → IP is blocked (use VPN or different server)
- If HTTP 429 → rate limited (wait or rotate keys)

## Common Patterns

1. **Print mode** (`-p`): One-shot tasks, exits when done
2. **Interactive PTY**: Multi-turn sessions via tmux
3. **With `--allowedTools`**: Restrict capabilities for safety
4. **With `--max-turns`**: Prevent runaway loops

## Reference Files

- `references/opencode-network-blocks.md` — Cloudflare IP block patterns by country, key format quick reference, working alternatives from blocked regions
