[**@svg-use/core**](../README.md)

---

[@svg-use/core](../README.md) / defaultGetSvgIdAttribute

# Function: defaultGetSvgIdAttribute()

> **defaultGetSvgIdAttribute**(`__namedParameters`): `string`

Defined in:
[getSvgIdAttribute.ts:14](https://github.com/fpapado/svg-use/blob/main/packages/core/src/getSvgIdAttribute.ts#L14)

The default id function. Uses a fixed id, regardless of context or a
pre-existing id. Useful for consistency, but might lead to clashes if you are
inlining SVGs in the document.

## Parameters

### \_\_namedParameters

#### existingId

`string`

## Returns

`string`
