[**@svg-use/react**](../README.md) • **Docs**

---

[@svg-use/react](../README.md) / BaseProps

# Interface: BaseProps

## Properties

### iconId

> **iconId**: `string`

The id of the referent icon, in the destination SVG.

#### Defined in

[packages/react/src/ThemedExternalSvg.tsx:82](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L82)

---

### iconUrl

> **iconUrl**: `string`

The URL of the SVG, to be included in `svg > use[href]`. Note that this URL must
be on the same origin as the site, otherwise no SVG will be displayed. There is
no mechanism for cross-origin svg[use].

#### Defined in

[packages/react/src/ThemedExternalSvg.tsx:80](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L80)

---

### viewBox

> **viewBox**: `string`

The viewBox of the referent SVG; used to ensure the same scaling.

#### Defined in

[packages/react/src/ThemedExternalSvg.tsx:84](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L84)
