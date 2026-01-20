# Templates

Blank templates to bootstrap Claude Code in new projects.

## How to Use

### Quick Setup

```bash
# Copy essential files to your project
cp templates/CLAUDE.md.template your-project/CLAUDE.md
cp templates/claudeignore.template your-project/.claudeignore

# Copy commands
mkdir -p your-project/.claude/commands
cp templates/commands/* your-project/.claude/commands/
```

### Then Customize

1. Edit `CLAUDE.md` with your project's:
   - Tech stack
   - Project structure
   - Code conventions
   - Common commands

2. Edit `.claudeignore` to add project-specific patterns

3. Customize commands for your workflows

## Contents

### Core Templates

| File | Purpose |
|------|---------|
| `CLAUDE.md.template` | Project instructions for Claude |
| `claudeignore.template` | Files for Claude to ignore |

### Command Templates

All 12 commands as customizable templates:

| Command | Purpose |
|---------|---------|
| `catch-up.md` | Resume context between sessions |
| `review.md` | Code review staged changes |
| `simplify.md` | Clean up code |
| `plan-feature.md` | Plan new features |
| `debug.md` | Debugging workflow |
| `quality-gates.md` | Pre-PR checks |
| `orchestrate.md` | Large task coordination |
| `verify.md` | Post-implementation checks |
| `status.md` | Quick status check |
| `handoff.md` | Session handoff notes |
| `checkpoint.md` | Create checkpoints |
| `worktree.md` | Git worktree management |

### Skill Templates

| Template | Use Case |
|----------|----------|
| `basic-skill/SKILL.md.template` | Simple skill with instructions only |
| `advanced-skill/SKILL.md.template` | Skill with reference files |

## Customization Guide

### CLAUDE.md

The most important file. Customize these sections:

1. **Tech Stack** - List your technologies
2. **Project Structure** - Show your folder layout
3. **Code Style** - Document your conventions
4. **Do NOT** - What Claude should avoid
5. **Common Commands** - Your build/test commands

Keep it under 2,500 tokens.

### Commands

Modify commands to match your workflow:

- Update tool names (`npm` → `yarn`, `pnpm`, etc.)
- Add team-specific checks
- Include project-specific paths
- Adjust checklists

### Skills

Create skills for patterns you repeat:

1. Copy `basic-skill/` for simple skills
2. Copy `advanced-skill/` for skills with resources
3. Write clear descriptions (they trigger auto-loading)
