import type { Plugin } from 'rollup';
import { defaultOptions, Options } from '../core/options.js';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import { createJsModule } from '../core/createJsModule.js';

export type PluginOptions = Options;

const SVG_USE_HREF_PREFIX = 'svg-use-href:';

const isRelevant = (id: string) => {
  if (!id) {
    return false;
  }

  return id.startsWith(SVG_USE_HREF_PREFIX) && id.endsWith('.svg');
};

function svgUseHrefPlugin(userOptions: PluginOptions): Plugin {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  return {
    name: 'svg-use-href',
    resolveId(source, importer) {
      if (!isRelevant(source)) {
        // other ids should be handled as usual
        return null;
      }

      const withoutPrefix = source.slice(SVG_USE_HREF_PREFIX.length);

      const resolvedId =
        importer !== undefined
          ? path.resolve(path.dirname(importer), withoutPrefix)
          : withoutPrefix;

      return SVG_USE_HREF_PREFIX + resolvedId;
    },
    async load(id) {
      if (!isRelevant(id)) {
        return;
      }

      const filepath = id.slice(SVG_USE_HREF_PREFIX.length);
      const basename = path.basename(filepath);
      const absolutePath = path.resolve(process.cwd(), filepath);
      const source = await fs.readFile(filepath, 'utf-8');

      // transformSvg uses ESM-only imports, so it is ESM itself. To work in CJS (at
      // the time of writing), we must use import()
      const { transformSvgForUseHref: transformSvg } = await import(
        '../core/transformSvg.mjs'
      );

      const res = transformSvg(source, {
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
      });

      return jsModuleContent;
    },
  };
}

export default svgUseHrefPlugin;
