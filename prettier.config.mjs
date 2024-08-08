/**
 * @type import('prettier').Config
 */
export default {
  overrides: [
    {
      files: ['*.{ts,tsx,js,jsx,mjs,mts,cjs,cts}'],
      options: {
        singleQuote: true,
        quoteProps: 'consistent',
        trailingComma: 'all',
        arrowParens: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
    {
      files: '*.jsonc',
      options: {
        parser: 'jsonc',
      },
    },
    {
      // VS Code does not support json5 (especially autocomplete/schemas), so we
      // need to associate those files as jsonc. This helps prettier format it
      // in a way that is compatible, for example avoiding unquoted properties
      // and dangling commas, which are only supported in json.
      files: 'renovate.json5',
      options: {
        parser: 'json',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
      },
    },
  ],
};
