# Future developments that may affect this library

There are some shortcomings of this library, that are tied to the JS and HTML
ecosystems. This document outlines those.

## SVG crossorigin use

If [SVG crossorigin](https://github.com/w3c/svgwg/issues/707) is supported, then
shipping shared icons on CDNs will be much simpler, without having to
proxy/rewrite the URLs. This seems to have stalled.

## SVG 2: referencing SVGs without an id fragment

According to SVG 2, you could do this:

```tsx
<svg>
  <use href="arrow.svg"></use>
</svg>
```

...and have it reference the top-most SVG. This seems specified, but not
implemented.

## CSS Linked Parameters

If [CSS Linked Parameters](https://drafts.csswg.org/css-link-params/) lands, you
will be able to pass custom properties to SVGs inside of `img[href]`.

This avoids the setup with `svg > use[href]`, in favour of the much simpler
`img` element. An `img` can already be loaded cross-origin, so this also avoids
the CDN dance. Since an SVG `img` is displayed as a whole, this also avoids the
id issue.

**This is the most promising proposal**. If this ever lands, then this library
will mostly be useful for two things: themeing, and extracting the intrinsic
width/height (the `viewBox`, essentially). The wrappers will adjust their
internals, but will likely not need to change their external interface
(hooray!).
