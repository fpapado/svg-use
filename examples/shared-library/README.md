# Creating shared libraries

Loading SVGs via shared libraries is similar to loading CSS.

There is no "standard" way of loading them, so we inevitably push that decision
to the caller and their bundler.

Various syntaxes (such as import attributes) can make this feel more or less
"native", but the fact remains that we push the loading configuration to the
caller.

In other words, distributing shared libraries that rely on SVG URLs makes that
library less portable between bundlers/runtimes, and relies primarily on
convention.

This convention/standardisation task can be made easier, by relying on the
minimum possible bundler/runtime support.

## Concrete examples

There are two options (that the authors have considered) for shared libraries.
Both rely on having the caller's bundler load the SVG, but with different
amounts of information.

Let's assume you have a module `my-icon-library`, a series of `.svg` files, and
want consumers to import components such as `ArrowEnd`.

## Option 1: Compute everything statically, and only defer the URL to the caller

The trick here is that most bundlers can resolve `.svg` files by returning their
emitted asset URL, so it is likely that users can consume it. This minimises the
setup for the user, and we consider it more portable (especially for bundlers
for which we have no plugins/loaders).

Another insight is that icon libraries tend to be standardised, as opposed to
the more ad-hoc/dynamic nature of `.svg` files in applications (for which the
bundler loader/plugins are better-suited). The theme and the id can be set in
advance, when building the library.

This is thus the recommended approach.

- Use `@svg-use/core`, to make SVGs themeable and ensure ids statically.
  - You can use the same id for all SVGs, to simplify the setup.
  - You will run the CLI statically, and/or in CI
- Create a "wrapper" component, similar to the default `ThemedExternalSvg` or
  `createThemedExternalSvg`
  - Similar to regular bundler usage and the default theme, the theme custom
    properties form "a priori" knowledge that the "wrapper" component uses
    internally, while exposing a props-based API externally.
- Combine these two, to write component files like this:

  ```tsx
  // src/ArrowEnd.tsx
  // We know that arrowEnd.svg has all the correct attributes and id (via the CLI), so we only need the final URL
  import url from './arrowEnd.svg';
  import createThemedExternalSvg from './some-path-to-wrapper';

  // this could also be extracted/inserted statically, or baked-in to
  createThemedExternalSvg const id = 'some-hardcoded-id';

  export const Component = createThemedExternalSvg({ url, id, });
  ```

  ```tsx
  // src/index.tsx
  export { Component as ArrowEnd } from './ArrowEnd.tsx';
  // etc. for other components
  ```

- You will have to configure your library's bundler or transpiler to externalise
  `.svg` files, so that they are not resolved when you build your library.
- You will have to give instructions to users, for how to configure their
  bundler to load `.svg` assets as URLs. For example, some configs ignore
  `node_modules` for asset transformations, but will have to allowlist your
  library.

**A similar approach to this one** is to do the above using your library's
bundler/transpiler, perhaps using the first-party plugins. However, the CLI and
static transforms might be simpler.

## Option 2: Defer everything to the caller

This is similar to the approach above, but instead of calculating things
statically, you ship just `.svg` and let the caller configure `@svg-use` for
their bundler.

In some ways, this is simpler for the author of the library (in terms of
code/build setup), but in other ways it requires more documentation and support.

- You would leave the SVGs intact, instead of adding themes and id statically.
  You would write code like this:

  ```tsx
  // src/ArrowEnd.tsx
  import {url, id} from './arrowEnd.svg?svgUse';
  import createThemedExternalSvg from './some-path-to-wrapper';

  // this could also be extracted/inserted statically, or baked-in to
  createThemedExternalSvg const id = 'some-hardcoded-id';

  export const Component = createThemedExternalSvg({ url, id, });
  ```

  ```tsx
  // src/index.tsx
  export { Component as ArrowEnd } from './ArrowEnd.tsx';
  // etc. for other components
  ```

- You would create a subpath export, such as `my-icon-library/svg-use-config`,
  that exports the expected theme and id options, as envisioned by your library.
- You will have to configure your library's bundler or transpiler to externalise
  `.svg` files, so that they are not resolved when you build your library.
- You will have to give instructions to users, for how to configure their
  bundler to load `.svg?svgUse` assets with `svg-use`. You will instruct them to
  use your exported options, for assets related to your library.

This approach seems more error-prone, compared to just consuming an SVG.
However, it is workable. Let us know if you find any significant benefits to
this approach, that we might have missed!

## TODO

- [] Perhaps recommend the `new URL` pattern
  <https://web.dev/articles/bundling-non-js-resources>, though note that it is
  unsupported in esbuild bundling
