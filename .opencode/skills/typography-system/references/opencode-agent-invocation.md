# OpenCode Agent Invocation — Correct Pattern

## The Right Way

```bash
cd /path/to/project && echo "$(cat /tmp/prompt.txt)" | /opt/data/home/.opencode/bin/opencode run --model opencode/mimo-v2.5-free 2>&1
```

## Key Facts

- `opencode run` takes the prompt as a **positional argument** (the message), NOT via `-f` or `--file`
- `-f` / `--file` is for **attaching files** to the message, not for passing the prompt
- `--dir` sets the working directory (alternative to `cd`)
- `--model` selects the model (e.g., `opencode/mimo-v2.5-free`, `opencode/deepseek-v4-flash-free`)
- The agent reads `.opencode/AGENT.md` in the project directory for its configuration
- No `--data-dir` flag for `run` — that's not a valid flag

## Common Mistakes

| Wrong | Why It Fails |
|-------|--------------|
| `opencode run -f prompt.txt` | `-f` attaches files, doesn't set the prompt |
| `opencode run --data-dir .opencode` | `--data-dir` is not a valid flag for `run` |
| `opencode run "long prompt..."` | Works but breaks with very long prompts (shell arg length) |
| `opencode serve --port 4096` then attach | Overkill for one-shot tasks |

## Monitoring Progress

```bash
# Run in background
terminal(background=true, command="...")

# Check output
process(action="log", session_id="...", limit=50)

# Wait for completion
process(action="wait", session_id="...", timeout=600)
```

## Agent Configuration

The agent reads its instructions from `.opencode/AGENT.md` in the project root. This file defines:
- Code style rules (no semicolons, double quotes, etc.)
- Project conventions (Tailwind v4, GSAP, Framer Motion)
- Component structure
- What the agent should NOT do

For backend work, use a separate `.opencode-backend/` directory with its own `AGENT.md`.
