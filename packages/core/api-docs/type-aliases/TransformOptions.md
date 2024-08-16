[**@svg-use/core**](../README.md) • **Docs**

---

[@svg-use/core](../README.md) / TransformOptions

# Type Alias: TransformOptions

> **TransformOptions**: `object`

## Type declaration

### getSvgIdAttribute

> **getSvgIdAttribute**: [`GetSvgIdFunction`](GetSvgIdFunction.md)

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

### getThemeSubstitutions

> **getThemeSubstitutions**:
> [`GetThemeSubstitutionFunction`](GetThemeSubstitutionFunction.md) \| `null`

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

#### Default Value

[defaultThemeSubstitution](../functions/defaultThemeSubstitution.md)

## Defined in

[transformSvgForUseHref.ts:79](https://github.com/fpapado/svg-use/blob/cfb17d16e4effa2c9dcbf7f704dead47a35e60aa/packages/core/src/transformSvgForUseHref.ts#L79)
