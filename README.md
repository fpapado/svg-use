# svg-use-href

Tools and bundler plugins, to load SVG files via `svg > use[href]`, instead of
inlining them as React components.

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

- Need to enforce a few invariants:
  - viewBox
  - an id (and extract it)
  - optionally: themeability
- Need to extract the id, and link the props to the theme. We then provide the
  href + id to the caller

### In depth

Assuming the default configuration.

When you write this:

```tsx
import { href, id, Component as ArrowIcon } from './some-icon.svg?svgUseHref';

const MyComponent = () => {
  return (
    <button>
      <ArrowIcon />
    </button>
  );
};
```

The loader does the following steps:

- It parses `./some-icon.svg`, to ensure that it fulfills the invariants
- It extracts the `id` of the top-level SVG element
- It runs the [theme extractor]() (or the default one) to turn the SVG element's
  fills and strokes into configurable CSS custom properties
- It emits `./some-icon.svg` as an asset (using to the bundler's logic), which
  writes it to disk under some URL. The loader stores that URL.
- It creates an ad-hoc JS module, that exports the `href`, the `id`, as well as
  a React component, for convenience. This is what our code ultimately sees.

The ad-hoc JS module is the equivalent of this:

```tsx
import { createThemedExternalSvg } from 'svg-use-href/react';

export const id = 'svg-use-href';
export const href = new URL('/assets/some-icon-1234.svg', import.meta.url).href;
export const viewBox = "0 0 32 32'

/* createThemedExternalSvg is a component factory function */
export const Component = createThemedExternalSvg({ href, id, viewBox });
```

This approach combines convenience (being able to just use `Component`), with
composition (being able to use `href` and `id` to build your own wrapper
components).

We do not currently allow customising the ad-hoc JS module (e.g. via
templating), but we are interested to hear, if you have use-cases that are not
solvable with composition.

## What if I need a different top-level SVG component?

If you need a different top-level SVG component (for example, if you have
different theme props than the default ones), you can use the `{id, href}`
properties from the loader. You will then pass them to your own component, which
you can import.

```tsx
import { href, id } from './some-icon.svg?svgUseHref';
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

Note that `svg-use-href-loader/react` provides a handful of utilities and types
for implementing custom components. You can use those either directly, or as
inspiration for your own API design.

If you want to modularise your icons further, we recommend creating a component
factory function, similar to the `createSimpleExternalSvg` factory that is used
internally ([consult the source here]()).

You could then write code like this:

```tsx
/* ArrowIcon.tsx */
import { createCustomSvgComponent } from 'path-to-custom-svg-component';
import { href, id } from './arrow-icon.svg?svgUseHref';

// This creates a react component, that has its own types,
// perhaps tailored to your theme or usage patterns
export const ArrowIcon = createCustomSvgComponent({ href, id });
```

TODO: Instead of templating, we could allow customising the import path to the
factory function! Then users could write their own. However, users should take
care to customise their ambient types.

## About the types

The default types assume that you are using the [recommended config]() for the
URL parameters and the top-level component.

Under the hood, the types are ambient module declarations, which is the
equivalent of telling TypeScript "trust me, if a module with this pattern
exists, then it will have this structure".

If you are using different config, for example different URL structure for the
loaders, or if you do not wish to use the top-level component (TODO: create a
glossary somewhere, so that we can define "top-level component"), then **you
should not use the default types**.

Instead, [consult how the default types are written](), and write the equivalent
for your needs.

Here is how you would write a declaration for path `?externalSvg` and with a
different `Component` factory

## Where to go from here

This is the repository root. To get started, consult these packages:

- Refer to [](./packages/) for the core loader and component

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

- The relevant package is `svg-use-href`
- The source repository path is `/Users/user/svg-use-href`
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
    "svg-use-href": "file:/Users/user/svg-use-href/packages/svg-use-href"
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
pnpm --filter "svg-use-href..." run dev
```

(Note that `--filter "svg-use-href..."` is
[pnpm's syntax for running a command in a workspace package, as well as its dependencies](https://pnpm.io/filtering))

#### One-off builds

You can alternatively run a production build for the relevant package and its
dependencies:

```shell
pnpm --filter "svg-use-href..." run build
```
