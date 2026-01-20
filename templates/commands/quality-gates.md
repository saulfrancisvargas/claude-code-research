# Quality Gates

Run verification before PR.

## Gates

1. Lint: `[package manager] run lint`
2. Types: `[package manager] run build`
3. Tests: `[package manager] test`
4. Security: `[package manager] audit`
5. Simplification review
6. Documentation check

## Output

Report pass/fail for each gate.
