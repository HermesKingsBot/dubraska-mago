#!/bin/bash
# OpenCode Frontend Agent Launcher
# Usage: bash run-frontend.sh "your task description"

export PATH=/opt/data/home/.opencode/bin:$PATH

TASK="$1"
MODEL="opencode/mimo-v2.5-free"

if [ -z "$TASK" ]; then
  echo "Usage: bash run-frontend.sh \"your task description\""
  exit 1
fi

cd /opt/data/projects/dubraska-mago

opencode run --model "$MODEL" "$TASK"
