[**@svg-use/react**](../README.md) • **Docs**

---

[@svg-use/react](../README.md) / createThemedExternalSvg

# Function: createThemedExternalSvg()

> **createThemedExternalSvg**(`__namedParameters`): (`props`) => `Element`

A component factory for a specific [ThemedExternalSvg](ThemedExternalSvg.md),
which bakes in its url, id and viewBox. Useful for module organisation, and as a
target for `@svg-use/core`'s `createJsModule` factory function.

## Parameters

• **\_\_namedParameters**: [`FactoryProps`](../type-aliases/FactoryProps.md)

## Returns

`Function`

### Parameters

• **props**: [`ThemeProps`](../interfaces/ThemeProps.md) &
`SVGAttributes`\<[`SVGSVGElement`](https://developer.mozilla.org/docs/Web/API/SVGSVGElement)\>

### Returns

`Element`

## Defined in

[packages/react/src/ThemedExternalSvg.tsx:158](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L158)
