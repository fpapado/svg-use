[**@svg-use/core**](../README.md)

---

[@svg-use/core](../README.md) / svgoMakeThemeable

# Function: svgoMakeThemeable()

> **svgoMakeThemeable**(`themeSubstitutionFunction`, `options`?): `CustomPlugin`

Defined in:
[theme/svgoMakeThemeable.ts:12](https://github.com/fpapado/svg-use/blob/main/packages/core/src/theme/svgoMakeThemeable.ts#L12)

Substitute hardcoded color values with other ones (usually custom properties).
SVGO-compatible version of [xastMakeThemeable](xastMakeThemeable.md)

## Parameters

### themeSubstitutionFunction

[`GetThemeSubstitutionFunction`](../type-aliases/GetThemeSubstitutionFunction.md)

### options?

[`XastMakeThemeableOptions`](../type-aliases/XastMakeThemeableOptions.md)

## Returns

`CustomPlugin`
