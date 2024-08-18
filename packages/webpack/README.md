# `@svg-use/webpack`

A webpack loader, for using SVG images via `use[href]` references. A thin
wrapper around [@svg-use/core](../core/README.md).

## Quick start

First, install the plugin, and the default React wrapper:

```shell
pnpm install --dev @svg-use/webpack
pnpm install @svg-use/react
```

### Configure webpack

In your webpack config file (typically `webpack.config.js`):

```ts
{
  // Make assets such as `arrow.svg?svgUse` compatible with `svg >
  // use[href]`. Emit an the transformed asset, and returned a JS module
  // with all the relevant information.
  test: /\.svg$/i,
  resourceQuery: /svgUse/,
  // This loader chain ultimately returns JS code, and emits an asset
  type: 'javascript/auto',
  use: [
    {
      loader: '@svg-use/webpack',
      options: {
        svgAssetFilename: 'svgAssets/[name]-[contenthash].[ext]',
      },
    },
  ],
},
```

### Configure TypeScript

If you are using TypeScript, you can get types for the default config by adding
the following in a `.d.ts` file in your project. For example, you can include
this in `src/client.d.ts`, or any other applicable place.

```ts
/// <reference types="@svg-use/webpack/client" />
```

#### Overriding default types

If you wish to override the default types, add a separate `.d.ts` file with your
types. Then, reference that file in `client.d.ts`, prior to the built-in types

For example, suppose you have changed the signature of the factory function.
Specify your own definitions, such as `svg-use-overrides.d.ts`:

```ts
declare module '*.svg' {
  export const Component: ReturnType<
    typeof import('./path/to/my/factory').myFactoryName
  >;
}
```

In `client.d.ts`:

```ts
/// <reference types="./svg-use-overrides.d.ts" />
/// <reference types="@svg-use/webpack/client" />
```

### Use it in your components

```tsx
import { Component as Arrow } from './arrow.svg?svgUse';

const MyComponent = () => (
  <button>
    <Arrow color="currentColor" role="img" aria-label="Continue" />
  </button>
);
```

You can also create your own SVG `use[href]` wrappers, using the other named
exports. This is how the default Component factory works under the hood:

```tsx
import { url, id } from './arrow.svg?svgUse';
import { createThemedExternalSvg } from '@svg-use/react';

export const Arrow = createThemedExternalSvg({ url, id });
```

## Options

TODO: Spell these out

### `svgAssetFilename`

Default: `[name]-[contenthash].[ext]`

The output filename for the .svg resource. Often useful if you are placing your
assets under a specific path, for example to facilitate caching.

Uses the same syntax/replacements as
[webpack's native assetModuleFilename](https://webpack.js.org/configuration/output/#outputassetmodulefilename)
and Rule.generator.filename.

### All options from `@svg-use/core`

[Refer to the documentation for `@svg-use-core`](../core/README.md#options) for
all other options and defaults, such as customising the theme, id, and the
component factory functions.
