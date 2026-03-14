/**
 * Detect and merge duplicate/near-duplicate instructions in prompts.
 * Common in long system prompts where rules get repeated.
 */

export function deduplicateInstructions(text: string): { text: string; removed: number } {
  const lines = text.split('\n');
  const seen = new Map<string, number>(); // normalized line → first occurrence index
  const kept: string[] = [];
  let removed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const normalized = normalizeLine(line);

    // Skip empty lines and very short lines (formatting)
    if (normalized.length < 10) {
      kept.push(line);
      continue;
    }

    if (seen.has(normalized)) {
      removed++;
      continue;
    }

    // Check for near-duplicates
    let isDup = false;
    for (const [existing] of seen) {
      if (isSimilar(normalized, existing)) {
        isDup = true;
        removed++;
        break;
      }
    }

    if (!isDup) {
      seen.set(normalized, i);
      kept.push(line);
    }
  }

  return { text: kept.join('\n'), removed };
}

function normalizeLine(line: string): string {
  return line
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSimilar(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > a.length * 0.3) return false;

  // Word overlap check
  const wordsA = new Set(a.split(' '));
  const wordsB = new Set(b.split(' '));
  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }

  const union = wordsA.size + wordsB.size - overlap;
  return union > 0 && overlap / union > 0.7;
}
