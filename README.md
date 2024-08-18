# @svg-use

Tools and bundler plugins, to load SVG icons as components in JavaScript, via
SVG's `use[href]` mechanism. This offers a performant way to reference SVG in
components, while keeping them themeable and easy to use.

## Where to go from here

This is the repository root. To get started, consider
[reading about the core problem](#the-core-problem) and
[core solution](#the-core-solution-provided-here) that this package targets.

Then, refer to these links:

- Refer to [@svg-use/webpack](./packages/webpack) for the webpack loader
- Refer to [@svg-use/rollup](./packages/rollup) for the rollup plugin
- Refer to [@svg-use/core](./packages/core) for the core logic, which powers the
  bundler plugins
- Refer to [@svg-use/react](./packages/react) for the default React wrapper
  component
- Refer to [the examples directory](./examples/) for examples of usage with
  various bundlers and frameworks, as well as
  [thoughts about how to use this pattern in shared libraries](./examples/shared-library/)
- Refer to [Contributing](#contributing) for how to contribute to this project.

## The core problem

A common technique in the JS (and especially React) ecosystem is converting SVG
icons to components, so that they can be imported by JS code.
[One common library for this task is svgr](https://github.com/gregberge/svgr/),
which provides bundler plugins to facilitate converting SVG to JSX. Let's call
this approach SVG-in-JS, for the sake of comparison.

The SVG-in-JS approach is contrasted with referencing the SVG as an asset, and
using it in `img[href]` or in `svg > use[href]`. This library provides one such
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

If we were to write out an SVG with `use`, it would look like this:

```html
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <use href="https://example.com/icon.svg#someId" style="--color: green;"></use>
</svg>
```

This library considers the above structure as the compilation target.

In JS, developers would use this structure, to create components that can be
consumed like this:

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
However, many SVG-in-JS apply local or shared-library SVG use-cases, which are
self-hosted. In case you use a CDN for your application assets (including JS),
the default components provide functions to rewrite the URLs at runtime, to
point them to a proxy.

All that said, there are certainly cases where inlining the SVGs is the better
or simpler approach, depending on your loading patterns. I do not claim that
this library will solve everything, but even if it leads to 80% of the SVGs no
longer being inlined "by default", it will be a good step.

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
[rollup](./packages/rollup/)) does the following:

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

## Contributing

You are more than welcome to contribute to the tools here!

As a starter, you can:

- File an issue in this repository with your ideas.
- Follow the
  [setting up a development environment instructions](#setting-up-a-development-environment)

### Setting up a development environment

### Step 1: Get Node.js

We recommend to
[use `nvm` for managing your Node.js version](https://github.com/nvm-sh/nvm). We
recommend following
[the deeper shell integration section, to ensure that nvm is invoked automatically per directory](https://github.com/nvm-sh/nvm?tab=readme-ov-file#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file).

```sh
nvm install
nvm use
```

This ensures that you will always be using the node version that is specified in
the repository's `.nvmrc` file.

### Step 2: Install pnpm

We use [`pnpm`](https://pnpm.io/) for package management.

We recommend that you
[install `pnpm` via `corepack`, which is node's built-in way of managing package managers](https://pnpm.io/installation#using-corepack):

```shell
corepack enable
```

This ensures that your `pnpm` version will be in sync with the one specified in
the repository's `package.json` `packageManager` field.

### Step 3: Install and Run Tests

```shell
# install dependencies for all packages
pnpm install

# run tests for all packages
pnpm test
```

You are set up! Follow
["Linking local packages to your application"](#linking-local-packages-to-an-application),
for how to develop against an existing application.

## Linking local packages to an application

While developing library packages, it is useful to develop them locally, and
link them against a target application.

"Linking", in this case, means using a locally-built version as a dependency in
another application.

This section uses the following example:

- The relevant package is `@svg-use/core`
- The source repository path is `/Users/user/svg-use`
- The target application path is `/Users/user/my-app`

### Using the `file:` protocol

We recommend that you use the `file:` protocol to link the dependency to the
target application.

[The `file:` protocol ensures that peer dependencies are resolved according to the target application's `node_modules`](https://pnpm.io/cli/link#whats-the-difference-between-pnpm-link-and-using-the-file-protocol),
which is critical especially for `react`, which requires the same version across
an application.

The `file:` protocol is available in `pnpm`, `yarn` and `npm`.

In your target application `package.json`, add:

```json
{
  "dependencies": {
    "@svg-use/core": "file:/Users/user/svg-use/packages/core"
  }
}
```

Finally, install dependencies in the **target** application:

```shell
pnpm install
```

You are set up! Any changes you make to the relevant package will be reflected
to the target application (after building the relevant package). You only need
to link the package once.

#### Developing and re-building

Most of the time, when developing the relevant package, you would run a watcher
that re-builds it automatically.

In the **source** repository, run the `dev` command for the relevant package,
and its dependencies:

```shell
pnpm --filter "core..." run dev
```

(Note that `--filter "core..."` is
[pnpm's syntax for running a command in a workspace package, as well as its dependencies](https://pnpm.io/filtering))

#### One-off builds

You can alternatively run a production build for the relevant package and its
dependencies:

```shell
pnpm --filter "core..." run build
```
