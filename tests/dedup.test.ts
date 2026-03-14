import { deduplicateInstructions } from '../src/dedup';

describe('deduplicateInstructions', () => {
  it('removes exact duplicate lines', () => {
    const input = [
      'Always respond in JSON format.',
      'Be concise in your answers.',
      'Always respond in JSON format.',
    ].join('\n');

    const { text, removed } = deduplicateInstructions(input);
    expect(removed).toBe(1);
    expect(text.split('\n').filter(l => l.includes('JSON'))).toHaveLength(1);
  });

  it('removes near-duplicate instructions', () => {
    const input = [
      'Always format your response as valid JSON.',
      'Be concise.',
      'Always format your responses as valid JSON.',
    ].join('\n');

    const { text, removed } = deduplicateInstructions(input);
    expect(removed).toBe(1);
  });

  it('keeps distinct instructions', () => {
    const input = [
      'Respond in JSON format.',
      'Use TypeScript for all code.',
      'Keep responses under 500 words.',
    ].join('\n');

    const { removed } = deduplicateInstructions(input);
    expect(removed).toBe(0);
  });

  it('preserves short formatting lines', () => {
    const input = [
      '---',
      'Rule 1: Be concise.',
      '---',
      'Rule 2: Use JSON.',
    ].join('\n');

    const { text, removed } = deduplicateInstructions(input);
    expect(removed).toBe(0);
    expect(text).toContain('---');
  });

  it('handles empty input', () => {
    const { text, removed } = deduplicateInstructions('');
    expect(text).toBe('');
    expect(removed).toBe(0);
  });
});
