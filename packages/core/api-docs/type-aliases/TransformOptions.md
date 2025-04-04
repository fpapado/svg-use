[**@svg-use/core**](../README.md)

---

[@svg-use/core](../README.md) / TransformOptions

# Type Alias: TransformOptions

> **TransformOptions** = `object`

Defined in:
[transformSvgForUseHref.ts:82](https://github.com/fpapado/svg-use/blob/main/packages/core/src/transformSvgForUseHref.ts#L82)

## Properties

### fallbackRootFill

> **fallbackRootFill**:
> [`XastMakeThemeableOptions`](XastMakeThemeableOptions.md)\[`"fallbackRootFill"`\] >
> \| `null`

Defined in:
[transformSvgForUseHref.ts:131](https://github.com/fpapado/svg-use/blob/main/packages/core/src/transformSvgForUseHref.ts#L131)

If no fills or strokes are found in the SVG, then this specified fill will be
added to the root SVG element. This is useful for SVGs that do not specify a
fill or stroke, and would otherwise default to black. This addition is done
prior to the `getThemeSubstitutions` transform.

The recommended default is `defaultFallbackRootFill` from this module.

---

### getSvgIdAttribute

> **getSvgIdAttribute**: [`GetSvgIdFunction`](GetSvgIdFunction.md)

Defined in:
[transformSvgForUseHref.ts:98](https://github.com/fpapado/svg-use/blob/main/packages/core/src/transformSvgForUseHref.ts#L98)

Specifies an id for the referenced <svg>, set as the id attribute on the root.
ids are required in order for use[href] to work.

By default, the id attribute will be preserved if present, otherwise a static
string id of 'svg-use-id' will be set. Static string ids work _ok_ for the
purpose of referencing with use[href], but might clash if you wish to inline the
SVGs into the document or a sprite map.

Consider using
[svgo-loader with the `prefixIds` plugin](https://svgo.dev/docs/plugins/prefix-ids/)
prior to this loader, if you want more robust id generation.

#### Default Value

```ts
id attribute if present, static 'use-href-target' otherwise
```

---

### getThemeSubstitutions

> **getThemeSubstitutions**:
> [`GetThemeSubstitutionFunction`](GetThemeSubstitutionFunction.md) \| `null`

Defined in:
[transformSvgForUseHref.ts:122](https://github.com/fpapado/svg-use/blob/main/packages/core/src/transformSvgForUseHref.ts#L122)

A function that is used to substituted hardcoded color attributes with different
ones (usually custom properties). Receives a sorted map of fills and strokes.
Return `null` to skip any theme substitutions.

With the default theme function, up to three hardcoded values (each for fill and
stroke) are substituted. For example, if an SVG uses a fixed value such as
fill="#123123", then a CSS custom property will automatically be extracted and
used instead. The static value will be kept as a var() fallback, such as
fill="var(--use-href-fill-primary, #123123)".

When using a custom function, a prefix is recommended for the properties, to
avoid accidentally inheriting styles from the host document (unless that is
intended).

For SVGs that are meant to be unthemeable (e.g. country flags), or that mix
themed values with static ones, you should configure the loader with a different
URL query, that uses `null` for the theme function. Refer to the library
documentation for guidance.

The recommended default is the result of calling
`getDefaultThemeSubstitutionFunction` from this module.
