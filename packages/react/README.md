# `@svg-use/react`

A component for using the output of `@svg-use/core` in React, with the default
theme config. Also includes utilities for creating your own wrappers.

## Quick start

```shell
pnpm i @svg-use/react
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

## API Reference

[Find the full API reference](./api-docs/README.md)
