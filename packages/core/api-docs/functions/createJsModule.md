[**@svg-use/core**](../README.md) • **Docs**

---

[@svg-use/core](../README.md) / createJsModule

# Function: createJsModule()

> **createJsModule**(`__namedParameters`, `__namedParameters`): `string`

Takes a descriptor for an external SVG, and returns a JS module string, that
exposes all relevant information to embed the SVG via `use[href]`. Also exposes
a component (via a factory), for convenience.

This module is what a runtime would see eventually.

## Parameters

• **\_\_namedParameters**:
[`ModuleFactoryParams`](../interfaces/ModuleFactoryParams.md)

• **\_\_namedParameters**:
[`ModuleFactoryOptions`](../interfaces/ModuleFactoryOptions.md)

## Returns

`string`

## Defined in

[createJsModule.ts:57](https://github.com/fpapado/svg-use/blob/main/packages/core/src/createJsModule.ts#L57)
