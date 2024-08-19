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
  module: {
    rules: [
      {
        // Match assets such as `arrow.svg?svgUse`, making them compatible with `svg >
        // use[href]`. Emit a transformed SVG asset, and return a JS module
        // with all the relevant information.
        test: /\.svg$/i,
        resourceQuery: {
          and: [/svgUse/i, { not: [/noTheme/i] }],
        },
        // This loader chain ultimately returns JS code, and emits an asset
        type: 'javascript/auto',
        use: [
          {
            loader: '@svg-use/webpack',
            options: {
              // Customise to your heart's content
              svgAssetFilename: 'svgAssets/[name]-[contenthash].[ext]',
            },
          },
        ],
      },
      {
        // Assets without a theme, such as country flags.
        // Referenced as `icon.svg?svgUse&noTheme`
        test: /\.svg$/i,
        resourceQuery: {
          and: [/svgUse/i, /noTheme/i],
        },
        type: 'javascript/auto',
        use: [
          {
            loader: '@svg-use/webpack',
            options: {
              getThemeSubstitutions: null,
              svgAssetFilename: 'svgAssets/[name]-[contenthash].[ext]',
            },
          },
        ],
      },
    ];
  }
}
```

### Optional: Configure TypeScript

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
import { Component as ArrowNoTheme } from './arrow.svg?svgUse&noTheme';

const MyComponent = () => (
  <div>
    <Arrow color="currentColor" />
    <ArrowNoTheme />
  </div>
);
```

You can also create your own SVG `use[href]` wrappers, using the other named
exports. This is how the default Component factory works under the hood:

```tsx
import { url, id } from './arrow.svg?svgUse';
import { createThemedExternalSvg } from '@svg-use/react';

export const Arrow = createThemedExternalSvg({ url, id });
```

## Worked example

[Consult examples/webpack-react for a worked example.](/examples/webpack-react/)
You can use this as a playground for understanding the transformations, as well
as the different moving parts, isolated from your own application's
configuration.

## Options

### svgAssetFilename?

> `optional` **svgAssetFilename**: `string`

Default: `[name]-[contenthash].[ext]`

The output filename for the transformed SVG asset. Often useful if you are
placing your assets under a specific path, for example to facilitate caching.

Uses the same syntax/replacements as
[webpack's native `assetModuleFilename`](https://webpack.js.org/configuration/output/#outputassetmodulefilename).

### getSvgIdAttribute?

> `optional` **getSvgIdAttribute**:
> `(info: {filename?: string; existingId?: string;}) => string`;

Specifies an id for the referenced `<svg>`, set as the `id` attribute on the
root. An id is required in order for use[href] to work. A default is provided if
this is not defined.

### Options shared with `@svg-use/core`

- [`getThemeSubstitutions`](/packages/core/api-docs/type-aliases/TransformOptions.md#getthemesubstitutions)
- [`componentFactory`](/packages/core/api-docs/interfaces/ModuleFactoryOptions.md#componentfactory)
