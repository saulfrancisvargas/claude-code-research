# Architecture Decision Records (ADRs)

This folder contains Architecture Decision Records - documents that capture important architectural decisions along with their context and consequences.

## Why ADRs?

- **Memory**: Claude doesn't remember previous conversations. ADRs capture decisions permanently.
- **Consistency**: Team members can see why decisions were made.
- **Onboarding**: New developers understand the reasoning behind the architecture.
- **Reversibility**: When reconsidering a decision, you can see the original context.

## When to Write an ADR

Write an ADR when you make a decision that:
- Affects the overall architecture
- Is difficult to reverse
- Was debated among options
- Team members might question later
- Took significant research or discussion

## ADR Lifecycle

| Status | Meaning |
|--------|---------|
| **Proposed** | Under discussion, not yet decided |
| **Accepted** | Decision has been made and is active |
| **Deprecated** | No longer recommended but still in use |
| **Superseded** | Replaced by a newer decision |

## File Naming

Use this format: `YYYY-MM-DD-brief-title.md`

Examples:
- `2026-01-20-use-postgres-for-primary-database.md`
- `2026-01-15-adopt-react-query-for-server-state.md`
- `2026-01-10-authentication-with-jwt.md`

## Template

See `TEMPLATE.md` for the standard ADR format.

## Quick Reference

```markdown
# [Number]. [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by [link]]

## Context
[Why we need to make this decision]

## Decision
[What we decided]

## Consequences
[What this means going forward]
```

## Tips for Writing Good ADRs

1. **Be concise** - ADRs should be quick to read
2. **Focus on why** - The decision itself is less important than the reasoning
3. **List alternatives** - Show what else was considered
4. **Note trade-offs** - Every decision has downsides
5. **Keep it current** - Update status when decisions change
