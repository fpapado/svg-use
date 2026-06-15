import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': [
        {
          // Themed variant — matched by ?extract (without ?unthemed).
          // Stroke/fill colours are replaced with CSS custom properties so
          // that icons can be coloured via the `color` prop.
          loaders: [
            {
              loader: '@svg-use/next',
              options: {
                outputDir: path.join(__dirname, '.next/static/svgAssets'),
                publicPath: '/_next/static/svgAssets/',
              },
            },
          ],
          as: '*.js',
          condition: {
            all: [{ query: /extract/i }, { not: { query: /unthemed/i } }],
          },
        },
        {
          // Unthemed variant — matched by ?extract&unthemed.
          // Original colours are preserved; useful for multi-colour assets
          // such as country flags.
          loaders: [
            {
              loader: '@svg-use/next',
              // Next.js types loader options as JSONValue, which excludes
              // null/functions. Cast to unknown to use our loader's full API.
              options: {
                outputDir: path.join(__dirname, '.next/static/svgAssets'),
                publicPath: '/_next/static/svgAssets/',
                getThemeSubstitutions: null,
              } as unknown as Record<string, string>,
            },
          ],
          as: '*.js',
          condition: {
            all: [{ query: /extract/i }, { query: /unthemed/i }],
          },
        },
      ],
    },
  },
};

export default nextConfig;
