[**@svg-use/core**](../README.md) • **Docs**

---

[@svg-use/core](../README.md) / ComponentFactory

# Type Alias: ComponentFactory

> **ComponentFactory**: `object`

Configuration for the "Component" export.

## Type declaration

### functionName

> **functionName**: `string`

The name of the component factory function. Should conform to the
[ComponentFactoryFunction](ComponentFactoryFunction.md) interface.

#### Example

```ts
'createThemedExternalSvg';
```

### importFrom

> **importFrom**: `string`

An ES module import path, that the factory function will be imported from (as a
named import).

#### Example

```ts
'@svg-use/react';
```

## Defined in

[createJsModule.ts:24](https://github.com/fpapado/svg-use/blob/31bdbf817fed6f833319eb6d8ff0a7093c11f6f2/packages/core/src/createJsModule.ts#L24)
