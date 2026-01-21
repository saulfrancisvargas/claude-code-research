# Quality Gates

Run quality verification checks before creating a PR or merging.

## Gates to Run

Execute each gate and report pass/fail status.

### Gate 1: Lint Check
```bash
npm run lint
```
- [ ] Pass - No lint errors
- [ ] Fail - Has lint errors (list them)

### Gate 2: Type Check
```bash
npm run build
# or: npx tsc --noEmit
```
- [ ] Pass - No type errors
- [ ] Fail - Has type errors (list them)

### Gate 3: Test Suite
```bash
npm test
```
- [ ] Pass - All tests pass
- [ ] Fail - Tests failing (list them)

### Gate 4: Security Scan
```bash
npm audit --audit-level=high
```
- [ ] Pass - No high/critical vulnerabilities
- [ ] Fail - Has vulnerabilities (list them)

### Gate 5: Code Simplification
Review for unnecessary complexity:
- [ ] Pass - Code is appropriately simple
- [ ] Needs attention - [List areas to simplify]

### Gate 6: Documentation Check
- [ ] README updated (if needed)
- [ ] API docs updated (if endpoints changed)
- [ ] Comments added for complex logic

## Output Format

```markdown
## Quality Gate Results

| Gate | Status | Notes |
|------|--------|-------|
| Lint | PASS/FAIL | [details] |
| Types | PASS/FAIL | [details] |
| Tests | PASS/FAIL | [details] |
| Security | PASS/FAIL | [details] |
| Simplification | PASS/ATTENTION | [details] |
| Documentation | PASS/ATTENTION | [details] |

## Overall Status
[ ] Ready for PR - All gates pass
[ ] Needs Work - Address issues below

## Action Items (if any)
1. [Action needed]
2. [Action needed]
```

## Rules

- **All critical gates must pass** before proceeding
- **Fix issues** rather than skipping gates
- **Re-run after fixes** to confirm resolution
