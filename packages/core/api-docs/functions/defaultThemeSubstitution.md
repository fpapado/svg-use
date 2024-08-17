[**@svg-use/core**](../README.md) • **Docs**

---

[@svg-use/core](../README.md) / defaultThemeSubstitution

# Function: defaultThemeSubstitution()

> **defaultThemeSubstitution**(`counts`): `object`

The default theme function. Substitutes up to three sizes and strokes with
custom properties. Preserves existing properties as fallbacks.

## Parameters

• **counts**

• **counts.fills**:
[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`,
`number`\>

• **counts.strokes**:
[`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`,
`number`\>

## Returns

`object`

### fills

> **fills**:
> [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`,
> `string`\>

### strokes

> **strokes**:
> [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)\<`string`,
> `string`\>

## Defined in

[theme/defaultTheme.ts:26](https://github.com/fpapado/svg-use/blob/main/packages/core/src/theme/defaultTheme.ts#L26)
