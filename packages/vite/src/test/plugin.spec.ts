import { test, expect, describe } from 'vitest';

import { build } from './compiler.js';
import process from 'node:process';
import type { OutputAsset, OutputChunk, RollupOutput } from 'rollup';

// Simplifies all paths, by having rollup run in the current directory
process.chdir(import.meta.dirname);

const svgFixturePath = '__fixtures__/arrow.svg';
const svgFixturePathWithSuffix = `${svgFixturePath}?svgUse`;

const findEntryChunk = (output: RollupOutput['output']) =>
  output.find((v) => v.type === 'chunk' && v.isEntry) as OutputChunk;

const findAsset = (output: RollupOutput['output'], originalFileName: string) =>
  output.find(
    (v) => v.type === 'asset' && v.originalFileName?.endsWith(originalFileName),
  ) as OutputAsset | undefined;

test('converts *.svg?svgUse import into valid React component with svg[use], using defaults', async () => {
  const output = await build(svgFixturePathWithSuffix, {});

  const svgAsset = findAsset(output, svgFixturePath);
  expect(svgAsset?.source).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--svg-use-color-primary, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
  );

  const jsChunk = findEntryChunk(output);
  expect(jsChunk.code).toMatchInlineSnapshot(`
    "import { createThemedExternalSvg } from '@svg-use/react';

    const url = new URL('assets/arrow-BsgLFTQk.svg', import.meta.url).href;
    const id = "use-href-target";
    const viewBox = "0 0 24 24";

    const Component = createThemedExternalSvg({url, id, viewBox});

    export { Component, id, url, viewBox };
    "
  `);
});

test('converts *.svg?svgUse import when imported from JS', async () => {
  const output = await build('__fixtures__/input.js', {});

  const svgAsset = findAsset(output, svgFixturePath);
  expect(svgAsset?.source).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--svg-use-color-primary, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
  );

  const jsChunk = findEntryChunk(output);
  expect(jsChunk.code).toMatchInlineSnapshot(`
    "import { createThemedExternalSvg } from '@svg-use/react';

    const url = new URL('assets/arrow-BsgLFTQk.svg', import.meta.url).href;
    const id = "use-href-target";
    const viewBox = "0 0 24 24";

    const Component = createThemedExternalSvg({url, id, viewBox});

    export { Component as default };
    "
  `);
});

test('converts *.svg?svgUse&noTheme import when imported from JS, without touching the theme', async () => {
  const output = await build('__fixtures__/inputNoTheme.js', {});

  const svgAsset = findAsset(output, svgFixturePath);
  expect(svgAsset?.source).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
  );

  const jsChunk = findEntryChunk(output);
  expect(jsChunk.code).toMatchInlineSnapshot(`
    "import { createThemedExternalSvg } from '@svg-use/react';

    const url = new URL('assets/arrow-CHDfodaD.svg', import.meta.url).href;
    const id = "use-href-target";
    const viewBox = "0 0 24 24";

    const Component = createThemedExternalSvg({url, id, viewBox});

    export { Component as default };
    "
  `);
});

test('works with the default rollup assetFileNames option', async () => {
  const output = await build(
    svgFixturePathWithSuffix,
    {},
    {
      assetFileNames: 'my-assets/[name]-[hash:10][extname]',
    },
  );

  const svgAsset = findAsset(output, svgFixturePath);
  expect(svgAsset?.fileName).toMatch(
    /^my-assets\/arrow-[a-zA-Z0-9-]{10}\.svg$/,
  );
});

describe('plugin options', () => {
  test('can provide a custom id for the SVG root', async () => {
    const output = await build(svgFixturePathWithSuffix, {
      getSvgIdAttribute: () => 'my-id',
    });

    const svgAsset = findAsset(output, svgFixturePath);
    expect(svgAsset?.source).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--svg-use-color-primary, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="my-id"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
    );

    const jsChunk = findEntryChunk(output);
    expect(jsChunk.code).toMatchInlineSnapshot(`
      "import { createThemedExternalSvg } from '@svg-use/react';

      const url = new URL('assets/arrow-UUU4Y5Sw.svg', import.meta.url).href;
      const id = "my-id";
      const viewBox = "0 0 24 24";

      const Component = createThemedExternalSvg({url, id, viewBox});

      export { Component, id, url, viewBox };
      "
    `);
  });

  test('can customise the theme substitution', async () => {
    const output = await build(svgFixturePathWithSuffix, {
      getThemeSubstitutions: ({ fills, strokes }) => {
        if (fills.size > 1 || strokes.size > 1) {
          throw new Error('Only one fill and stroke are supported');
        }
        return {
          fills: new Map(
            Array.from(fills.entries()).map(([k]) => [
              k,
              'var(--color-primary)',
            ]),
          ),
          strokes: new Map(
            Array.from(strokes.entries()).map(([k]) => [
              k,
              'var(--color-primary)',
            ]),
          ),
        };
      },
    });

    const svgAsset = findAsset(output, svgFixturePath);
    expect(svgAsset?.source).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
    );
  });

  test('can customise the component factory', async () => {
    const output = await build(svgFixturePathWithSuffix, {
      componentFactory: {
        functionName: 'createMyThemedSvg',
        importFrom: 'my-library/svg',
      },
    });

    const jsChunk = findEntryChunk(output);
    expect(jsChunk.code).toMatchInlineSnapshot(`
      "import { createMyThemedSvg } from 'my-library/svg';

      const url = new URL('assets/arrow-BsgLFTQk.svg', import.meta.url).href;
      const id = "use-href-target";
      const viewBox = "0 0 24 24";

      const Component = createMyThemedSvg({url, id, viewBox});

      export { Component, id, url, viewBox };
      "
    `);
  });
});
