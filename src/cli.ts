#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import { condense, condenseBatch } from './condenser';
import { estimateTokens } from './tokens';

const program = new Command();

program
  .name('prompt-condenser')
  .description('Compress LLM prompts to save tokens')
  .version('0.1.0');

program
  .command('condense')
  .description('Condense a prompt file or stdin')
  .argument('[file]', 'Input file. Reads stdin if omitted.')
  .option('-l, --level <n>', 'Aggressiveness: 1=safe, 2=moderate, 3=aggressive', '2')
  .option('--json', 'Output JSON with stats')
  .option('--diff', 'Show what changed')
  .option('--no-preserve-code', 'Also condense code blocks')
  .action(async (file: string | undefined, opts: Record<string, string | boolean>) => {
    try {
      const input = file
        ? fs.readFileSync(file, 'utf-8')
        : await readStdin();

      const level = Math.min(3, Math.max(1, parseInt(opts['level'] as string, 10) || 2)) as 1 | 2 | 3;
      const result = condense(input, {
        level,
        preserveCode: opts['preserveCode'] !== false,
      });

      if (opts['json']) {
        console.log(JSON.stringify({
          condensed: result.condensed,
          stats: result.stats,
          changes: result.changes,
        }, null, 2));
      } else if (opts['diff']) {
        console.log('--- Original');
        console.log(`+++ Condensed (${result.stats.compressionPct}% smaller, ${result.stats.savedTokens} tokens saved)`);
        console.log('');
        console.log('Changes applied:');
        for (const change of result.changes) {
          console.log(`  - ${change}`);
        }
        console.log('');
        console.log(result.condensed);
      } else {
        console.log(result.condensed);
      }

      // Print stats to stderr so stdout is clean for piping
      if (!opts['json']) {
        process.stderr.write(
          `\n[${result.stats.originalTokens}→${result.stats.condensedTokens} tokens | ${result.stats.savedTokens} saved | ${result.stats.compressionPct}% compression]\n`
        );
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Show token count for a file')
  .argument('<file>', 'Input file')
  .action((file: string) => {
    const content = fs.readFileSync(file, 'utf-8');
    const tokens = estimateTokens(content);
    console.log(`File: ${file}`);
    console.log(`Tokens: ${tokens.toLocaleString()}`);
    console.log(`Characters: ${content.length.toLocaleString()}`);
  });

program.parse();

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
    setTimeout(() => { if (!data) reject(new Error('No stdin input')); }, 5000);
  });
}
