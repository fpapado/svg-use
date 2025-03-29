import path from 'node:path';
import type { LoaderContext } from 'webpack';
import { interpolateName } from 'loader-utils';
import {
  createJsModule,
  transformSvgForUseHref,
  type TransformOptions,
  type ModuleFactoryOptions,
  defaultComponentFactory,
  defaultGetSvgIdAttribute,
  getDefaultThemeSubstitutionFunction,
  defaultFallbackRootFill,
} from '@svg-use/core';

export type LoaderOptions = Partial<
  Pick<TransformOptions, 'getThemeSubstitutions' | 'fallbackRootFill'> &
    ModuleFactoryOptions & {
      /**
       * The output filename for the .svg resource.
       *
       * Uses the same syntax/replacements as webpack's native assetModuleFilename
       * and Rule.generator.filename.
       *
       * @defaultValue '[name]-[contenthash].[ext]' to the public directory
       *
       * @see https://webpack.js.org/guides/asset-modules/#custom-output-filename
       * @see https://webpack.js.org/configuration/output/#outputassetmodulefilename
       */
      svgAssetFilename?: string;
      getSvgIdAttribute: (info: {
        filename?: string;
        existingId?: string;
      }) => string;
    }
>;

const defaultOptions = {
  svgAssetFilename: '[name]-[contenthash].[ext]',
  componentFactory: defaultComponentFactory,
  getSvgIdAttribute: defaultGetSvgIdAttribute,
  getThemeSubstitutions: getDefaultThemeSubstitutionFunction(),
  fallbackRootFill: defaultFallbackRootFill,
} satisfies LoaderOptions;

export default function svgUseLoader(
  this: LoaderContext<LoaderOptions>,
  contents: string,
): void {
  const callback = this.async();

  // TODO: validate options with schema-utils
  const options: Required<LoaderOptions> = {
    ...defaultOptions,
    ...this.getOptions(),
  };

  const basename = path.basename(this.resourcePath);

  const res = transformSvgForUseHref(contents, {
    getSvgIdAttribute: ({ existingId }) =>
      options.getSvgIdAttribute({ filename: basename, existingId }),
    getThemeSubstitutions: options.getThemeSubstitutions,
    fallbackRootFill: options.fallbackRootFill,
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

  const jsModuleContent = createJsModule(
    {
      url: `__webpack_public_path__ + ${JSON.stringify(assetFilename)}`,
      id: JSON.stringify(transformedSvg.id),
      viewBox: JSON.stringify(transformedSvg.viewBox),
    },
    {
      componentFactory: options.componentFactory,
    },
  );

  callback(null, jsModuleContent);
}
