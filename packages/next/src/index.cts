import type {
  TransformOptions,
  ModuleFactoryOptions,
  ComponentFactory,
} from '@svg-use/core';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export type LoaderOptions = Partial<
  Pick<TransformOptions, 'getThemeSubstitutions' | 'fallbackRootFill'> &
    ModuleFactoryOptions & {
      /**
       * Required. The absolute directory path to write processed SVG assets
       * into. Next.js users typically pass:
       * `path.join(__dirname, '.next/static/svgAssets')`
       */
      outputDir: string;

      /**
       * The URL prefix prepended to the asset filename in the returned JS
       * module's `url` export.
       *
       * @defaultValue '/_next/static/svgAssets/'
       */
      publicPath?: string;

      /**
       * The output filename template for the processed SVG asset.
       * Supports the `[name]`, `[contenthash]`, and `[ext]` tokens.
       *
       * @defaultValue '[name]-[contenthash].[ext]'
       */
      svgAssetFilename?: string;

      /**
       * Derive the `id` attribute written on the root SVG element.
       * Receives both the source filename and any existing id.
       *
       * Same call signature as `@svg-use/webpack`'s `getSvgIdAttribute`.
       *
       * @defaultValue defaultGetSvgIdAttribute from @svg-use/core
       */
      getSvgIdAttribute?: (info: {
        filename?: string;
        existingId?: string;
      }) => string;
    }
>;

type MinimalLoaderContext = {
  getOptions(): Partial<LoaderOptions>;
  resourcePath: string;
};

function interpolateFilename(
  template: string,
  {
    name,
    contenthash,
    ext,
  }: { name: string; contenthash: string; ext: string },
): string {
  return template
    .replace('[name]', name)
    .replace('[contenthash]', contenthash)
    .replace('[ext]', ext);
}

/**
 * A Turbopack-compatible webpack loader that processes SVG files for use with
 * `svg > use[href]`. Compatible with Next.js 15.3+ (`turbopack.rules` config).
 *
 * Unlike `@svg-use/webpack`, this loader writes processed SVG assets directly
 * to `outputDir` using `fs.writeFileSync` instead of `this.emitFile`, which
 * Turbopack does not implement.
 *
 * The exported `url`, `id`, `viewBox`, and `Component` have the same shape as
 * the `@svg-use/webpack` loader, so the two can be swapped with minimal config
 * changes.
 */
export default async function svgUseLoader(
  this: MinimalLoaderContext,
  contents: string,
): Promise<string> {
  const {
    createJsModule,
    transformSvgForUseHref,
    defaultGetSvgIdAttribute,
    getDefaultThemeSubstitutionFunction,
    defaultFallbackRootFill,
  } = await import('@svg-use/core');

  const rawOptions = this.getOptions();

  if (!rawOptions.outputDir) {
    throw new Error('@svg-use/next: the outputDir option is required');
  }

  const publicPath = rawOptions.publicPath ?? '/_next/static/svgAssets/';
  const svgAssetFilename =
    rawOptions.svgAssetFilename ?? '[name]-[contenthash].[ext]';
  // Default to the RSC-compatible factory from @svg-use/next/component.
  // Unlike @svg-use/react's createThemedExternalSvg, it has no 'use client'
  // directive and no hooks, so the generated module is safe in Server Components.
  const defaultNextComponentFactory: ComponentFactory = {
    functionName: 'createThemedSvgUse',
    importFrom: '@svg-use/next/component',
  };
  const componentFactory = rawOptions.componentFactory ?? defaultNextComponentFactory;
  const getSvgIdAttribute = (rawOptions.getSvgIdAttribute ??
    defaultGetSvgIdAttribute) as (info: {
    filename?: string;
    existingId?: string;
  }) => string;
  const getThemeSubstitutions =
    rawOptions.getThemeSubstitutions !== undefined
      ? rawOptions.getThemeSubstitutions
      : getDefaultThemeSubstitutionFunction();
  const fallbackRootFill =
    rawOptions.fallbackRootFill !== undefined
      ? rawOptions.fallbackRootFill
      : defaultFallbackRootFill;

  const basename = path.basename(this.resourcePath);

  const result = transformSvgForUseHref(contents, {
    getSvgIdAttribute: ({ existingId }) =>
      getSvgIdAttribute({ filename: basename, existingId }),
    getThemeSubstitutions,
    fallbackRootFill,
  });

  if (result.type === 'failure') {
    throw new Error(result.error);
  }

  const { id, viewBox, content } = result.data;

  const name = path.basename(this.resourcePath, '.svg');
  const hash = crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
    .slice(0, 8);
  const assetFilename = interpolateFilename(svgAssetFilename, {
    name,
    contenthash: hash,
    ext: 'svg',
  });

  fs.mkdirSync(rawOptions.outputDir, { recursive: true });
  fs.writeFileSync(path.join(rawOptions.outputDir, assetFilename), content);

  const url = `${publicPath}${assetFilename}`;
  return createJsModule(
    {
      url: JSON.stringify(url),
      id: JSON.stringify(id),
      viewBox: JSON.stringify(viewBox),
    },
    { componentFactory },
  );
}
