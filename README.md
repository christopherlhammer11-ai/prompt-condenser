# Prompt Condenser

**Prompt compression for lower-cost LLM workflows.** Prompt Condenser shrinks large prompts while preserving intent, URLs, code blocks, JSON, and the parts a model actually needs.

Demo: **Watch the demo:** [Prompt Condenser](https://christopherhammer.dev/assets/videos/narrated/project-demos/prompt-condenser-narrated.mp4)

## Who Uses It

- Startups spending heavily on LLM context
- Agent builders passing scraped pages into models
- Teams hitting context limits
- Developers who want cleaner, cheaper prompts without breaking code snippets or links

## Core Features

- Safe, moderate, and aggressive compression levels
- URL, JSON, and code-block protection
- Repeated-instruction cleanup
- Token estimate reporting
- CLI and TypeScript library usage
- Useful preprocessing layer for agents and RAG workflows

## Why It Matters

LLM apps often waste money by sending bloated context over and over. Condenser reduces token load while keeping task intent intact, which can lower cost and reduce context-limit failures.

## Example

```bash
prompt-condenser prompt.txt --level moderate --output compressed.txt
prompt-condenser prompt.txt --estimate
```

Programmatic usage:

```ts
import { condensePrompt } from 'prompt-condenser';

const result = condensePrompt(rawPrompt, { level: 'moderate' });
console.log(result.estimatedSavings);
```

## Quick Start

```bash
npm install
npm run build
npm test
```

## Portfolio Context

Prompt Condenser is part of the agent reliability/cost layer alongside Tool Use Guardian and Real-Time Verifier. Together they make AI workflows cheaper, cleaner, and less fragile.

---

Built by **Christopher L. Hammer** - self-taught AI/product builder shipping local-first tools, demos, and real product surfaces.

- Portfolio: [christopherhammer.dev](https://christopherhammer.dev)
- Proof demos: [https://christopherhammer.dev#proof](https://christopherhammer.dev#proof)
- GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)

