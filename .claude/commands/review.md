# Code Review

Review staged changes for code quality, style, and potential issues.

## Review Target

```bash
git diff --staged
```

If nothing is staged, review unstaged changes:
```bash
git diff
```

## Checklist

### Code Quality
- [ ] Functions are small and single-purpose
- [ ] Variable names are clear and descriptive
- [ ] No magic numbers (use constants)
- [ ] No commented-out code
- [ ] DRY principle followed

### Type Safety (TypeScript/JavaScript)
- [ ] No `any` types
- [ ] Proper null/undefined handling
- [ ] Async/await used correctly

### Error Handling
- [ ] Errors are caught and handled appropriately
- [ ] User-facing errors are friendly
- [ ] No silent failures

### Security
- [ ] No hardcoded secrets or credentials
- [ ] User input is validated
- [ ] SQL queries use parameterization
- [ ] No XSS vulnerabilities

### Testing
- [ ] New code has tests
- [ ] Edge cases are covered
- [ ] Tests are meaningful (not just coverage)

### Performance
- [ ] No obvious N+1 queries
- [ ] No unnecessary re-renders (React)
- [ ] Large loops are optimized

## Output Format

```markdown
## Summary
[1-2 sentence overview of the changes]

## Issues Found

### Critical (must fix)
- [Issue]: [File:Line] - [Explanation]

### Warnings (should fix)
- [Issue]: [File:Line] - [Explanation]

### Suggestions (nice to have)
- [Suggestion]: [File:Line] - [Explanation]

## Verdict
[ ] Approved - Ready to commit
[ ] Needs Changes - Address critical issues first
```
