[**@svg-use/core**](../README.md)

---

[@svg-use/core](../README.md) / XastMakeThemeableOptions

# Type Alias: XastMakeThemeableOptions

> **XastMakeThemeableOptions** = `object`

Defined in:
[theme/makeThemeable.ts:12](https://github.com/fpapado/svg-use/blob/main/packages/core/src/theme/makeThemeable.ts#L12)

## Properties

### fallbackRootFill?

> `optional` **fallbackRootFill**: `string`

Defined in:
[theme/makeThemeable.ts:19](https://github.com/fpapado/svg-use/blob/main/packages/core/src/theme/makeThemeable.ts#L19)

If no fills or strokes are found in the SVG, then this specified fill will be
added to the root SVG element. This is useful for SVGs that do not specify a
fill or stroke, and would otherwise default to black. This addition is done
prior to the `getThemeSubstitutions` transform.
