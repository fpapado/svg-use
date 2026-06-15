# @svg-use/next

A Turbopack-compatible webpack loader for loading SVG images via `svg > use[href]`,
for use with **Next.js 15.3+** (Turbopack stable) and **Next.js 16+** (Turbopack default).

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
import type { NextConfig } from 'next';

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
          // Unthemed variant — matched by ?extract&unthemed (useful for
          // multi-colour assets like flags where CSS variable substitution is
          // not desired)
          loaders: [
            {
              loader: '@svg-use/next',
              options: {
                outputDir: path.join(__dirname, '.next/static/svgAssets'),
                publicPath: '/_next/static/svgAssets/',
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

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDir` | `string` | **required** | Absolute path to the directory where processed SVG assets are written. Typically `.next/static/svgAssets`. |
| `publicPath` | `string` | `'/_next/static/svgAssets/'` | URL prefix prepended to the asset filename in the returned `url` export. |
| `svgAssetFilename` | `string` | `'[name]-[contenthash].[ext]'` | Filename template for the processed SVG asset. Supports `[name]`, `[contenthash]`, and `[ext]`. |
| `getThemeSubstitutions` | `function \| null` | default theme function | Controls CSS custom-property substitution. Pass `null` to disable theming entirely. |
| `getSvgIdAttribute` | `function` | `() => 'use-href-target'` | Derives the `id` attribute written on the root `<svg>` element. |
| `componentFactory` | `object` | `defaultComponentFactory` | Controls which React factory is used for the `Component` export. |
| `fallbackRootFill` | `string \| null` | `'#000'` | Fallback fill when no fill colours are detected. |

## Comparison with `@svg-use/webpack`

| | `@svg-use/webpack` | `@svg-use/next` |
|--|--|--|
| Bundler | webpack 5 | Turbopack (Next.js 15.3+) |
| Asset emission | `this.emitFile` | `fs.writeFileSync` into `outputDir` |
| URL | `__webpack_public_path__ + filename` | `publicPath + filename` |
| Async | `this.async()` callback | Returns `Promise<string>` |
| Extra options | — | `outputDir`, `publicPath` |
