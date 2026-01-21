# Project: Claude Code Workflow Repository

## Overview

This is a **template and reference repository** for Claude Code best practices. It contains example configurations, commands, skills, and documentation that teams can clone and customize.

## Tech Stack

- Documentation: Markdown
- Configuration: JSON, YAML
- Examples: TypeScript, JavaScript

## Project Structure

```
/                       # Root - README, CLAUDE.md, .claudeignore
/.claude/               # Claude Code configuration
  /commands/            # Custom slash commands (12 total)
  /skills/              # Reusable skills (7 total)
/docs/                  # External memory (status, decisions, tech debt)
/reference/             # Full guides and documentation
/templates/             # Blank templates for new projects
```

## Code Style & Conventions

### Markdown
- Use ATX headers (`#`, `##`, `###`)
- Code blocks with language identifiers
- Tables for structured comparisons
- Consistent list formatting (dashes for unordered)

### JSON Configuration
- 2-space indentation
- No trailing commas
- Meaningful property names

### YAML
- 2-space indentation
- Quote strings that could be ambiguous
- Use anchors for repeated values

## Do NOT

- Modify files in `/reference/` without updating the source guides
- Add secrets or credentials to any file
- Create files that exceed 500 lines (split into smaller files)
- Use emojis in documentation unless explicitly requested

## Common Commands

```bash
# Validate markdown links
npx markdown-link-check **/*.md

# Format markdown
npx prettier --write "**/*.md"

# Check JSON validity
npx jsonlint .claude/**/*.json
```

## External Memory

- **Current status**: `docs/status.md`
- **Technical debt**: `docs/tech-debt.md`
- **Decisions**: `docs/decisions/YYYY-MM-DD-topic.md`

When starting a new session, read `docs/status.md` for context.
When ending a session, update `docs/status.md` with progress.

## Context Window Priority

Keep this CLAUDE.md concise. Move detailed instructions to:
1. Skills (for procedural knowledge)
2. Commands (for workflows)
3. Reference docs (for comprehensive guides)

This file should stay under 2,500 tokens.

## Working on This Repository

When adding new content:
1. Determine if it's a command, skill, or documentation
2. Follow existing patterns in that category
3. Keep files focused and single-purpose
4. Update README.md if structure changes


## Orchestrator Mode
When acting as orchestrator:
- Do NOT write code directly
- Break tasks into independent sub-agent assignments
- Each sub-agent gets: objective, file boundaries, deliverables
- Run independent tasks in parallel
- Run dependent tasks sequentially
- Synthesize and review all sub-agent outputs
- Flag conflicts between sub-agents immediately
