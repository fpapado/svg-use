[**@svg-use/react**](../README.md) • **Docs**

---

[@svg-use/react](../README.md) / configContext

# Variable: configContext

> `const` **configContext**: `Context`\<[`Config`](../type-aliases/Config.md)\>

A context that you can use to customise the runtime behavior of
`ThemedExternalSvg`. Because `ThemedExternalSvg` is usually a compilation
target, this allows you to inject configuration without changing the signature
of modules.

## Example

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
      {/* The rest of the application */}
    </configContext.Provider>
  );
};
```

## Defined in

[packages/react/src/ThemedExternalSvg.tsx:63](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L63)
