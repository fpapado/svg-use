[**@svg-use/react**](../README.md)

---

[@svg-use/react](../README.md) / BaseProps

# Interface: BaseProps

Defined in:
[ThemedExternalSvg.tsx:73](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L73)

## Properties

### iconId

> **iconId**: `string`

Defined in:
[ThemedExternalSvg.tsx:81](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L81)

The id of the referent icon, in the destination SVG.

---

### iconUrl

> **iconUrl**: `string`

Defined in:
[ThemedExternalSvg.tsx:79](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L79)

The URL of the SVG, to be included in `svg > use[href]`. Note that this URL must
be on the same origin as the site, otherwise no SVG will be displayed. There is
no mechanism for cross-origin svg[use].

---

### viewBox

> **viewBox**: `string`

Defined in:
[ThemedExternalSvg.tsx:83](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L83)

The viewBox of the referent SVG; used to ensure the same scaling.
