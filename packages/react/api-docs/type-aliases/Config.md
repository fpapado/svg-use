[**@svg-use/react**](../README.md)

---

[@svg-use/react](../README.md) / Config

# Type Alias: Config

> **Config** = `object`

Defined in:
[ThemedExternalSvg.tsx:11](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L11)

## Properties

### rewritePath()?

> `optional` **rewritePath**: (`pathOrHref`) => `string`

Defined in:
[ThemedExternalSvg.tsx:25](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L25)

Used to rewrite paths at runtime. This is most useful to account for hosting
your assets on a CDN.

Because svg[use] does not support CORS, it is not possible to reference external
SVGs from a CDN. Hosting static assets and scripts separately from an
application origin is relatively common, so this poses a problem. One possible
workaround is to proxy the SVGs via your origin to the CDN. In order to achieve
that, you need a way to rewrite the URLs.

Note: This does not set up any proxying; your application/server code is
responsible for that.

#### Parameters

##### pathOrHref

`string`

#### Returns

`string`

---

### runtimeChecksEnabled?

> `optional` **runtimeChecksEnabled**: `boolean`

Defined in:
[ThemedExternalSvg.tsx:33](https://github.com/fpapado/svg-use/blob/main/packages/react/src/ThemedExternalSvg.tsx#L33)

Toggles runtime checks, which help catch common pitfalls with using external
SVGs, such as needing to be on the same origin.

#### Default Value

```ts
true;
```
