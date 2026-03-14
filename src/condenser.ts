import { CondenseResult, CondenseOptions, BatchResult } from './types';
import { getRulesForLevel } from './rules';
import { deduplicateInstructions } from './dedup';
import { estimateTokens } from './tokens';

const DEFAULT_OPTIONS: Required<CondenseOptions> = {
  level: 2,
  preserveCode: true,
  preserveUrls: true,
};

/**
 * Condense a single prompt string.
 */
export function condense(prompt: string, options?: CondenseOptions): CondenseResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const originalTokens = estimateTokens(prompt);
  const changes: string[] = [];

  // Step 1: Extract protected regions (code blocks, URLs)
  const { text: unprotected, regions } = extractProtected(prompt, opts);

  // Step 2: Apply rule-based condensation
  let result = unprotected;
  const rules = getRulesForLevel(opts.level);

  for (const [pattern, replacement, description] of rules) {
    const before = result;
    result = result.replace(pattern, replacement);
    if (result !== before) {
      changes.push(description);
    }
  }

  // Step 3: Deduplicate repeated instructions
  const { text: deduped, removed } = deduplicateInstructions(result);
  if (removed > 0) {
    result = deduped;
    changes.push(`removed ${removed} duplicate instruction(s)`);
  }

  // Step 4: Clean up artifacts
  result = cleanup(result);

  // Step 5: Restore protected regions
  result = restoreProtected(result, regions);

  const condensedTokens = estimateTokens(result);
  const savedTokens = originalTokens - condensedTokens;

  return {
    original: prompt,
    condensed: result,
    stats: {
      originalTokens,
      condensedTokens,
      savedTokens: Math.max(0, savedTokens),
      compressionPct: originalTokens > 0
        ? Math.max(0, Math.round((savedTokens / originalTokens) * 100))
        : 0,
    },
    changes,
  };
}

/**
 * Condense multiple prompts.
 */
export function condenseBatch(prompts: string[], options?: CondenseOptions): BatchResult {
  const results = prompts.map(p => condense(p, options));
  const totalOriginal = results.reduce((s, r) => s + r.stats.originalTokens, 0);
  const totalCondensed = results.reduce((s, r) => s + r.stats.condensedTokens, 0);
  const totalSaved = totalOriginal - totalCondensed;

  return {
    results,
    totalSaved: Math.max(0, totalSaved),
    totalOriginal,
    totalCondensed,
    overallCompressionPct: totalOriginal > 0
      ? Math.max(0, Math.round((totalSaved / totalOriginal) * 100))
      : 0,
  };
}

// --- Protected region handling ---

interface ProtectedRegion {
  placeholder: string;
  content: string;
}

function extractProtected(
  text: string,
  opts: Required<CondenseOptions>,
): { text: string; regions: ProtectedRegion[] } {
  const regions: ProtectedRegion[] = [];
  let result = text;
  let idx = 0;

  // Protect code blocks
  if (opts.preserveCode) {
    result = result.replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `__CODE_BLOCK_${idx++}__`;
      regions.push({ placeholder, content: match });
      return placeholder;
    });
    result = result.replace(/`[^`\n]+`/g, (match) => {
      const placeholder = `__INLINE_CODE_${idx++}__`;
      regions.push({ placeholder, content: match });
      return placeholder;
    });
  }

  // Protect URLs
  if (opts.preserveUrls) {
    result = result.replace(/https?:\/\/[^\s)>\]]+/g, (match) => {
      const placeholder = `__URL_${idx++}__`;
      regions.push({ placeholder, content: match });
      return placeholder;
    });
  }

  return { text: result, regions };
}

function restoreProtected(text: string, regions: ProtectedRegion[]): string {
  let result = text;
  // Restore in reverse order to handle nested placeholders
  for (let i = regions.length - 1; i >= 0; i--) {
    result = result.replace(regions[i].placeholder, regions[i].content);
  }
  return result;
}

function cleanup(text: string): string {
  return text
    .replace(/\s{2,}/g, ' ')           // collapse spaces
    .replace(/\n{3,}/g, '\n\n')        // collapse blank lines
    .replace(/^\s+/gm, (m) => m)       // preserve indentation
    .replace(/\s+([.,;:!?])/g, '$1')   // fix space before punctuation
    .replace(/([.,;:!?])\s*([.,;:!?])/g, '$1') // collapse double punctuation
    .trim();
}
