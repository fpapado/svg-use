import type { Plugin } from 'rollup';
import {
  createJsModule,
  transformSvgForUseHref as transformSvg,
  type TransformOptions,
  type ModuleFactoryOptions,
  defaultComponentFactory,
  defaultGetSvgIdAttribute,
  defaultThemeSubstitution,
} from '@svg-use/core';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';

export type PluginOptions = Partial<
  Pick<TransformOptions, 'getThemeSubstitutions' | 'themableOptions'> &
    ModuleFactoryOptions & {
      getSvgIdAttribute: (info: {
        filename?: string;
        existingId?: string;
      }) => string;
    }
>;

type AdvancedOptions = {
  /**
   * A hook for changing the behavior of how an SVG asset is emitted, and its
   * URL resolved. Useful when implementing the Vite plugin, which does not
   * implement Rollup's `emitFile` method.
   *
   * You most likely do not need to configure this yourself.
   */
  emitSvgAsset?: ({
    moduleId,
    content,
  }: {
    moduleId: string;
    content: string;
  }) => {
    /**
     * A string that will be substituted as JS code when referencing the
     * asset's URL. NOTE: If you are returning a string literal, remember to
     * JSON.stringify it, otherwise it will be included verbatim.
     */
    urlForJsModuleReference: string;
  };
};

const splitQuery = (str: string) => str.split('?');

const isRelevant = (id: string) => {
  const [originalPath, query] = splitQuery(id);
  return originalPath.endsWith('.svg') && query?.split('&').includes('svgUse');
};

const hasNoTheme = (id: string) => {
  const [, query] = splitQuery(id);
  return query?.split('&').includes('noTheme');
};

const defaultOptions = {
  componentFactory: defaultComponentFactory,
  getSvgIdAttribute: defaultGetSvgIdAttribute,
  getThemeSubstitutions: defaultThemeSubstitution(),
  themableOptions: null,
} satisfies PluginOptions;

function svgUsePlugin(
  userOptions?: PluginOptions,
  advancedOptions: AdvancedOptions = {},
): Plugin {
  const options: Required<PluginOptions> = {
    ...defaultOptions,
    ...userOptions,
  };

  return {
    name: 'svg-use',
    resolveId(source, importer) {
      if (!isRelevant(source)) {
        // other ids should be handled as usual
        return null;
      }

      const [withoutQuery, originalQuery] = splitQuery(source);

      const resolvedId =
        importer !== undefined
          ? path.resolve(path.dirname(importer), withoutQuery)
          : withoutQuery;

      return resolvedId + `?${originalQuery}`;
    },
    async load(id) {
      if (!isRelevant(id)) {
        return;
      }

      const [filepath] = splitQuery(id);
      const basename = path.basename(filepath);
      const absolutePath = path.resolve(process.cwd(), filepath);
      const source = await fs.readFile(filepath, 'utf-8');

      const res = transformSvg(source, {
        // augment the existing function, with extra (filename) context
        getSvgIdAttribute: ({ existingId }) =>
          options.getSvgIdAttribute({ existingId, filename: basename }),
        getThemeSubstitutions: hasNoTheme(id)
          ? null
          : options.getThemeSubstitutions,
        themableOptions: options.themableOptions,
      });

      if (res.type === 'failure') {
        throw new Error(res.error);
      }

      const transformedSvg = res.data;

      let urlForJsModuleReference: string;

      if (advancedOptions.emitSvgAsset !== undefined) {
        const emit = advancedOptions.emitSvgAsset({
          moduleId: id,
          content: transformedSvg.content,
        });
        urlForJsModuleReference = emit.urlForJsModuleReference;
      } else {
        const referenceId = this.emitFile({
          type: 'asset',
          // Is provided as the [name] replacement in assetFilename
          name: basename,
          source: transformedSvg.content,
          // originalFileName is an on-disk absolute path, by convention
          originalFileName: absolutePath,
        });

        /**
         * @see https://rollupjs.org/plugin-development/#file-urls
         */
        urlForJsModuleReference = `import.meta.ROLLUP_FILE_URL_${referenceId}`;
      }

      const jsModuleContent = createJsModule(
        {
          url: urlForJsModuleReference,
          id: JSON.stringify(transformedSvg.id),
          viewBox: JSON.stringify(transformedSvg.viewBox),
        },
        {
          componentFactory: options.componentFactory,
        },
      );

      return jsModuleContent;
    },
  };
}

export default svgUsePlugin;
