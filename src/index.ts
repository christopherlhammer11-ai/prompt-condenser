/**
 * Prompt Condenser — Compress LLM prompts to save tokens.
 *
 * @example
 * ```typescript
 * import { condense, condenseBatch } from 'prompt-condenser';
 *
 * const result = condense('Please kindly help me write a function that is able to sort an array');
 * console.log(result.condensed); // 'help me write a function that can sort an array'
 * console.log(result.stats.savedTokens); // 5
 *
 * const batch = condenseBatch([prompt1, prompt2, prompt3]);
 * console.log(batch.totalSaved); // total tokens saved across all prompts
 * ```
 */

export { condense, condenseBatch } from './condenser';
export { estimateTokens } from './tokens';
export { getRulesForLevel } from './rules';
export type { CondenseResult, CondenseOptions, BatchResult } from './types';

import { condense } from './condenser';
import { CondenseOptions } from './types';
import * as fs from 'fs';

/**
 * Condense a prompt file.
 */
export async function condenseFile(
  filePath: string,
  options?: CondenseOptions,
): Promise<ReturnType<typeof condense>> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return condense(content, options);
}
