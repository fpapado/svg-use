/**
 * @vitest-environment node
 */
import { test, expect, describe } from 'vitest';

import { build } from './compiler.js';
import process from 'node:process';
import type { OutputAsset, OutputChunk, RollupOutput } from 'rollup';

// Simplifies all paths, by having rollup run in the current directory
process.chdir(import.meta.dirname);

const svgFixturePath = '__fixtures__/arrow.svg';
const svgFixturePathWithPrefix = `svg-use:${svgFixturePath}`;

const findEntryChunk = (output: RollupOutput['output']) =>
  output.find((v) => v.type === 'chunk' && v.isEntry) as OutputChunk;

const findAsset = (output: RollupOutput['output'], originalFileName: string) =>
  output.find(
    (v) => v.type === 'asset' && v.originalFileName?.endsWith(originalFileName),
  ) as OutputAsset | undefined;

test('converts *.svg import into valid React component with svg[use], using defaults', async () => {
  const output = await build(svgFixturePathWithPrefix, {});

  const svgAsset = findAsset(output, svgFixturePath);
  expect(svgAsset?.source).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="use-href-target"><path fill="none" d="M0 0h24v24H0z"/><path fill="var(--use-href-fill-primary, var(--color-text))" d="M22 11.5a.5.5 0 01-.5.5H3.706l6.148 6.146a.502.502 0 01-.708.708l-7-7a.502.502 0 010-.708l7-7a.502.502 0 01.708.708L3.707 11H21.5a.5.5 0 01.5.5"/></svg>"`,
  );

  const jsChunk = findEntryChunk(output);
  expect(jsChunk.code).toMatchInlineSnapshot(`
    "import { createThemedExternalSvg } from '@svg-use/react';

    const url = new URL('assets/arrow-TcJD63D9.svg', import.meta.url).href;
    const id = "use-href-target";
    const viewBox = "0 0 24 24";

    const Component = createThemedExternalSvg({url, id, viewBox});

    export { Component, id, url, viewBox };
    "
  `);
});

test('converts *.svg import when imported from JS', async () => {
  const output = await build('__fixtures__/input.js', {});

  const svgAsset = findAsset(output, svgFixturePath);
  expect(svgAsset?.source).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="use-href-target"><path fill="none" d="M0 0h24v24H0z"/><path fill="var(--use-href-fill-primary, var(--color-text))" d="M22 11.5a.5.5 0 01-.5.5H3.706l6.148 6.146a.502.502 0 01-.708.708l-7-7a.502.502 0 010-.708l7-7a.502.502 0 01.708.708L3.707 11H21.5a.5.5 0 01.5.5"/></svg>"`,
  );

  const jsChunk = findEntryChunk(output);
  expect(jsChunk.code).toMatchInlineSnapshot(`
    "import { createThemedExternalSvg } from '@svg-use/react';

    const url = new URL('assets/arrow-TcJD63D9.svg', import.meta.url).href;
    const id = "use-href-target";
    const viewBox = "0 0 24 24";

    const Component = createThemedExternalSvg({url, id, viewBox});

    export { Component as default };
    "
  `);
});

test('works with the default rollup assetFileNames option', async () => {
  const output = await build(
    svgFixturePathWithPrefix,
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
    const output = await build(svgFixturePathWithPrefix, {
      getSvgIdAttribute: () => 'my-id',
    });

    const svgAsset = findAsset(output, svgFixturePath);
    expect(svgAsset?.source).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="my-id"><path fill="none" d="M0 0h24v24H0z"/><path fill="var(--use-href-fill-primary, var(--color-text))" d="M22 11.5a.5.5 0 01-.5.5H3.706l6.148 6.146a.502.502 0 01-.708.708l-7-7a.502.502 0 010-.708l7-7a.502.502 0 01.708.708L3.707 11H21.5a.5.5 0 01.5.5"/></svg>"`,
    );

    const jsChunk = findEntryChunk(output);
    expect(jsChunk.code).toMatchInlineSnapshot(`
      "import { createThemedExternalSvg } from '@svg-use/react';

      const url = new URL('assets/arrow-BmBT1YU4.svg', import.meta.url).href;
      const id = "my-id";
      const viewBox = "0 0 24 24";

      const Component = createThemedExternalSvg({url, id, viewBox});

      export { Component, id, url, viewBox };
      "
    `);
  });

  test('can customise the theme substitution', async () => {
    const output = await build(svgFixturePathWithPrefix, {
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
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="use-href-target"><path fill="none" d="M0 0h24v24H0z"/><path fill="var(--color-primary)" d="M22 11.5a.5.5 0 01-.5.5H3.706l6.148 6.146a.502.502 0 01-.708.708l-7-7a.502.502 0 010-.708l7-7a.502.502 0 01.708.708L3.707 11H21.5a.5.5 0 01.5.5"/></svg>"`,
    );
  });

  test('can customise the component factory', async () => {
    const output = await build(svgFixturePathWithPrefix, {
      componentFactory: {
        functionName: 'createMyThemedSvg',
        importFrom: 'my-library/svg',
      },
    });

    const jsChunk = findEntryChunk(output);
    expect(jsChunk.code).toMatchInlineSnapshot(`
      "import { createMyThemedSvg } from 'my-library/svg';

      const url = new URL('assets/arrow-TcJD63D9.svg', import.meta.url).href;
      const id = "use-href-target";
      const viewBox = "0 0 24 24";

      const Component = createMyThemedSvg({url, id, viewBox});

      export { Component, id, url, viewBox };
      "
    `);
  });
});
