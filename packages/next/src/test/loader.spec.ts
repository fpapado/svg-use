import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { describe, test, expect } from 'vitest';
import { fileURLToPath } from 'node:url';

const fixturesvgPath = path.join(
  fileURLToPath(new URL('.', import.meta.url)),
  '__fixtures__/arrow.svg',
);

const arrowSvgContents = await fs.promises.readFile(fixturesvgPath, 'utf8');

// Requires 'pnpm build' before running tests (same as packages/webpack)
const { default: loader } = await import('../../dist/index.js');

async function runLoader({
  tempDir,
  ...options
}: { tempDir: string } & Record<string, unknown>) {
  const ctx = {
    getOptions: () => ({ outputDir: tempDir, ...options }),
    resourcePath: fixturesvgPath,
  };

  const jsModule = await loader.call(ctx, arrowSvgContents);
  const files = await fs.promises.readdir(tempDir);
  const assetFilename = files[0];

  const assetContent = await fs.promises.readFile(
    path.join(tempDir, assetFilename),
    'utf8',
  );

  return {
    jsModule,
    assetFilename,
    assetContent,
  };
}

test('converts *.svg import into a valid JS module with svg[use], using defaults', async () => {
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'svg-use-next-test-'),
  );

  const { jsModule, assetFilename, assetContent } = await runLoader({
    publicPath: '/_next/static/svgAssets/',
    tempDir,
  });

  expect(assetFilename).toMatch(/^arrow-[0-9a-f]{8}\.svg$/);

  expect(jsModule).toMatchInlineSnapshot(
    `
    "import {createThemedSvgUse} from "@svg-use/next/component";
      
    export const url = "/_next/static/svgAssets/arrow-501799d3.svg";
    export const id = "use-href-target";
    export const viewBox = "0 0 24 24";

    export const Component = createThemedSvgUse({url, id, viewBox});"
  `,
  );

  expect(assetContent).toMatchInlineSnapshot(
    `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--svg-use-color-primary, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
  );

  await fs.promises.rm(tempDir, { recursive: true, force: true });
});

describe('plugin options', () => {
  test('accepts a custom function to configure a theme', async () => {
    const tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'svg-use-next-test-'),
    );

    const { assetContent } = await runLoader({
      getThemeSubstitutions: ({
        fills,
        strokes,
      }: {
        fills: Map<string, number>;
        strokes: Map<string, number>;
      }) => {
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
      publicPath: '/_next/static/svgAssets/',
      tempDir,
    });

    expect(assetContent).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--my-color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
    );

    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  test('accepts a custom getSvgIdAttribute option', async () => {
    const tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'svg-use-next-test-'),
    );

    const { assetContent } = await runLoader({
      getSvgIdAttribute: () => 'my-id',
      publicPath: '/_next/static/svgAssets/',
      tempDir,
    });

    expect(assetContent).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--svg-use-color-primary, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="my-id"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
    );

    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  test('accepts getThemeSubstitutions: null to disable theming', async () => {
    const tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'svg-use-next-test-'),
    );

    const { assetContent } = await runLoader({
      getThemeSubstitutions: null,
      publicPath: '/_next/static/svgAssets/',
      tempDir,
    });

    // stroke stays as the original 'currentColor' — no CSS variable substitution
    expect(assetContent).toMatchInlineSnapshot(
      `"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right" id="use-href-target"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>"`,
    );

    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });
});
