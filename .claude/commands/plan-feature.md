# Plan Feature

Enter planning mode for a new feature. Create a detailed plan before implementation.

## Process

### 1. Clarify Requirements

Before planning, ask clarifying questions:
- What is the user story? (As a [user], I want [action] so that [benefit])
- What are the acceptance criteria?
- Are there any constraints or limitations?
- What's the scope? (What's included vs. excluded)

### 2. Identify Affected Areas

- Which files need to be created?
- Which existing files need modification?
- What dependencies are involved?
- Are there database changes needed?

### 3. Consider Edge Cases

- What happens with invalid input?
- What are the error states?
- How does it handle concurrent access?
- What about empty/null cases?

### 4. Outline Implementation Steps

Create a numbered list of discrete implementation steps:
1. Each step should be independently testable
2. Order steps by dependencies
3. Estimate relative complexity (small/medium/large)

### 5. Identify Risks

- What could go wrong?
- Are there any unknowns to research first?
- What's the rollback plan?

## Output Format

```markdown
## Feature: [Name]

### Requirements
- [Requirement 1]
- [Requirement 2]

### Affected Files
| File | Action | Description |
|------|--------|-------------|
| path/to/file.ts | Create | New component |
| path/to/other.ts | Modify | Add new method |

### Implementation Steps
1. [ ] Step 1 (small)
2. [ ] Step 2 (medium)
3. [ ] Step 3 (small)

### Edge Cases
- [Edge case 1]: [How to handle]
- [Edge case 2]: [How to handle]

### Risks
- [Risk 1]: [Mitigation]

### Questions
- [Any remaining questions for the user]
```

## Important

**Do NOT start implementing until the plan is approved.**

Ask: "Does this plan look good? Any adjustments before I start?"
