# Documentation

This folder serves as **external memory** for Claude Code sessions. Since Claude's context resets between sessions, these files persist important information.

## Files

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `status.md` | Current work status and session context | Every session |
| `tech-debt.md` | Known technical debt items | When debt is identified |
| `decisions/` | Architecture Decision Records | When decisions are made |

## How Claude Uses This Folder

### Session Start
When starting a new Claude session, use `/catch-up` to:
1. Read `status.md` for last known state
2. Check recent git commits
3. Review any recent decisions

### Session End
Before ending a session, use `/handoff` to:
1. Update `status.md` with progress
2. Document any decisions made
3. Note incomplete work and next steps

## Best Practices

### status.md
- Keep it current - update every session
- Be concise - not a novel, just key points
- Include blockers - they're easy to forget
- Note context - what the next session needs to know

### tech-debt.md
- Add items when you notice them
- Include severity and location
- Link to related issues if applicable
- Review periodically to prioritize fixes

### decisions/
- Create a new file for significant decisions
- Use the template format
- Date in filename: `YYYY-MM-DD-topic.md`
- Keep decisions focused - one decision per file

## File Templates

### status.md Structure
```markdown
# Project Status
## Last Updated
## Current Focus
## In Progress
## Completed Recently
## Blockers
## Context for Next Session
```

### tech-debt.md Structure
```markdown
# Technical Debt
## Critical
## High Priority
## Medium Priority
## Low Priority
```

### Decision Record Structure
```markdown
# [Number]. [Title]
## Status
## Context
## Decision
## Consequences
```

## Why External Memory Matters

Claude doesn't remember previous conversations. Without external memory:
- Context is lost between sessions
- Decisions get made differently each time
- Progress tracking is manual
- Onboarding takes longer

With external memory:
- Sessions pick up where they left off
- Decisions are documented and consistent
- Progress is tracked automatically
- Team members can see project state
