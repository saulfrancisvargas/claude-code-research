# Skill Templates

Templates for creating custom skills.

## What Are Skills?

Skills teach Claude reusable patterns through structured folders containing instructions and resources.

## When to Create a Skill

Create a skill when you:
- Find yourself typing the same prompt repeatedly
- Have team-specific patterns to enforce
- Want to encode domain knowledge
- Need procedural workflows

## Template Types

### Basic Skill
For simple skills that are self-contained:
```
basic-skill/
└── SKILL.md.template
```

### Advanced Skill
For skills that need reference materials:
```
advanced-skill/
├── SKILL.md.template
└── reference/
    └── REFERENCE.md.template
```

## Creating a Skill

### 1. Choose a Template
- Use `basic-skill/` for simple patterns
- Use `advanced-skill/` for complex skills with resources

### 2. Copy and Rename
```bash
cp -r templates/skills/basic-skill .claude/skills/my-skill
```

### 3. Edit SKILL.md
- Set the `name` (lowercase, hyphenated)
- Write a clear `description` (triggers auto-loading)
- Add detailed instructions
- Include examples

### 4. Test It
Ask Claude something that should trigger your skill.

## Key Guidelines

### The Description Field
The description determines when Claude loads the skill:
```yaml
description: Review code for team standards  # Triggers on code review requests
```

### Keep Skills Focused
One skill, one purpose. Don't combine unrelated functionality.

### Size Limits
- SKILL.md: Under 500 lines (~5000 tokens)
- Use reference files for detailed documentation

### Examples Matter
Always include concrete examples showing how the skill should behave.

## Example Structure

```
my-skill/
├── SKILL.md           # Main instructions
├── reference/         # Optional: detailed docs
│   └── details.md
├── templates/         # Optional: file templates
│   └── template.yaml
└── scripts/           # Optional: executable scripts
    └── helper.sh
```
