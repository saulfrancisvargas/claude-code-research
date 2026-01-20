# Worktree

Manage git worktrees for parallel development.

## Commands

### Create
```bash
git worktree add ../worktree-[name] -b [branch]
```

### List
```bash
git worktree list
```

### Cleanup
```bash
git worktree remove ../worktree-[name]
```

## Notes

- Copy .env to new worktrees
- Run `[package manager] install` in new worktrees
- Use different ports for dev servers
