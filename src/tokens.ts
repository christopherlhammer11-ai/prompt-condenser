const AVG_CHARS_PER_TOKEN = 4;

export function estimateTokens(text: string): number {
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean);
  let tokens = 0;
  for (const word of words) {
    tokens += Math.max(1, Math.ceil(word.length / AVG_CHARS_PER_TOKEN));
  }
  return tokens;
}
