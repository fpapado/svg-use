[**@svg-use/core**](../README.md)

---

[@svg-use/core](../README.md) / transformSvgForUseHref

# Function: transformSvgForUseHref()

> **transformSvgForUseHref**(`contents`, `__namedParameters`):
> [`Result`](../type-aliases/Result.md)\<[`UseHrefInfo`](../type-aliases/UseHrefInfo.md)
> & `object`, `string`\>

Defined in:
[transformSvgForUseHref.ts:143](https://github.com/fpapado/svg-use/blob/main/packages/core/src/transformSvgForUseHref.ts#L143)

Transform an SVG, such that it can be referenced by `svg > use[href]`. Returns
the transformed SVG contents, as well as any extracted information for
referencing it.

The main transformations are:

- ensuring an id
- ensuring a viewBox
- making styles themeable, by substituting hardcoded values

## Parameters

### contents

`string`

### \_\_namedParameters

[`TransformOptions`](../type-aliases/TransformOptions.md)

## Returns

[`Result`](../type-aliases/Result.md)\<[`UseHrefInfo`](../type-aliases/UseHrefInfo.md)
& `object`, `string`\>
