# API Design Patterns Skill

A Claude Code skill for designing resource-oriented APIs following patterns from "API Design Patterns" by JJ Geewax.

## Installation

```bash
/plugin add "path/to/api-design"
```

## Usage

```
/api-design
Help me design an API for [your use case]
```

---

# Claude Skill Directory Structure Guide

This section documents how to create your own Claude Code skills.

## Required vs Optional Files

```
my-skill/
├── SKILL.md              # REQUIRED - Main skill file
├── LICENSE.txt           # Optional - License information
├── README.md             # Optional - Documentation for humans
├── *.md                  # Optional - Additional reference docs
├── templates/            # Optional - Reusable templates
│   └── *.yaml, *.html, *.js
├── examples/             # Optional - Example files
│   └── *.yaml, *.json
└── scripts/              # Optional - Executable scripts
    └── *.py, *.js, *.sh
```

## File Descriptions

### SKILL.md (Required)

The main skill file that Claude reads. Must include YAML frontmatter:

```yaml
---
name: skill-name           # Required: URL-safe name (lowercase, hyphens)
description: Brief text    # Required: One-line description for discovery
license: MIT               # Optional: License type
---

# Skill Title

[Your detailed instructions here]
```

**Best Practices for SKILL.md:**
- Keep under 5,000 tokens for fast loading
- Put essential info first (Claude may not read everything)
- Use clear headers and bullet points
- Reference other files with "see filename.md" pattern
- Include usage examples

### Additional .md Files (Optional)

Use these for detailed reference documentation that supplements SKILL.md:

| File Pattern | Purpose |
|--------------|---------|
| `reference.md` | Detailed API/technical docs |
| `patterns-*.md` | Pattern deep-dives |
| `*-guide.md` | How-to guides |
| `troubleshooting.md` | Common issues and fixes |

**When to use:**
- SKILL.md exceeds 5,000 tokens
- You have detailed specs to share
- You want progressive disclosure (basics in SKILL.md, details in reference)

### templates/ Directory (Optional)

Store reusable boilerplate files:

```
templates/
├── openapi-template.yaml    # API specification template
├── component-template.tsx   # React component template
├── dockerfile-template      # Docker template
└── viewer.html              # HTML viewer for output
```

**When to use:**
- Skill generates files from templates
- You have standard boilerplate code
- Output follows consistent structure

### examples/ Directory (Optional)

Complete working examples:

```
examples/
├── basic-example.yaml
├── advanced-example.yaml
└── real-world-api.yaml
```

**When to use:**
- Users learn better from examples
- Complex concepts need illustration
- You want to show best practices

### scripts/ Directory (Optional)

Executable scripts Claude can run:

```
scripts/
├── validate.py           # Validation script
├── convert.py            # Conversion utility
├── generate.js           # Generator script
└── helpers/
    └── utils.py          # Shared utilities
```

**When to use:**
- Skill needs to execute code
- Complex transformations required
- Validation or testing needed

**Script Requirements:**
- Include shebang line (`#!/usr/bin/env python3`)
- Handle errors gracefully
- Print clear output
- Document dependencies

## Skill Types & Recommended Structure

### 1. Guidance Skills (like this one)
Knowledge and best practices, no execution.

```
my-guidance-skill/
├── SKILL.md              # Core guidelines
├── reference.md          # Detailed patterns
├── examples/             # Example files
└── templates/            # Templates to use
```

### 2. Document Skills (like /pdf, /docx)
Create or manipulate files.

```
my-document-skill/
├── SKILL.md              # How to use
├── reference.md          # Library API docs
├── scripts/              # Processing scripts
│   ├── create.py
│   ├── extract.py
│   └── validate.py
└── templates/            # Output templates
```

### 3. Automation Skills (like /webapp-testing)
Execute commands and workflows.

```
my-automation-skill/
├── SKILL.md              # Commands and workflows
├── scripts/              # Automation scripts
│   ├── run.py
│   └── setup.sh
└── config/               # Configuration files
```

### 4. Creative Skills (like /algorithmic-art)
Generate creative output.

```
my-creative-skill/
├── SKILL.md              # Creative guidelines
├── templates/            # Base templates
│   ├── generator.js
│   └── viewer.html
└── examples/             # Example outputs
```

## SKILL.md Template

```yaml
---
name: my-skill
description: Brief description for skill discovery (keep under 100 chars)
---

# Skill Name

One paragraph overview of what this skill does.

## Quick Start

Minimal example to get started.

## Core Concepts

Main concepts and terminology.

## Usage

### Basic Usage
[Examples]

### Advanced Usage
[Examples]

## Additional Resources

- **reference.md** - Detailed documentation
- **templates/** - Reusable templates
- **examples/** - Working examples

## Best Practices

Key guidelines and tips.

## Common Issues

Troubleshooting help.
```

## Progressive Disclosure Pattern

Claude loads skills in stages:

1. **Discovery** (~100 tokens): `name` + `description` from frontmatter
2. **Instructions** (<5k tokens): Full SKILL.md content
3. **Resources** (on-demand): Other files when referenced

**Design for this:**
- Put critical info in first 1000 tokens of SKILL.md
- Reference detailed docs with "see filename.md"
- Let Claude load resources as needed

## Testing Your Skill

1. Install locally:
   ```bash
   /plugin add "path/to/my-skill"
   ```

2. Restart Claude Code

3. Test invocation:
   ```
   /my-skill
   [test prompt]
   ```

4. Verify:
   - Skill loads correctly
   - Instructions are clear
   - Templates/scripts work
   - Examples are helpful
