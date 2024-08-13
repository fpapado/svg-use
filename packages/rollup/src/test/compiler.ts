import { type OutputOptions, rollup } from 'rollup';
import svgUseHref from '../../dist/index.js';

import type { PluginOptions } from '../index.js';

export async function build(
  fixturePath: string,
  pluginOptions: PluginOptions,
  outputOptions: OutputOptions = {},
) {
  const bundle = await rollup({
    input: fixturePath,
    plugins: [svgUseHref(pluginOptions)],
    // This is added by the plugin, but for simplicity we do not resolve it here
    external: ['@svg-use/react'],
  });

  // generate output specific code in-memory
  const { output } = await bundle.generate({
    ...outputOptions,
    file: 'bundle.js',
    format: 'es',
  });

  return output;
}
