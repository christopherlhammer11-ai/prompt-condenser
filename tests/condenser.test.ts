import { condense, condenseBatch } from '../src/condenser';

describe('condense', () => {
  it('removes filler words at level 1', () => {
    const result = condense(
      'Please kindly basically just help me write a very simple function',
      { level: 1 },
    );
    expect(result.condensed).not.toMatch(/\bplease\b/i);
    expect(result.condensed).not.toMatch(/\bkindly\b/i);
    expect(result.condensed).not.toMatch(/\bbasically\b/i);
    expect(result.condensed).not.toMatch(/\bjust\b/i);
    expect(result.condensed).not.toMatch(/\bvery\b/i);
    expect(result.condensed).toContain('help me write');
    expect(result.stats.savedTokens).toBeGreaterThan(0);
  });

  it('shortens verbose phrases at level 2', () => {
    const result = condense(
      'In order to achieve this, due to the fact that the system has the ability to process data, it is important to note that we should make sure to validate input.',
      { level: 2 },
    );
    expect(result.condensed).toContain('to');
    expect(result.condensed).toContain('because');
    expect(result.condensed).toContain('can');
    expect(result.condensed).not.toContain('in order to');
    expect(result.condensed).not.toContain('due to the fact that');
    expect(result.condensed).not.toContain('has the ability to');
  });

  it('strips hedging at level 3', () => {
    const result = condense(
      'I think perhaps maybe we should probably consider possibly using a database.',
      { level: 3 },
    );
    expect(result.condensed).not.toMatch(/\bperhaps\b/i);
    expect(result.condensed).not.toMatch(/\bmaybe\b/i);
    expect(result.condensed).not.toMatch(/\bprobably\b/i);
    expect(result.condensed).not.toMatch(/\bpossibly\b/i);
    expect(result.stats.compressionPct).toBeGreaterThan(20);
  });

  it('preserves code blocks by default', () => {
    const prompt = 'Please just run this code:\n```python\ndef hello():\n    print("hello world")\n```\nThank you.';
    const result = condense(prompt);
    expect(result.condensed).toContain('```python');
    expect(result.condensed).toContain('print("hello world")');
    expect(result.condensed).not.toMatch(/\bplease\b/i);
  });

  it('preserves inline code', () => {
    const result = condense('Please just use the `forEach` method');
    expect(result.condensed).toContain('`forEach`');
  });

  it('preserves URLs by default', () => {
    const result = condense('Please just check https://example.com/api/v1/users for details');
    expect(result.condensed).toContain('https://example.com/api/v1/users');
  });

  it('handles empty input', () => {
    const result = condense('');
    expect(result.condensed).toBe('');
    expect(result.stats.savedTokens).toBe(0);
  });

  it('removes redundant polite prefixes', () => {
    const result = condense(
      'I would like you to write a sorting algorithm. Could you please make it efficient. I need you to add error handling.',
      { level: 1 },
    );
    expect(result.condensed).not.toContain('I would like you to');
    expect(result.condensed).not.toContain('Could you please');
    expect(result.condensed).not.toContain('I need you to');
    expect(result.condensed).toContain('write a sorting algorithm');
  });

  it('removes generic AI role statements at level 2', () => {
    const result = condense(
      'You are a helpful assistant. You are an AI assistant. When responding, make sure to be concise.',
      { level: 2 },
    );
    expect(result.condensed).not.toContain('You are a helpful assistant');
    expect(result.condensed).not.toContain('You are an AI assistant');
  });

  it('reports changes made', () => {
    const result = condense('Please just basically help me', { level: 1 });
    expect(result.changes.length).toBeGreaterThan(0);
    expect(result.changes.some(c => c.includes('please'))).toBe(true);
  });

  it('produces valid compression stats', () => {
    const result = condense(
      'I would like you to please kindly help me in order to achieve the task of writing code that has the ability to sort arrays.',
      { level: 2 },
    );
    expect(result.stats.originalTokens).toBeGreaterThan(result.stats.condensedTokens);
    expect(result.stats.savedTokens).toBe(result.stats.originalTokens - result.stats.condensedTokens);
    expect(result.stats.compressionPct).toBeGreaterThan(0);
    expect(result.stats.compressionPct).toBeLessThanOrEqual(100);
  });
});

describe('condenseBatch', () => {
  it('condenses multiple prompts', () => {
    const result = condenseBatch([
      'Please just help me write code',
      'I would like you to basically sort an array',
      'Could you please kindly review this',
    ]);
    expect(result.results).toHaveLength(3);
    expect(result.totalSaved).toBeGreaterThan(0);
    expect(result.overallCompressionPct).toBeGreaterThan(0);
  });

  it('handles empty batch', () => {
    const result = condenseBatch([]);
    expect(result.results).toHaveLength(0);
    expect(result.totalSaved).toBe(0);
  });
});
