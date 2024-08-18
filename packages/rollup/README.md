# `@svg-use/rollup`

A rollup plugin, for using SVG images via `use[href]` references. A thin wrapper
around [@svg-use/core](../core/README.md).

## Quick start

First, install the plugin, and the default React wrapper:

```shell
pnpm install --dev @svg-use/webpack
pnpm install @svg-use/react
```

### Configure Rollup

In your Rollup config file (`rollup.config.mjs`):

```ts
import svgUse from '@svg-use/rollup';

export default {
  plugins: [svgUse()];
}
```

### Configure TypeScript

If you are using TypeScript, you can get types for the default config by adding
the following in a `.d.ts` file in your project. For example, you can include
this in `src/client.d.ts`, or any other applicable place.

```ts
/// <reference types="@svg-use/rollup/client" />
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
/// <reference types="@svg-use/rollup/client" />
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

### All options from `@svg-use/core`

[Refer to the documentation for `@svg-use-core`](../core/README.md#options) for
all other options and defaults, such as customising the theme, id, and the
component factory functions.
