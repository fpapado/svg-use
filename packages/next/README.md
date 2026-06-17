# @svg-use/next

A Turbopack-compatible webpack loader for loading SVG images via
`svg > use[href]`, to use with **Next.js 16+**.

The exported `url`, `id`, `viewBox`, and `Component` have the same shape as
`@svg-use/webpack`, so the two can be swapped with minimal config changes.

## Why this package exists

Next.js 16 ships Turbopack as the default bundler. Turbopack implements the
webpack-compatible loader API but does **not** implement `this.emitFile`. The
existing `@svg-use/webpack` loader fails with:

```
TypeError: this.emitFile is not a function
```

This package writes processed SVG assets directly to disk via `fs.writeFileSync`
into a caller-supplied `outputDir`, bypassing `this.emitFile` entirely.

## Installation

```sh
npm install @svg-use/next @svg-use/react
# or
pnpm add @svg-use/next @svg-use/react
```

## Next.js configuration

Add the loader to `next.config.ts`. The `turbopack` key is **top-level** in
Next.js 15.3+ and 16+ (it was `experimental.turbo` in older versions).

```typescript
// next.config.ts
import path from 'node:path';
import { fileToUrlPath } from 'node:fs';
import type { NextConfig } from 'next';

const __dirname = path.dirname(fileToUrlPath(import.meta.url));
const outputDir = path.join(__dirname, 'public/svgAssets');

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': [
        {
          // Themed variant — matched by ?extract (without ?unthemed)
          loaders: [
            {
              loader: '@svg-use/next',
              options: {
                outputDir,
                publicPath: '/svgAssets/',
              },
            },
          ],
          as: '*.js',
          condition: {
            all: [{ query: /extract/i }, { not: { query: /unthemed/i } }],
          },
        },
        {
          // Unthemed variant — matched by ?extract&unthemed (useful for
          // multi-colour assets like flags where CSS variable substitution is
          // not desired)
          loaders: [
            {
              loader: '@svg-use/next',
              options: {
                outputDir,
                publicPath: '/svgAssets/',
                getThemeSubstitutions: null,
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
```

## TypeScript

Add a global type reference so TypeScript recognises `?extract` imports.

```typescript
// app/global.d.ts  (or any .d.ts file included by tsconfig)
/// <reference types="@svg-use/next/client" />
```

## Usage in components

```tsx
// Themed SVG — stroke/fill colours are replaced with CSS custom properties
import { Component as ArrowIcon } from './assets/arrow.svg?extract';

// Unthemed SVG — original colours are preserved
import { Component as FlagIcon } from './assets/flag.svg?extract&unthemed';

// You can also destructure url / id / viewBox for manual use with ThemedExternalSvg
import { url, id, viewBox } from './assets/arrow.svg?extract';
```

## Setting up the React provider

The `ThemedExternalSvg` component reads configuration from `configContext`. Add
a provider near the root of your app:

```tsx
// app/providers.tsx
'use client';

import { configContext, type Config } from '@svg-use/react';

const svgUseConfig: Config = {
  runtimeChecksEnabled: process.env.NODE_ENV === 'development',
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <configContext.Provider value={svgUseConfig}>
      {children}
    </configContext.Provider>
  );
}
```
