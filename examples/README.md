# Prompt Condenser Examples

Run the sample prompt through each compression level:

```bash
npm run build
node dist/cli.js examples/product-spec-prompt.txt --level safe
node dist/cli.js examples/product-spec-prompt.txt --level moderate
node dist/cli.js examples/product-spec-prompt.txt --level aggressive
```

The sample intentionally includes JSON and a URL so reviewers can verify that
protected content remains intact while surrounding instructions are tightened.
