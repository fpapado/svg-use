import type { Plugin, ViteDevServer } from 'vite';
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
import stream from 'node:stream';

export type PluginOptions = Partial<
  Pick<TransformOptions, 'getThemeSubstitutions'> &
    ModuleFactoryOptions & {
      getSvgIdAttribute: (info: {
        filename?: string;
        existingId?: string;
      }) => string;
    }
>;

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
  getThemeSubstitutions: defaultThemeSubstitution,
} satisfies PluginOptions;

const DEV_PREFIX = '/@svg-use/';
const devPrefixedId = (id: string) => DEV_PREFIX + id;

function svgUsePlugin(userOptions: PluginOptions): Plugin {
  const options: Required<PluginOptions> = {
    ...defaultOptions,
    ...userOptions,
  };

  let server: ViteDevServer | undefined;
  const svgAssets: Map<string, string> = new Map();

  return {
    name: 'svg-use',
    configureServer(_server) {
      server = _server;

      server.middlewares.use((req, res, next) => {
        const knownAsset = req.url && svgAssets.get(req.url);

        if (!knownAsset) {
          return next();
        }

        const fileContent = Buffer.from(knownAsset, 'utf8');
        const readStream = new stream.PassThrough();
        readStream.end(fileContent);
        res.writeHead(200, {
          'Content-Type': 'image/svg+xml',
        });
        readStream.pipe(res);
        return;
      });
    },
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
      });

      if (res.type === 'failure') {
        throw new Error(res.error);
      }

      const transformedSvg = res.data;

      if (server) {
        // emitFile is not available in Vite dev mode (i.e. when server is
        // available), so we must serve the transformed SVG manually from memory
        const prefixedId = devPrefixedId(id);

        svgAssets.set(prefixedId, transformedSvg.content);

        const jsModuleContent = createJsModule(
          {
            /* NOTE: We want access to import.meta.url, in order to create a
             * fully-formed URL. However, if we wrote `new
             * URL(${JSON.stringify(prefixedId)}, import.meta.url), then Vite's
             * `vite:asset-import-meta-url` would pick it up, and transform it
             * to an `/@fs/`-prefixed asset reference.
             *
             * We _could_ decide to intercept `/@fs/`-prefixed references in our
             * server, but that seems ugly/hacky. Thus, we use @vite-ignore,
             * which is Vite's default way of skipping the transform.
             */
            url: `new URL(/* @vite-ignore */ ${JSON.stringify(prefixedId)}, import.meta.url)`,
            id: JSON.stringify(transformedSvg.id),
            viewBox: JSON.stringify(transformedSvg.viewBox),
          },
          {
            componentFactory: options.componentFactory,
          },
        );

        return jsModuleContent;
      } else {
        const referenceId = this.emitFile({
          type: 'asset',
          // Is provided as the [name] replacement in assetFilename
          name: basename,
          source: transformedSvg.content,
          // originalFileName is an on-disk absolute path, by convention
          originalFileName: absolutePath,
        });

        const jsModuleContent = createJsModule(
          {
            url: `import.meta.ROLLUP_FILE_URL_${referenceId}`,
            id: JSON.stringify(transformedSvg.id),
            viewBox: JSON.stringify(transformedSvg.viewBox),
          },
          {
            componentFactory: options.componentFactory,
          },
        );

        return jsModuleContent;
      }
    },
  };
}

export default svgUsePlugin;
