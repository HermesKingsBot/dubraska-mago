---
name: kanban
description: "Multi-agent Kanban work queue: orchestrator decomposition, worker lifecycle, task management, and recovery. Use for multi-profile agent coordination, durable task tracking, and parallel work routing."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [kanban, multi-agent, orchestration, collaboration, workflow]
    related_skills: [kanban-orchestrator, kanban-worker]
---

# Kanban — Multi-Agent Work Queue

Umbrella for Kanban-based multi-agent coordination. Two roles:

## Roles

| Role | Description |
|------|-------------|
| **Orchestrator** | Decomposes work, creates tasks, routes to specialists, never executes |
| **Worker** | Claims tasks, executes work, reports back via kanban_complete/block |

## When to Use Kanban (vs delegate_task)

- Work should survive a crash or restart
- Multiple specialists needed
- Human-in-the-loop at any step
- Parallel subtasks can fan out
- Audit trail matters

Use `delegate_task` for quick one-shot reasoning subtasks instead.

## Quick Reference

### Orchestrator
1. Discover available profiles: `hermes profile list`
2. Decompose into 2-5 independent feasibility questions
3. Create tasks with `kanban_create(assignee=...)`
4. Link dependencies with `parents=[...]`
5. Report graph to user

### Worker
1. `kanban_show` first — check task state
2. Work in `$HERMES_KANBAN_WORKSPACE`
3. `kanban_complete(summary=..., metadata=..., created_cards=[...])`
4. Block with `kanban_block(reason=...)` + `kanban_comment(body=...)` for human input
5. Never use `delegate_task` or `clarify` — use kanban tools for cross-agent work

## Task States
`todo` → `ready` → `running` → `done` / `blocked`

## Recovery
- Stuck worker: `hermes kanban reclaim <task_id>`
- Reassign: `hermes kanban reassign <task_id> <new-profile>`
- Change model: edit profile config, then reclaim
