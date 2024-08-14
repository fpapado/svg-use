# @svg-use

Tools and bundler plugins, to load SVG files as components via
`svg > use[href]`, instead of inlining them as JS code.

## The core problem

TODO:

- Known problems with inlining (tripe-parsing, download cost, often transforming
  SVG files at the source)
- Primary motivator: theming and setting properties, portability (especially for
  shared libraries)
- Core thesis: keep SVG-as-react for the root, to allow top-level
  customisations. Keep the content as SVG itself.
- Make it composable and easy to extend, without having to change the loader
  itself.
- Keep the loader logic to a minimum to allow portability between bundlers.
  - You can run the CLI to ensure themeability + IDs

## The core solution

- `svg` provides the `use` element, which can reference same-origin external
  SVGs via the `href` attribute.
- To make that work, we need a few invariants:
  - an `id` to reference the external SVG by (while SVG 2 allows referencing
    without an id, that does not seem supported in browsers)
  - a `viewBox`, to allow more flexible scaling
- We also need a `theme` system, to allow us to customise the referenced SVG.
  This is done via CSS properties, which can be inherited by the referenced SVG.
- In other words, we need to transform an SVG, to make it themed and extract the
  id. We pass those as props to a wrapper component, which does the
  `svg > use[href]` dance.
- Type safety and user convenience are key; this should be as (or nearly as)
  convenient as just inlining the SVGs.

### In depth

Assuming the default configuration and a given loader.

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

Then `@svg-use/core` does the following steps:

- It parses `./some-icon.svg`, to ensure that it fulfills the invariants
- It extracts the `id` of the top-level SVG element
- It runs a `theme` function to turn the SVG element's fills and strokes into
  configurable CSS custom properties
- It returns the transformed SVG, as well as a JS module, that references the
  extracted properties, and passes them to a "component factory", for
  convenience.

Additionally, a bundler-specific plugin or loader does the following:

- It emits the transformed SVG as an asset (using to the bundler's logic), which
  writes it to disk under some URL. The loader stores that URL.
- It wires up the JS module to the bundler. This is what the userland code
  ultimately sees.

The ad-hoc JS module is the equivalent of this:

```tsx
import { createThemedExternalSvg } from '@svg-use/react';

export const id = 'use-href-target';
export const href = new URL('/assets/some-icon-1234.svg', import.meta.url).href;
export const viewBox = "0 0 32 32'

/* createThemedExternalSvg is a component factory function */
export const Component = createThemedExternalSvg({ href, id, viewBox });
```

This approach combines convenience (being able to just use `Component`), with
composition (being able to use `href` and `id` to build your own wrapper
components).

## What if I need a different top-level SVG component?

If you need a different top-level SVG component (for example, if you have
different theme props than the default ones), you can use the `{id, href}`
properties from the loader. You will then pass them to your own component, which
you can import.

```tsx
import { href, id } from './some-icon.svg?svgUse';
import { CustomSvgComponent } from './CustomSvgComponent';

const MyComponent = () => {
  return (
    <button>
      {/* CustomSvgComponent presumably wires up svg > use[href], among other things */}
      <CustomSvgComponent href={href} id={id} />
    </button>
  );
};
```

This lacks some of the convenience of the top-level `Component` export, but
should be workable.

Note that `@svg-use/react` provides a handful of utilities and types for
implementing custom components. You can use those either directly, or as
inspiration for your own API design.

If you want to modularise your icons further, we recommend creating a component
factory function, similar to the `createSimpleExternalSvg` factory that is used
internally.

You could then write code like this:

```tsx
/* ArrowIcon.tsx */
import { createCustomSvgComponent } from 'path-to-custom-svg-component';
import { href, id } from './arrow-icon.svg?svgUse';

// This creates a react component, that has its own types,
// perhaps tailored to your theme or usage patterns
export const ArrowIcon = createCustomSvgComponent({ href, id });
```

To support this pattern, `@svg-use/core` provides the `componentFactory`
configuration option.

## About the types

The default types assume that you are using the recommended config for the URL
parameters and the top-level component.

Under the hood, the types are ambient module declarations, which is the
equivalent of telling TypeScript "trust me, if a module with this pattern
exists, then it will have this structure".

If you are using different config, for example different URL structure for the
loaders, or if you do not wish to use the top-level component (TODO: create a
glossary somewhere, so that we can define "top-level component"), then **you
should not use the default types**.

Instead, consult how the default types are written, and write the equivalent for
your needs.

## Where to go from here

This is the repository root. To get started, consult these packages:

- Refer to [@svg-use/core](./packages/core) for the core logic
- Refer to [@svg-use/webpack](./packages/webpack) for the core logic
- Refer to [@svg-use/rollup](./packages/rollup) for the core logic
- Refer to [@svg-use/react](./packages/react) for the default React wrapper
- Refer to [the examples directory](./examples/) for examples of usage with
  various bundlers and frameworks, as well as
  [thoughts about how to use this pattern in shared libraries](./examples/shared-library/)

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
