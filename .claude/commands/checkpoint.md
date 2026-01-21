# Checkpoint

Create a checkpoint before making risky changes. Allows easy rollback if things go wrong.

## When to Use

- Before large refactors
- Before risky operations
- Before experimental changes
- When trying something you're not sure about

## Create Checkpoint

### Option 1: Git Stash (for uncommitted changes)
```bash
git stash push -m "checkpoint-[timestamp]-[description]"
```

### Option 2: Git Branch (for committed state)
```bash
git branch checkpoint-[timestamp]-[description]
```

### Option 3: Git Tag (for important milestones)
```bash
git tag -a checkpoint-[timestamp] -m "[description]"
```

## Checkpoint Naming

Use descriptive names:
- `checkpoint-2026-01-20-before-auth-refactor`
- `checkpoint-2026-01-20-pre-database-migration`
- `checkpoint-2026-01-20-working-state`

## Process

1. **Verify current state**
   ```bash
   git status
   npm test  # Ensure tests pass
   ```

2. **Create the checkpoint**
   Choose the appropriate method based on situation:
   - Uncommitted changes → stash
   - Committed state → branch
   - Major milestone → tag

3. **Confirm creation**
   ```bash
   git stash list  # or
   git branch -a   # or
   git tag -l
   ```

4. **Proceed with risky changes**
   Now you can safely experiment.

## Restore Checkpoint

### From Stash
```bash
git stash pop  # Apply and remove from stash
# or
git stash apply stash@{0}  # Apply but keep in stash
```

### From Branch
```bash
git checkout checkpoint-[name]
# or
git reset --hard checkpoint-[name]  # Warning: discards changes
```

### From Tag
```bash
git checkout checkpoint-[name]
```

## Output Format

```markdown
## Checkpoint Created

**Type:** Stash/Branch/Tag
**Name:** checkpoint-[timestamp]-[description]
**State:**
- Tests: Passing/Failing
- Uncommitted changes: Yes/No

**To restore:**
[Appropriate restore command]

**Proceed with caution.** You can now make risky changes.
```

## Rules

- Always verify tests pass before checkpointing
- Use descriptive names
- Don't accumulate too many checkpoints - clean up when no longer needed
