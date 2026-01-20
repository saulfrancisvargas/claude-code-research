# Verify

Run verification after implementation to ensure everything works correctly.

## Verification Steps

### 1. Build Check
```bash
npm run build
```
- [ ] Build succeeds without errors
- [ ] No new warnings introduced

### 2. Test Suite
```bash
npm test
```
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Edge cases covered

### 3. Manual Verification

For the feature/fix just implemented:

1. **Happy path** - Does the main use case work?
2. **Edge cases** - What about boundary conditions?
3. **Error states** - Do errors handle gracefully?
4. **Regression** - Did we break anything else?

### 4. Code Review Self-Check

Review the changes made:
```bash
git diff HEAD~1
```

- [ ] Changes are minimal and focused
- [ ] No debug code left behind
- [ ] No hardcoded values that should be config
- [ ] Naming is clear and consistent

### 5. Integration Check

If applicable:
- [ ] API contracts unchanged (or versioned)
- [ ] Database migrations run correctly
- [ ] Environment variables documented

## Output Format

```markdown
## Verification Results

### Build: PASS/FAIL
[Details if failed]

### Tests: PASS/FAIL
- X tests passing
- X new tests added
[Details if failed]

### Manual Verification: PASS/FAIL
- [x] Happy path works
- [x] Edge cases handled
- [x] Error states graceful
[Details if failed]

### Code Review: PASS/ATTENTION
[Any concerns noted]

## Overall Status
[ ] Verified - Ready to commit
[ ] Issues Found - See details above

## Next Steps
[Recommended next actions]
```

## If Issues Found

1. Document the issue clearly
2. Assess severity (blocker vs. minor)
3. Fix critical issues before proceeding
4. Re-run verification after fixes
