# @svg-use

Tools and bundler plugins, to load SVG icons as components in JavaScript, via
SVG's `<use href>` mechanism. This offers a performant way to reference SVG in
components, while taking into account **themeing**, **portability**, and **ease
of use**.

## In a nutshell

With an input file (`icon.svg`) like this:

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  fill="none"
  stroke="#111"
>
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

And a JS file like this, plus one of the bundler integrations
([webpack](./packages/webpack/), [rollup](./packages/rollup/),
[vite](./packages/vite)):

```tsx
import { Component as Arrow } from './icon.svg?svgUse';

return <Component color="red" />;
```

You get a component with a performant output, that does not inline the SVG
itself. This avoids duplication in a document, and keeps the SVG size out of
your JS bundles:

```html
<svg viewBox="0 0 24 24">
  <use
    href="https://my-site.com/assets/icon-someHash.svg#use-href-target"
    style="--svg-use-href-color: red"
  ></use>
</svg>
```

`icon-someHash.svg` becomes the equivalent of this, and is served as an SVG
file:

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="var(--svg-use-href-color, #111)"
  id="use-href-target"
>
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

## Where to go from here

This is the repository root. To get started, consider
[reading about the core problem](#the-core-problem) and
[core solution](#the-core-solution-provided-here) that this package targets.

Then, refer to these links:

- Refer to [@svg-use/webpack](./packages/webpack) for the webpack loader
- Refer to [@svg-use/vite](./packages/vite) for the Vite plugin
- Refer to [@svg-use/rollup](./packages/rollup) for the Rollup plugin
- Refer to [@svg-use/core](./packages/core) for the core logic, which powers the
  bundler plugins
- Refer to [@svg-use/react](./packages/react) for the default React wrapper
  component
- Refer to [the examples directory](./examples/) for examples of usage with
  various bundlers and frameworks, as well as
  [thoughts about how to use this pattern in shared libraries](./examples/shared-library/)
- Refer to [Contributing](/CONTRIBUTING.md) for how to contribute to this
  project.

## The core problem

A common technique in the JS (and especially React) ecosystem is converting SVG
icons to components, so that they can be imported by JS code.
[One common library for this task is svgr](https://github.com/gregberge/svgr/),
which provides bundler plugins to facilitate converting SVG to JSX. Let's call
this approach SVG-in-JS, for the sake of comparison.

The SVG-in-JS approach is contrasted with referencing the SVG as an asset, and
using it in `img[src]` or in `svg > use[href]`. This library provides one such
alternative.

At its core, the SVG-in-JS solves a few different issues, in a convenient way.
Alternatives to it would have to take this problem space.

The first issue is **theming**. By including the SVG inline, one can use regular
HTML attributes and CSS selectors, and inherit custom properties easily. Most
often, this is done to inherit `currentColor`, but other, more bespoke custom
properties or theming schemes are also used.

Another issue **delivery / portability**. By lifting SVG into the realm of JS,
it can be loaded with ES modules, same as any other JS code. This is not a
particularly big deal for applications, which typically use bundlers that are
capable of referencing assets in the module graph. However, when it comes to
**shareable libraries**, this provides a delivery mechanism that works anywhere
that JS is supported, without any configuration on behalf of the user.

In general, referencing assets (such as images or even CSS) from JS is currently
not standardised. It is thus hard to ship reusable libraries that depend on
assets, at least in a general way, which does not assume one specific bundler
config. There are techniques that work with most current bundlers and web
browsers, such as `new URL('path/to/svg.svg', import.meta.url)`. These
techniques only solve the delivery problem though, and do not solve the theming
problem.

The SVG-in-JS approach is thus appealing, because it solves real problems in a
relatively simple way. However, it also comes with some drawbacks.

### Drawbacks of SVG-in-JS

By inlining SVGs in JS, we are incurring a number of runtime costs.

In short:

- Each component's code is parsed multiple times: first as JS, then as HTML/SVG
  when inserted into the document.
- Each SVG icon is duplicated in the DOM for every separate instance, bloating
  the DOM size, and taking time to parse.
- The size of the SVG icon adds to the JS bundle size. Some common SVG icons can
  be large, for example country flags with intricate designs. It is easy to
  accidentally inline large SVGs. This delays meaningful interactivity metrics.

[This article by Jacob 'Kurt' Groß dives into the different drawbacks of SVG-in-JS, as well as different alternatives.](https://kurtextrem.de/)

I believe that the runtime costs are big enough for many common cases, to
warrant an alternative.

## The core solution provided here

[SVG provides the `<use>` element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use),
which can reference same-origin external SVGs via the `href` attribute.

If we were to reference an SVG with `use`, it would look like this:

```html
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <use href="https://example.com/icon.svg#someId" style="--color: green;"></use>
</svg>
```

This library considers the above structure as the compilation target, and
provides a toolchain for achieving it.

In JS, developers would consume this structure like this:

```tsx
// Using a colocated SVG
import { Component as Arrow } from './arrow.svg?svgUse';

// Using an external library; the caller is none the wiser that `use` is used under the hood
import { ArrowRight } from 'my-shared-library';

const MyComponent = () => {
  return (
    <div>
      <Arrow color="currentColor" />
      <ArrowRight color="green" />
    <div>
  );
};
```

To make the above work, we need a few moving parts:

- a `url` to reference the external SVG by.
- an `id` to reference the external SVG by (while SVG 2 allows referencing
  without an id, that part does not seem supported in browsers).
- a `viewBox`, to allow intrinsic sizing of the outer `svg`.
- a themeing system, to allow us to customise the referenced SVG. This can be
  done with `currentColor` (for monochromatic icons) or via CSS properties,
  which can be inherited by the referenced SVG.
- a way to pass that information to a "wrapper" SVG component, which does the
  `svg > use[href]` setup.
- if a CDN is used to host static assets, it gets a bit more complicated, and we
  need a mechanism to rewrite the URLs, to enable proxying.

The core thesis is that the above setup is desirable in terms of its runtime
characteristics, but is more tedious to set up than SVG-in-JS, due to the lack
of a dedicated toolchain.

**`@svg-use` is meant to be exactly that toolchain**, so that developers do not
have to worry about the setup.

The packages are composable and easy to extend. Additionally, type safety and
user convenience are key; this should be as (or nearly as) convenient as
SVG-in-JS.

### Pros and cons of this approach

By referencing an external asset, we are avoiding the double-parsing and JS
bundle size costs; we only need to ship a URL and some metadata, as well as a
wrapper component. We are also reducing the DOM size, since a single `use` is
smaller than most icons (and involves fewer elements).

**Themeability** is achieved by the themeing transform, and can often be as
simple as passing down `currentColor`. The themeing is done statically, and has
no runtime cost.

The **portability** of this approach is good, because you can use the resulting
SVGs directly, and not just in React. You could even write out the `use[href]`
manually if you wanted, or create your own wrapper component, in your framework
of choice.

**Delivery** of shared libraries can be reliable, using the
`new URL('path/to/svg', import.meta.url)` pattern.
[An example with notes is provided for these cases](./examples/shared-library/README.md).

One downside, is the **lack of CORS** for SVG `use[href]` references. This is a
real issue, that can only be reliably solved at the specification level.
However, SVG-in-JS is often used for local and shared-library SVG use-cases,
which are self-hosted, so the lack of CORS is not an issue for replacing them.

In case you use a CDN for your application assets (including JS), the default
components provide configuration to rewrite the URLs at runtime, to point them
to a proxy.

All that said, there are certainly cases where inlining the SVGs is the better
or simpler approach, depending on your loading patterns. I do not claim that
this library will solve everything, but even if it leads to 80% of the SVGs no
longer being inlined in JS "by default", it will be a good step.

[Refer to FUTURE.md for developments that might make this approach more ergonomic](./FUTURE.md)

> [!NOTE]  
> The rest of this document is about diving in to the details, and contributing.
> Consider [where to go next](#where-to-go-from-here), for links to the concrete
> plugins and usage examples.

## In depth

Assuming the default configuration and a given bundler plugin.

When you write this:

```tsx
import { href, id, Component as ArrowIcon } from './arrow.svg?svgUse';

const MyComponent = () => {
  return (
    <button>
      <ArrowIcon color="currentColor" />
    </button>
  );
};
```

A bundler-specific plugin ([webpack](./packages/webpack/),
[rollup](./packages/rollup/), [vite](./packages/vite)) does the following:

- The plugin resolves `./some-icon.svg` and invokes
  [`@svg-use/core`](./packages/core)
  - Core parses `./some-icon.svg`, to ensure that it fulfills the invariants
  - Core extracts the `id` and `viewBox` of the top-level SVG element
  - Core runs a "themeing" function to turn the SVG element's fills and strokes
    into configurable CSS custom properties
  - Core returns the transformed SVG content, and the extracted information
- The plugin emits the transformed SVG as an asset (using to the bundler's
  logic), and resolves its would-be URL. The loader stores that URL.
- The plugin passes the URL to Core, to create a JS module. This is what the
  userland code ultimately sees.
  - The module exports the extracted properties, and passes them to a "component
    factory", for convenience.
- The plugin passes on the JS module to the bundler.

The ad-hoc JS module is the equivalent of this:

```tsx
import { createThemedExternalSvg } from '@svg-use/react';

export const id = 'use-href-target';
export const href = new URL('/assets/some-icon-1234.svg', import.meta.url).href;
export const viewBox = '0 0 32 32';

/* createThemedExternalSvg is a component factory function */
export const Component = createThemedExternalSvg({ href, id, viewBox });
```

This approach combines convenience (being able to just use `Component`), with
composition (being able to use `href` and `id` to build your own wrapper
components).
