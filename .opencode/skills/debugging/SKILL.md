---
name: debugging
description: "Systematic debugging and test-driven development: root cause investigation, RED-GREEN-REFACTOR cycle, and bug prevention. Use when investigating bugs, fixing issues, or enforcing test-first development."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [debugging, testing, tdd, troubleshooting, root-cause, quality]
    related_skills: [systematic-debugging, test-driven-development]
---

# Debugging & TDD — Systematic Development

Umbrella for systematic debugging and test-driven development. Two core practices:

## 1. Systematic Debugging

4-phase root cause investigation. **Never fix before understanding.**

### Phase 1: Root Cause Investigation
- Read error messages carefully
- Reproduce consistently
- Check recent changes (git diff, git log)
- Gather evidence (logs, state, data flow)
- Trace upstream to find the source

### Phase 2: Pattern Analysis
- Find working examples in the codebase
- Compare against references
- Identify differences

### Phase 3: Hypothesis and Testing
- Form a single hypothesis
- Test minimally (one variable at a time)
- Verify before continuing

### Phase 4: Implementation
- Create failing test case
- Fix root cause (not symptom)
- Verify fix + no regressions
- **Rule of 3**: If 3+ fixes failed, question the architecture

## 2. Test-Driven Development

**The Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.

### Red-Green-Refactor Cycle
1. **RED** — Write one minimal failing test
2. **Verify RED** — Watch it fail (mandatory)
3. **GREEN** — Write simplest code to pass
4. **Verify GREEN** — Run full suite, no regressions
5. **REFACTOR** — Clean up, keep tests green
6. **Repeat** — Next failing test

### Rules
- Delete code written before tests — start fresh
- One behavior per test
- Real code, not mocks (unless unavoidable)
- Tests answer "what should this do?" not "what does this do?"

## Common Rationalizations (all false)

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30s. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Emergency, no time" | Systematic is faster than guess-and-check. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. |
| "Already manually tested" | Ad-hoc ≠ systematic. |
