import path from 'node:path';
import type { LoaderContext } from 'webpack';
import { interpolateName } from 'loader-utils';
import { defaultOptions, Options } from '../core/options.js';
import { createJsModule } from '../core/createJsModule.js';

export * from '../core/theme.js';

export interface LoaderOptions extends Options {
  /**
   * The output filename for the .svg resource.
   *
   * Uses the same syntax/replacements as webpack's native assetModuleFilename
   * and Rule.generator.filename.
   *
   * @default '[name]-[contenthash].[ext]' to the public directory
   *
   * @see https://webpack.js.org/guides/asset-modules/#custom-output-filename
   * @see https://webpack.js.org/configuration/output/#outputassetmodulefilename
   */
  svgAssetFilename?: string;
}

// TODO: For preload/prefetch use-cases, advise using the {url} import, paired
// with React.preload (React 19) or any other framework-specific thing

// TODO: It would be nice to consider sprite sheet use-cases, to load everything
// upfront. This is not an unconditional performance win (the sprite sheet can
// get large), but maybe sprite sheet bundles could be an option. e.g. there
// could be an easy way to make a "flag sprite sheet" bundle, a "UI icons sheet"
// bundle and so on. These could get loaded in parallel, or preloaded/prefetched
// at their own pace.
// A syntax could be import {Component, url, id} from './myIcon.svg?svgUseHref' with {svgUseHrefBundle: 'my-bundle'}

export default async function svgUseHrefLoader(
  this: LoaderContext<LoaderOptions>,
  contents: string,
): Promise<void> {
  const callback = this.async();

  // TODO: validate options with schema-utils
  const options: Required<LoaderOptions> = {
    svgAssetFilename: '[name]-[contenthash].[ext]',
    ...defaultOptions,
    ...this.getOptions(),
  };

  const basename = path.basename(this.resourcePath);

  // transformSvg uses ESM-only imports, so it is ESM itself. To work in CJS (at
  // the time of writing), we must use import()
  const { transformSvg } = await import('../core/transformSvg.mjs');

  const res = transformSvg(contents, {
    idCreationFunction: (existingId) =>
      options.getSvgIdAttribute({ filename: basename, existingId }),
    themeSubstitutionFunction: options.getThemeSubstitutions,
  });

  if (res.type === 'failure') {
    throw new Error(res.error);
  }

  const transformedSvg = res.data;

  // Emit a file with any hashing/name interpolations; the SVG will eventually
  // point to this place.
  const assetFilename = interpolateName(
    //@ts-expect-error -- loader-utils types do not match up; it is deprecated, but there is no simple replacement :shrug:
    this,
    options.svgAssetFilename,
    {
      content: transformedSvg.content,
    },
  );

  this.emitFile(assetFilename, transformedSvg.content, undefined, {
    // sourceFilename is the relative path from the compilation context, to the resource
    sourceFilename: path.relative(this.rootContext, this.resourcePath),
  });

  const jsModuleContent = createJsModule({
    // FIXME: For some reason, assetFilename does not work, but basename works
    // just fine! With basename, the original asset is used. We should make this
    // work the new one.
    // url: `new URL(${JSON.stringify(assetFilename)}, import.meta.url).href`,
    url: `__webpack_public_path__ + ${JSON.stringify(assetFilename)}`,
    id: JSON.stringify(transformedSvg.id),
    viewBox: JSON.stringify(transformedSvg.viewBox),
  });

  callback(null, jsModuleContent);
}
