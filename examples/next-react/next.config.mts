import path from 'node:path';
import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicPath = '/generated/svgs/';
const outputDir = path.join(__dirname, 'public', publicPath);

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
                // public/ is served at the root URL in both `next dev` and
                // `next start`. Using .next/static/ would work in production
                // but the Turbopack dev server does not serve arbitrary
                // subdirectories it did not create.
                outputDir,
                publicPath,
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
              // null/functions. Cast to never to use our loader's full API.
              options: {
                outputDir,
                publicPath,
                getThemeSubstitutions: null as never,
              },
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
