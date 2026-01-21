# Catch Up

Resume context from previous sessions by reviewing project state.

## Steps

1. **Read status file**
   ```bash
   cat docs/status.md
   ```

2. **Check recent commits**
   ```bash
   git log --oneline -20
   ```

3. **Check uncommitted changes**
   ```bash
   git status
   ```

4. **Review recent decisions** (if any exist)
   ```bash
   ls -la docs/decisions/ 2>/dev/null | tail -5
   ```

## Output

Summarize:
- What was completed in previous sessions
- What's currently in progress
- Any blockers or pending decisions
- Recommended next steps

## After Summary

Ask: "Would you like me to update docs/status.md with the current state?"
