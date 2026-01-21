# Handoff

Prepare handoff notes before ending a session or handing work to someone else.

## Gather Context

### What was accomplished?
Review the session's work:
```bash
git log --oneline -10
git diff --stat HEAD~5
```

### What's in progress?
Check uncommitted work:
```bash
git status
git diff --stat
```

### What decisions were made?
List any architectural or design decisions from this session.

## Handoff Document Structure

Create or update `docs/status.md`:

```markdown
# Project Status

## Last Updated
[Current date and time]

## Session Summary
[2-3 sentence overview of what was done]

## Completed
- [x] [Task 1 that was finished]
- [x] [Task 2 that was finished]

## In Progress
- [ ] [Task 1 in progress] - [current state/next step]
- [ ] [Task 2 in progress] - [current state/next step]

## Blockers
- [Blocker 1, if any] - [what's needed to unblock]

## Decisions Made
- [Decision 1]: [Brief explanation and rationale]
- [Decision 2]: [Brief explanation and rationale]

## Context for Next Session
- [Important thing to know #1]
- [Important thing to know #2]
- [Where to pick up / what to do next]

## Files Changed
[List key files that were modified]

## Notes
[Any other relevant information]
```

## Actions

1. **Summarize** the session's work
2. **Update** `docs/status.md` with the handoff notes
3. **Commit** uncommitted work (if ready)
4. **List** any pending tasks

## Output

After preparing:
1. Show the handoff summary
2. Ask: "Should I commit the current changes before ending?"
3. Confirm `docs/status.md` is updated
