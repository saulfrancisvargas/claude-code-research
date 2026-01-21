# Claude Code Quick Reference

Cheatsheet for common operations and commands.

---

## Built-in Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Enter plan mode (describe without executing) |
| `/auto` | Enable auto-accept for allowed commands |
| `/compact` | Shorter responses, less explanation |
| `/clear` | Clear context, start fresh |
| `/help` | Show help information |

---

## Custom Commands (This Repo)

| Command | Purpose |
|---------|---------|
| `/catch-up` | Resume context from previous sessions |
| `/review` | Code review staged changes |
| `/simplify` | Clean up recently written code |
| `/plan-feature` | Start planning a new feature |
| `/debug` | Structured debugging workflow |
| `/quality-gates` | Run quality checks before PR |
| `/orchestrate` | Large task coordination |
| `/verify` | Post-implementation verification |
| `/status` | Quick project status check |
| `/handoff` | Prepare session handoff notes |
| `/checkpoint` | Create checkpoint before risky changes |
| `/worktree` | Manage git worktrees |

---

## Mode Cheatsheet

| Situation | Mode |
|-----------|------|
| Starting new feature | Plan mode (`/plan`) |
| Executing approved plan | Auto-accept (`/auto`) |
| Sensitive operations | Interactive (default) |
| Quick questions | Compact (`/compact`) |

---

## Prompt Starters

| Need | Prompt |
|------|--------|
| Understand first | "Before implementing, explain your understanding of..." |
| Control scope | "Do ONLY this, nothing else..." |
| Get brevity | "Just the code, no explanation" |
| Course correct | "Keep X but change Y..." |
| Debug | "Let's form hypotheses and test each one..." |
| Review | "Review this code as a senior engineer..." |

---

## Common Git Commands

```bash
# Status check
git status
git log --oneline -10
git diff --staged

# Checkpointing
git stash push -m "checkpoint-description"
git branch checkpoint-description

# Worktrees
git worktree add ../worktree-name -b branch-name
git worktree list
git worktree remove ../worktree-name
```

---

## Workflow Checklist

### Before Starting a Feature
- [ ] Pull latest changes
- [ ] Create feature branch
- [ ] Enter plan mode (`/plan`)
- [ ] Create checkpoint

### Before Committing
- [ ] Run `/review`
- [ ] Run `/simplify`
- [ ] Run `/verify`
- [ ] Check for hardcoded secrets
- [ ] Write descriptive commit message

### End of Session
- [ ] Summarize work (`/handoff`)
- [ ] Update `docs/status.md`
- [ ] Commit all changes
- [ ] Note incomplete tasks

---

## Red Flags (Stop and Reassess)

- Claude is looping (same approach 3+ times)
- Claude is modifying files you didn't mention
- Token usage spiking without progress
- Claude referencing things that don't exist
- You're confused about what Claude did

---

## Context Efficiency Hierarchy

Use in this order (most to least efficient):

1. **CLAUDE.md** - Always loaded (~2500 tokens max)
2. **Skills** - Load when relevant
3. **Commands** - Load when invoked
4. **MCPs** - Tools always present (most expensive)

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`

---

## External Memory Files

| File | Purpose |
|------|---------|
| `docs/status.md` | Current work status |
| `docs/tech-debt.md` | Technical debt tracking |
| `docs/decisions/*.md` | Architecture decisions |

---

## Useful Prompts for Common Tasks

### Bug Fix
```
Current behavior: [what happens]
Expected behavior: [what should happen]
Steps to reproduce: [steps]
Find the root cause and propose a fix before implementing.
```

### New Feature
```
Goal: [what we want]
Acceptance criteria:
- [criterion 1]
- [criterion 2]
Start in plan mode. Don't implement until I approve.
```

### Refactoring
```
Current state: [problem]
Desired state: [goal]
Files to refactor: [list]
Create a checkpoint first. Show plan before executing.
```

---

## Keyboard Shortcuts (Terminal)

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current operation |
| `Ctrl+L` | Clear screen |
| `Up Arrow` | Previous command |
| `Tab` | Autocomplete |

---

## Quick Diagnostics

```bash
# Check Claude version
claude --version

# Check current config
claude config list

# Check usage
claude usage
```
