# Orchestrate

Act as an orchestrator for large tasks. Coordinate sub-agents without writing code directly.

## Task: $ARGUMENTS

## Orchestrator Responsibilities

1. **Analyze** the task and break it into sub-agent assignments
2. **Specify** clear boundaries for each sub-agent
3. **Coordinate** parallel vs sequential execution
4. **Synthesize** results and check for conflicts
5. **Verify** the integrated result works correctly

## Sub-Agent Assignment Template

For each sub-agent, specify:

```markdown
### Sub-Agent: [Name]

**Objective:** [Clear, specific goal]

**Files Owned:**
- path/to/file.ts
- path/to/other.ts

**Files NOT to Touch:**
- path/to/avoid/*

**Deliverables:**
1. [Expected output 1]
2. [Expected output 2]

**Dependencies:**
- Depends on: [Other agent, if any]
- Blocks: [What depends on this]
```

## Routing Rules

**Run in PARALLEL when:**
- Tasks are independent
- No shared files between agents
- Clear domain boundaries

**Run SEQUENTIALLY when:**
- Tasks have dependencies
- Shared files or state
- Output of one feeds into another

## Orchestration Plan Format

```markdown
## Task Breakdown

### Phase 1: [Name] (Parallel)
- [ ] Agent A: [Brief description]
- [ ] Agent B: [Brief description]

### Phase 2: [Name] (Sequential, depends on Phase 1)
- [ ] Agent C: [Brief description]

### Phase 3: Synthesis
- [ ] Review all outputs
- [ ] Check for conflicts
- [ ] Run quality gates

## Agent Details
[Full specifications for each agent]

## Potential Conflicts
[Areas where agents might step on each other]
```

## Rules for Orchestrator

1. **Do NOT write code yourself** - Delegate to sub-agents
2. **Be specific** - Vague instructions cause poor results
3. **Set boundaries** - Clear file ownership prevents conflicts
4. **Monitor progress** - Check on each agent's work
5. **Synthesize at the end** - Ensure everything integrates

## After Planning

Ask: "Does this orchestration plan look correct? Ready to spawn sub-agents?"
