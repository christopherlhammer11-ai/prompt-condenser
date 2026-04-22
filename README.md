# Prompt Condenser

CLI and TypeScript library for compressing LLM prompts and reducing token usage
without losing intent, code blocks, JSON, or URLs.

<!-- badges -->

## What It Does

Prompt Condenser (`prompt-condenser`) shrinks long prompts to reduce LLM token
costs while preserving critical instructions. Three compression levels, smart
deduplication, token estimates, and code-block protection make it useful for
developers, prompt-heavy teams, and AI workflow builders.

## Features

- **3 Compression Levels**: safe (10%), moderate (30%), aggressive (50%) savings
- **Code Protection**: Never modifies code blocks, URLs, or JSON
- **Deduplication**: Removes repeated instructions and examples
- **Token Estimation**: Predicts token savings before and after
- **Format Preservation**: Maintains structure for readability
- **Safe Defaults**: Guard against over-aggressive compression

## Quick Start

Until the npm package is published, install from the GitHub repo or a local
tarball. The `prompt-condenser` npm package name is currently available.

```bash
npm install -g github:christopherlhammer11-ai/prompt-condenser
prompt-condenser input.txt --level moderate
```

## Usage

```bash
# Safe compression (10% reduction)
prompt-condenser prompt.txt --level safe

# Moderate compression (30% reduction)
prompt-condenser prompt.txt --level moderate

# Aggressive compression (50% reduction)
prompt-condenser prompt.txt --level aggressive

# Estimate tokens only
prompt-condenser prompt.txt --estimate

# Output to file
prompt-condenser prompt.txt --output compressed.txt
```

## Example

This repo includes a sample product-spec prompt with JSON and a URL so reviewers
can verify that protected content survives compression.

```bash
npm run build
node dist/cli.js examples/product-spec-prompt.txt --level moderate
```

Expected behavior:

- repeated instructions are tightened
- code fences and JSON remain intact
- URLs remain unchanged
- the output includes before/after token estimates

## Tech Stack

- Commander.js (CLI framework)
- Tokenization algorithms
- Pattern matching (deduplication)
- Jest test suite

## Product Status

Verified on April 22, 2026:

- `npm test` passes: 26 tests
- `npm run build` passes
- `npm pack --dry-run` produces a clean 11.5 kB package
- `node dist/cli.js --help` works

## Commercial Path

- Free CLI for developer adoption
- Paid batch processor for teams with prompt libraries
- Paid API/reporting layer for tracking prompt cost reduction over time

## Release Checklist

- [x] Build passes
- [x] Tests pass
- [x] CLI help works
- [x] Example prompt included
- [x] Package dry-run verified
- [ ] Publish to npm
- [ ] Add hosted before/after demo

## Author

Christopher L. Hammer  
GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)  
Portfolio: [AI Engineering Portfolio](https://2026-04-21-that-s-a-full-green-run.vercel.app)
