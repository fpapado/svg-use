import { type Plugin, type ResolvedConfig } from 'vite';
import svgUseRollup, { type PluginOptions } from '@svg-use/rollup';
import stream from 'node:stream';

export type { PluginOptions } from '@svg-use/rollup';

const DEV_PREFIX = '/@svg-use/';
const devPrefixedId = (id: string) => DEV_PREFIX + id;

function svgUsePlugin(userOptions?: PluginOptions): Plugin {
  let command: ResolvedConfig['command'] | undefined;
  const svgAssets: Map<string, string> = new Map();

  return {
    // Run before Vite's default plugins, which handle SVG files in a different way
    enforce: 'pre',
    configResolved(resolvedConfig) {
      command = resolvedConfig.command;
    },
    configureServer(server) {
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
    ...svgUseRollup(userOptions, {
      emitSvgAsset:
        command === 'build'
          ? undefined
          : ({ moduleId, content }) => {
              // emitFile is not available in Vite dev mode, so we must serve
              // the transformed SVG manually from memory
              const prefixedId = devPrefixedId(moduleId);

              svgAssets.set(prefixedId, content);

              return {
                /* NOTE: We want to access import.meta.url, in order to create a
                 * fully-formed URL. However, if we wrote `new
                 * URL(${JSON.stringify(prefixedId)}, import.meta.url), then
                 * Vite's `vite:asset-import-meta-url` would pick it up, and
                 * transform it to an `/@fs/`-prefixed asset reference.
                 *
                 * We _could_ decide to intercept `/@fs/`-prefixed references in
                 * our server, but that seems ugly/hacky.
                 *
                 * Thus, we use @vite-ignore, which is Vite's built-in way of
                 * skipping the default transform.
                 */
                urlForJsModuleReference: `new URL(/* @vite-ignore */ ${JSON.stringify(prefixedId)}, import.meta.url)`,
              };
            },
    }),
  };
}

export default svgUsePlugin;
