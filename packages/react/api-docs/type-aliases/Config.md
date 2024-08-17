[**@svg-use/react**](../README.md) • **Docs**

---

[@svg-use/react](../README.md) / Config

# Type Alias: Config

> **Config**: `object`

## Type declaration

### rewritePath()?

> `optional` **rewritePath**: (`pathOrHref`) => `string`

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

• **pathOrHref**: `string`

#### Returns

`string`

### runtimeChecksEnabled?

> `optional` **runtimeChecksEnabled**: `boolean`

Toggles runtime checks, which help catch common pitfalls with using external
SVGs, such as needing to be on the same origin.

#### Default Value

```ts
true;
```

## Defined in

[packages/react/src/ThemedExternalSvg.tsx:11](https://github.com/fpapado/svg-use/blob/585a805df232df52047b5d894dcd94635b4f932c/packages/react/src/ThemedExternalSvg.tsx#L11)
