/**
 * @vitest-environment node
 */
import path from 'node:path';
import { describe, test, expect } from 'vitest';

import { compile } from './compiler.js';

const svgFixturePath = '__fixtures__/arrow.svg';

test('converts *.svg import into valid React component with svg[use], using defaults', async () => {
  const { stats, filesystem, outputPath } = await compile(svgFixturePath, {
    // the default uses [hash], which changes for every compilation
    svgAssetFilename: 'images/[name]-[contenthash].[ext]',
  });

  const statsJson = stats.toJson({ source: true, assets: true });
  const output = statsJson.modules?.[0].source;

  expect(String(output)).toMatchInlineSnapshot(`
    "import {createThemedExternalSvg} from "@svg-use/react";
      
    export const url = __webpack_public_path__ + "images/arrow-8685472f952d45ad.svg";
    export const id = "use-href-target";
    export const viewBox = "0 0 24 24";

    export const Component = createThemedExternalSvg({url, id, viewBox});"
  `);

  // TODO: Factor this out into a helper (findAsset)
  const emittedSvgAsset = statsJson.assets?.find(
    (asset) =>
      asset.type === 'asset' &&
      asset.emitted &&
      asset.info.sourceFilename === svgFixturePath,
  );

  expect(emittedSvgAsset).toBeDefined();
  expect(emittedSvgAsset!.name).toMatchInlineSnapshot(
    `"images/arrow-8685472f952d45ad.svg"`,
  );

  const emittedSvgContent = filesystem.readFileSync(
    path.join(outputPath, emittedSvgAsset!.name),
    'utf8',
  );

  expect(emittedSvgContent).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="use-href-target"><path fill="none" d="M0 0h24v24H0z"/><path fill="var(--use-href-fill-primary, var(--color-text))" d="M22 11.5a.5.5 0 01-.5.5H3.706l6.148 6.146a.502.502 0 01-.708.708l-7-7a.502.502 0 010-.708l7-7a.502.502 0 01.708.708L3.707 11H21.5a.5.5 0 01.5.5"/></svg>"`,
  );
});

describe('plugin options', () => {
  test.only('accepts a custom function to configure a theme', async () => {
    const { stats, filesystem, outputPath } = await compile(svgFixturePath, {
      getThemeSubstitutions: ({ fills, strokes }) => {
        if (fills.size > 1 || strokes.size > 1) {
          throw new Error('Only one fill and stroke are supported');
        }
        return {
          fills: new Map(
            Array.from(fills.entries()).map(([k]) => [
              k,
              'var(--my-color-primary)',
            ]),
          ),
          strokes: new Map(
            Array.from(strokes.entries()).map(([k]) => [
              k,
              'var(--my-color-primary)',
            ]),
          ),
        };
      },
    });

    const statsJson = stats.toJson({ source: true, assets: true });

    const emittedSvgAsset = statsJson.assets?.find(
      (asset) =>
        asset.type === 'asset' &&
        asset.emitted &&
        asset.info.sourceFilename === svgFixturePath,
    );

    expect(emittedSvgAsset).toBeDefined();

    const emittedSvgContent = filesystem.readFileSync(
      path.join(outputPath, emittedSvgAsset!.name),
      'utf8',
    );

    expect(emittedSvgContent).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--my-color-primary)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
    );
  });

  test('accepts a custom id option', async () => {
    const { stats, filesystem, outputPath } = await compile(svgFixturePath, {
      getSvgIdAttribute: () => 'my-id',
    });

    const statsJson = stats.toJson({ source: true, assets: true });

    const emittedSvgAsset = statsJson.assets?.find(
      (asset) =>
        asset.type === 'asset' &&
        asset.emitted &&
        asset.info.sourceFilename === svgFixturePath,
    );

    expect(emittedSvgAsset).toBeDefined();

    const emittedSvgContent = filesystem.readFileSync(
      path.join(outputPath, emittedSvgAsset!.name),
      'utf8',
    );

    expect(emittedSvgContent).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="my-id"><path fill="none" d="M0 0h24v24H0z"/><path fill="var(--use-href-fill-primary, var(--color-text))" d="M22 11.5a.5.5 0 01-.5.5H3.706l6.148 6.146a.502.502 0 01-.708.708l-7-7a.502.502 0 010-.708l7-7a.502.502 0 01.708.708L3.707 11H21.5a.5.5 0 01.5.5"/></svg>"`,
    );
  });
});

// TODO: Add a test that is even more integration-y, checking usage in a JS/TS file