import type { Plugin } from 'rollup';
import {
  defaultOptions,
  Options,
  createJsModule,
  transformSvgForUseHref as transformSvg,
} from '@svg-use/core';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';

export type PluginOptions = Options;

const splitQuery = (str: string) => str.split('?');

const isRelevant = (id: string) => {
  const [originalPath, query] = splitQuery(id);
  return originalPath.endsWith('.svg') && query.split('&').includes('svgUse');
};

function svgUsePlugin(userOptions: PluginOptions): Plugin {
  const options = {
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

      const res = await transformSvg(source, {
        idCreationFunction: (existingId) =>
          options.getSvgIdAttribute({ filename: basename, existingId }),
        themeSubstitutionFunction: options.getThemeSubstitutions,
      });

      if (res.type === 'failure') {
        throw new Error(res.error);
      }

      const transformedSvg = res.data;

      const referenceId = this.emitFile({
        type: 'asset',
        // Is provided as the [name] replacement in assetFilename
        name: basename,
        source: transformedSvg.content,
        // originalFileName is an on-disk absolute path, by convention
        originalFileName: absolutePath,
      });

      const jsModuleContent = createJsModule({
        url: `import.meta.ROLLUP_FILE_URL_${referenceId}`,
        id: JSON.stringify(transformedSvg.id),
        viewBox: JSON.stringify(transformedSvg.viewBox),
        componentFactory: options.componentFactory,
      });

      return jsModuleContent;
    },
  };
}

export default svgUsePlugin;
