# `@svg-use/react`

A component for using the output of `@svg-use/core` in React, with the default
theme config. Also includes utilities for creating your own wrappers.

## Quick start

```shell
pnpm i @svg-use/react
```

```tsx
import { createThemedExternalSvg, ThemedSvg } from '@svg-use/react';

// Assuming you have {url, id, viewBox} in scope, for example from a loader or a priori information

const MyIcon = createThemedExternalSvg({ url, id, viewBox });

const MyComponent = () => {
  return (
    <>
      <MyIcon />
      <ThemedSvg iconUrl={url} iconId={id} viewBox={viewBox} />
    </>
  );
};
```

## API Reference

### `ThemedSvg`

The main React component, which wires up `svg > use[href]`, as well as the
default theme (custom properties) from `@svg-use/core`. Accepts props for
setting the color.

### `createThemedExternalSvg`

A component factory for `ThemedSvg`. Takes the `{url, id, viewBox}` record, and
returns a ready-to-use component. Useful for module organisation, and as a
target for `@svg-use/core`'s `createJsModule`.

### `configContext`: `Context<Config>`

A context that you can use to customise the runtime behavior of `ThemedSvg`.
Because `ThemedSvg` is usually a compilation target, this allows you to inject
configuration without changing the signature of modules.

```tsx
import { configContext, type Config } from '@svg-use/react';

const config: Config = {
  // Add any config options here
};

const AppRoot = () => {
  return (
    <configContext.Provider value={config}>
      {/* The rest of the application */}
    </configContext.Provider>
  );
};
```

#### `rewritePath`: `(pathOrHref: string) => string`

Default: `undefined`

#### `runtimeChecksEnabled`: `boolean`

Default: `true`

Toggles runtime checks, which help catch common pitfalls with using external
SVGs, such as needing to be on the same origin.
