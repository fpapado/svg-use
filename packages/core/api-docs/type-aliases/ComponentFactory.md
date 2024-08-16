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

[createJsModule.ts:24](https://github.com/fpapado/svg-use/blob/3b00347120e4d16a0b5896e0c16c3dc896a7bab1/packages/core/src/createJsModule.ts#L24)
