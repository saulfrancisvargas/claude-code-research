# Simplify

Clean up and simplify recently written code while preserving functionality.

## Target

Review files modified in the current session or recent commits:
```bash
git diff --name-only HEAD~3
```

## Simplification Checklist

1. **Remove redundant code**
   - Unused variables and imports
   - Dead code paths
   - Duplicate logic

2. **Consolidate duplicate logic**
   - Extract common patterns into functions
   - Reduce copy-paste code

3. **Improve naming**
   - Make variable names descriptive
   - Use consistent naming conventions
   - Rename unclear functions

4. **Simplify conditionals**
   - Flatten nested if statements
   - Use early returns
   - Replace complex conditions with named functions

5. **Extract utilities if appropriate**
   - Only if used in multiple places
   - Don't over-abstract

## Rules

- **Keep functionality identical** - No behavior changes
- **Show diffs** before applying changes
- **Don't over-engineer** - Simple is better
- **Preserve tests** - All tests must still pass

## Output Format

For each suggested change:

```markdown
### [File:Line Range]

**Before:**
[code snippet]

**After:**
[simplified code]

**Why:** [Brief explanation]
```

## After Review

Ask: "Apply these simplifications?" before making changes.
