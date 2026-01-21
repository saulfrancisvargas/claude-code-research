# Debug

Systematic debugging workflow for tracking down issues.

## Step 1: Understand the Problem

Before investigating, gather information:

- **Expected behavior:** What should happen?
- **Actual behavior:** What is happening?
- **Steps to reproduce:** How can we trigger it?
- **Error messages:** What errors are shown?
- **Environment:** Where does this occur? (Browser, OS, etc.)

## Step 2: Form Hypotheses

Based on the symptoms, list possible causes:

| # | Hypothesis | Likelihood | Test |
|---|------------|------------|------|
| 1 | [Possible cause] | High/Med/Low | [How to verify] |
| 2 | [Possible cause] | High/Med/Low | [How to verify] |
| 3 | [Possible cause] | High/Med/Low | [How to verify] |

## Step 3: Test Each Hypothesis

Start with the highest likelihood hypothesis:

1. Add strategic logging or breakpoints
2. Gather data to confirm or rule out
3. Document findings
4. Move to next hypothesis if ruled out

**Logging format:**
```javascript
console.log('[DEBUG] functionName:', { relevantData });
```

## Step 4: Find Root Cause

Once identified, trace back to the root cause:
- Why did this happen?
- Is this a symptom of a deeper issue?
- Are there other places with the same problem?

## Step 5: Fix and Verify

1. Implement the minimal fix
2. Verify the original issue is resolved
3. Check for regressions
4. Add a test to prevent recurrence

## Hypothesis Log Template

```markdown
## Hypothesis 1: [Description]
**Test:** [What we did]
**Result:** [What we found]
**Verdict:** Confirmed / Ruled Out

## Hypothesis 2: [Description]
...
```

## Rules

- **Don't guess randomly** - Be systematic
- **One change at a time** - Isolate variables
- **Document findings** - Future you will thank you
- **Add tests** - Prevent regression

## Output

After finding the fix:
1. Explain the root cause
2. Show the fix
3. Suggest a test case
