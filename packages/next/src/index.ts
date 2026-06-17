import type { TransformOptions, ModuleFactoryOptions } from '@svg-use/core';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export type LoaderOptions = Partial<
  Pick<TransformOptions, 'getThemeSubstitutions' | 'fallbackRootFill'> &
    ModuleFactoryOptions & {
      /**
       * Required. The absolute directory path to write processed SVG assets
       * into. Next.js users typically pass:
       * `path.join(__dirname, 'public/generated/svgs')`
       */
      outputDir: string;

      /**
       * The URL prefix prepended to the asset filename in the returned JS
       * module's `url` export.
       *
       * @defaultValue '/generated/svgs/'
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
       * @defaultValue defaultGetSvgIdAttribute from `@svg-use/core`
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

/**
 * A Turbopack-compatible loader that processes SVG files for use with
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
) {
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

  const {
    componentFactory = {
      functionName: 'createThemedSvgUse',
      importFrom: '@svg-use/next/component',
    },
    fallbackRootFill = defaultFallbackRootFill,
    getSvgIdAttribute = defaultGetSvgIdAttribute,
    getThemeSubstitutions = getDefaultThemeSubstitutionFunction(),
    outputDir,
    publicPath = '/generated/svgs/',
    svgAssetFilename = '[name]-[contenthash].[ext]',
  } = rawOptions;

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

  const assetFilename = svgAssetFilename
    .replace('[name]', name)
    .replace('[contenthash]', hash)
    .replace('[ext]', 'svg');

  await fs.promises.mkdir(outputDir, { recursive: true });
  await fs.promises.writeFile(path.join(outputDir, assetFilename), content);

  return createJsModule(
    {
      url: JSON.stringify(`${publicPath}${assetFilename}`),
      id: JSON.stringify(id),
      viewBox: JSON.stringify(viewBox),
    },
    { componentFactory },
  );
}
