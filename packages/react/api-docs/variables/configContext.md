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

[packages/react/src/ThemedExternalSvg.tsx:61](https://github.com/fpapado/svg-use/blob/ff656698129b7434fca4a9539e22e83ad215512f/packages/react/src/ThemedExternalSvg.tsx#L61)
