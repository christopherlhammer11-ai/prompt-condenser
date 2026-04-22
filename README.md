# Prompt Condenser

CLI tool for compressing prompts and reducing token usage without losing meaning.

<!-- badges -->

## What It Does

Prompt Condenser (`prompt-condenser`) shrinks long prompts to reduce LLM token costs while preserving critical instructions. Three compression levels, smart deduplication, and code-block protection.

## Features

- **3 Compression Levels**: safe (10%), moderate (30%), aggressive (50%) savings
- **Code Protection**: Never modifies code blocks, URLs, or JSON
- **Deduplication**: Removes repeated instructions and examples
- **Token Estimation**: Predicts token savings before and after
- **Format Preservation**: Maintains structure for readability
- **Safe Defaults**: Guard against over-aggressive compression

## Quick Start

```bash
npm install -g prompt-condenser
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

## Tech Stack

- Commander.js (CLI framework)
- Tokenization algorithms
- Pattern matching (deduplication)

## Part of Genesis Marketplace

Optimizes prompt efficiency across all Genesis agent workflows.

## Author

Christopher L. Hammer  
GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)  
Sites: [hammercg.com](https://hammercg.com) | [hammerlockai.com](https://hammerlockai.com)
