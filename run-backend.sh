#!/bin/bash
# OpenCode Backend Agent Launcher
# Usage: bash run-backend.sh "your backend task"
# Model: deepseek-v4-flash-free (fast, free)

OPENCODE_BIN="${OPENCODE_BIN:-/opt/data/home/.opencode/bin/opencode}"
PROJECT_DIR="/opt/data/projects/dubraska-mago"
BACKEND_AGENT_DIR="$HOME/.opencode-backend"

# Set custom config directory for backend agent
export OPENCODE_CONFIG_DIR="$BACKEND_AGENT_DIR"

cd "$PROJECT_DIR" || exit 1

TASK="$1"

if [ -z "$TASK" ]; then
  echo "Usage: bash run-backend.sh \"your backend task\""
  exit 1
fi

echo "═══════════════════════════════════════════"
echo "  OpenCode Backend Agent"
echo "  Model: opencode/deepseek-v4-flash-free"
echo "═══════════════════════════════════════════"

"$OPENCODE_BIN" run --model "opencode/deepseek-v4-flash-free" "$TASK"

echo ""
echo "═══════════════════════════════════════════"
echo "  Backend agent finished"
echo "═══════════════════════════════════════════"
