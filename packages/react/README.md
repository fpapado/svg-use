# `@svg-use/react`

A component for using the output of `@svg-use/core` in React, with the default
theme config. Also includes utilities for creating your own wrappers.

## Quick start

```shell
pnpm add @svg-use/react
```

```tsx
import { createThemedExternalSvg, ThemedExternalSvg } from '@svg-use/react';

// Assuming you have {url, id, viewBox} in scope, for example from a loader or a priori information

const MyIcon = createThemedExternalSvg({ url, id, viewBox });

const MyComponent = () => {
  return (
    <>
      <MyIcon />
      <ThemedExternalSvg iconUrl={url} iconId={id} viewBox={viewBox} />
    </>
  );
};
```

Optionally, in your application root, you can pass config via context:

```tsx
import { configContext, type Config } from '@svg-use/react';

const config: Config = {
  // Add any config options here
  rewritePath: (pathOrHref) => pathOrHref,
  runtimeChecksEnabled: process.env.NODE_ENV !== 'production',
};

const AppRoot = () => {
  return (
    <configContext.Provider value={config}>
      {/* The rest of your application */}
    </configContext.Provider>
  );
};
```

## API Reference

[Find the full API reference](./api-docs/README.md)
