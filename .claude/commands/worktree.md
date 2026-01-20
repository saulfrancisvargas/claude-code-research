# Worktree

Manage git worktrees for parallel development. Uses the worktree-manager skill.

## Commands

### Create a Worktree
```
/worktree create [branch-name]
```

Creates a new worktree at `../worktree-[branch-name]`:
1. Creates the git worktree
2. Copies `.env` file (if exists)
3. Runs `npm install`
4. Opens a new terminal with Claude Code

### List Worktrees
```
/worktree list
```

Shows all active worktrees:
```bash
git worktree list
```

### Clean Up a Worktree
```
/worktree cleanup [branch-name]
```

Removes a worktree:
1. Checks for uncommitted changes
2. Removes the worktree directory
3. Optionally deletes the branch

## Examples

**Create worktree for a feature:**
```
/worktree create feature/user-auth
```

**List all worktrees:**
```
/worktree list
```

**Clean up after merging:**
```
/worktree cleanup feature/user-auth
```

## Process Details

### Creating a Worktree

```bash
# 1. Create worktree with new branch
git worktree add ../worktree-[branch] -b [branch]

# 2. Copy environment (if exists)
cp .env ../worktree-[branch]/.env 2>/dev/null || true

# 3. Install dependencies
cd ../worktree-[branch] && npm install

# 4. Launch Claude in new terminal (OS-specific)
```

### Cleaning Up

```bash
# 1. Check for uncommitted changes
cd ../worktree-[branch] && git status

# 2. Remove worktree
git worktree remove ../worktree-[branch]

# 3. Delete branch (optional)
git branch -d [branch]
```

## Port Conflicts

When running multiple dev servers, use different ports:

| Worktree | Port |
|----------|------|
| Main | 3000 |
| worktree-1 | 3001 |
| worktree-2 | 3002 |

```bash
npm run dev -- --port 3001
```

## Best Practices

1. **Independent work only** - Don't create worktrees for tasks that share files
2. **Commit frequently** - Don't lose work when cleaning up
3. **Clean up after merge** - Don't accumulate stale worktrees
4. **Use descriptive branches** - Makes worktrees easier to identify

## Troubleshooting

**"Worktree already exists"**
```bash
git worktree list  # Find existing
git worktree remove ../worktree-[name]  # Remove it
```

**"Branch already exists"**
```bash
git worktree add ../worktree-[name] [existing-branch]  # Use existing branch
```

**"Uncommitted changes"**
```bash
cd ../worktree-[name]
git add . && git commit -m "WIP: saving work"
# Then cleanup
```
