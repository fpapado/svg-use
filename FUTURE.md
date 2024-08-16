# Future developments that may affect this library

There are some shortcomings of this library, that are tied to the JS and HTML
ecosystems. This document outlines those.

## SVG crossorigin use

If SVG crossorigin is supported, then you will not need the CDN dance
(https://github.com/w3c/svgwg/issues/707)

## SVG 2: referencing SVGs without an id fragment

This seems specified, but not implemented. This is the biggest motivator

## CSS Linked Parameters

If CSS Linked Parameters lands (https://drafts.csswg.org/css-link-params/), you
will be able to pass custom properties to SVGs inside of `img[href]`.

This avoids the dance with `svg > use[href]`, in favour of the simpler `img`. An
`img` can already be loaded cross-origin, so this also avoids the CDN dance.

Since an SVG `img` is displayed as a whole, this also avoids the id dance.

This is the most promising proposal. If this ever lands, then this library will
mostly be useful for two things: themeing, and extracting the intrinsic
width/height (the viewBox, essentially). The wrappers will adjust their
internals, but will likely not need to change their external interface
(hooray!).
