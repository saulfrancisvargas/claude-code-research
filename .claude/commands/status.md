# Status

Quick project status check - show current state at a glance.

## Gather Information

### Git Status
```bash
git status --short
```

### Current Branch
```bash
git branch --show-current
```

### Recent Commits
```bash
git log --oneline -5
```

### Uncommitted Changes Summary
```bash
git diff --stat
```

### Stashed Changes (if any)
```bash
git stash list
```

## Output Format

```markdown
## Project Status

**Branch:** [current branch name]
**Clean:** Yes/No

### Recent Commits
1. [hash] [message]
2. [hash] [message]
3. [hash] [message]

### Uncommitted Changes
- [X files modified]
- [X files staged]
- [X untracked files]

### Stashes
- [X stashes] or "None"

### Quick Actions
- [ ] Commit staged changes
- [ ] Stage modified files
- [ ] Review uncommitted work
```

## Optional: Read Status File

If `docs/status.md` exists, include a summary:
```bash
head -30 docs/status.md 2>/dev/null
```

## Keep It Brief

This command is for quick orientation. For detailed context, use `/catch-up`.
