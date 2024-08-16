# `@svg-use/core`

Core utilities for transforming an SVG to make it compatible with `use[href]`
(for example ensuring an id, extracting id and viewBox, making it themeable).

Also includes utilities for creating JS modules, to facilitate bundler plugins
or more bespoke code generation.

If you want to integrate svg-use into an existing pipeline, look into
[the webpack loader](../webpack/) or [the rollup plugin](../rollup/).

If you want to transform SVG for a reusable component library (instead of an
application), or as a codegen step (instead of bundler plugins), then
[consult the reusable library example](../../examples/shared-library/)

## Quick start

```shell
pnpm install --save-dev @svg-use/core
```

Here are the basic transformations, assuming some SVG content in scope:

```tsx
import {
  transformSvgForUseHref,
  createJsModule,
  defaultGetSvgIdAttribute,
  defaultThemeSubstitution,
  defaultComponentFactory,
} from '@svg-use/core';

function transformAndWriteModule(content: string) {
  const transformResult = transformSvgForUseHref(content, {
    getSvgIdAttribute: defaultGetSvgIdAttribute,
    getThemeSubstitutions: defaultThemeSubstitution,
  });

  if (transformResult.type === 'failure') {
    throw new Error(transformResult.error);
  }

  const {
    data: { content: transformedSvg, id, viewBox },
  } = transformResult;

  const jsModuleCode = createJsModule(
    {
      url: /* fill in an applicable URL here; depends on the context */,
      id: JSON.stringify(id),
      viewBox: JSON.stringify(viewBox),
    },
    {
      componentFactory: defaultComponentFactory,
    },
  );
}
```

## API reference

[Find the full API reference](./api-docs/README.md)
