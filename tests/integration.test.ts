import { condense } from '../src/condenser';

describe('integration: real-world system prompts', () => {
  it('condenses a typical verbose system prompt', () => {
    const systemPrompt = `You are a helpful assistant. You are an AI assistant that helps users with coding tasks.

In your response, please make sure to always provide clear and concise explanations. It is important to note that you should always use TypeScript for code examples. Please note that you should make sure that all code is properly formatted.

When responding, remember to include error handling in all code examples. In order to achieve the best results, you should make sure to test all code before providing it. Due to the fact that users may be beginners, you should provide step-by-step explanations.

Please kindly make sure to always format your response as valid JSON when asked for structured data. It is important to note that you should always validate input data. Thank you.`;

    const result = condense(systemPrompt, { level: 2 });

    // Should significantly compress
    expect(result.stats.compressionPct).toBeGreaterThan(20);
    expect(result.stats.savedTokens).toBeGreaterThan(10);

    // Should preserve key instructions
    expect(result.condensed.toLowerCase()).toContain('typescript');
    expect(result.condensed.toLowerCase()).toContain('json');
    expect(result.condensed.toLowerCase()).toContain('error handling');

    // Should remove filler
    expect(result.condensed).not.toContain('You are a helpful assistant');
    expect(result.condensed).not.toContain('Please kindly');
  });

  it('condenses a prompt with code blocks intact', () => {
    const prompt = `Please kindly help me understand this code. I would like you to explain what it does:

\`\`\`typescript
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

Could you please also suggest improvements? Thank you very much. I would like you to make sure to include error handling.`;

    const result = condense(prompt, { level: 2 });

    // Code block must be preserved exactly
    expect(result.condensed).toContain('function fibonacci(n: number): number');
    expect(result.condensed).toContain('fibonacci(n - 1) + fibonacci(n - 2)');

    // Filler should be removed
    expect(result.condensed).not.toMatch(/\bplease kindly\b/i);
    expect(result.condensed).not.toContain('Thank you very much');
  });

  it('handles aggressive mode on wordy prompts', () => {
    const prompt = `I think perhaps we should probably consider possibly using a different approach. To be more specific, I believe maybe we could perhaps try to implement a caching layer. Let me explain: in summary, the following is the list of things we need: a Redis instance, a cache invalidation strategy, and overall a monitoring dashboard.`;

    const result = condense(prompt, { level: 3 });
    expect(result.stats.compressionPct).toBeGreaterThan(30);

    // Core content survives
    expect(result.condensed.toLowerCase()).toContain('caching');
    expect(result.condensed.toLowerCase()).toContain('redis');
  });

  it('deduplicates repeated instructions in system prompts', () => {
    const prompt = [
      'Always respond in valid JSON format.',
      'Use TypeScript for all code.',
      'Keep responses concise.',
      'Always respond in valid JSON format.',
      'Make sure to use TypeScript.',
      'Keep your responses concise and clear.',
    ].join('\n');

    const result = condense(prompt, { level: 2 });
    // Should have removed duplicates
    expect(result.changes.some(c => c.includes('duplicate'))).toBe(true);
  });
});
