/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { createFsFromVolume, type IFs, Volume } from 'memfs';
import path from 'node:path';
import type { Compiler, Stats } from 'webpack';
import webpack from 'webpack';

import type { LoaderOptions } from '../../webpack/index.js';

function compileAsync(compiler: Compiler): Promise<Stats> {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
        return;
      }
      if (!stats) {
        reject();
        return;
      }
      if (stats.hasErrors()) {
        reject(stats.toJson().errors);
        return;
      }
      resolve(stats);
    });
  });
}

const outputPath = path.resolve(__dirname, 'dist');

const createCompiler = (
  fixture: string,
  filesystem: IFs,
  options: LoaderOptions,
) => {
  const compiler = webpack({
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      minimize: false,
    },
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: outputPath,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.svg$/i,
          // using asset/resource to get the literal transformed module, and
          // avoid the need for testing across JSX transforms
          type: 'asset/resource',
          use: [
            {
              loader: path.resolve(
                __dirname,
                '../../../dist/esm/webpack/index.js',
              ),
              options,
            },
          ],
        },
      ],
    },
  });

  // Avoid writing to the real filesystem :)
  //@ts-expect-error -- the types for callbacks do not line up
  compiler.outputFileSystem = filesystem;

  return compiler;
};

export const compile = async (fixture: string, options: LoaderOptions) => {
  const filesystem = createFsFromVolume(new Volume());
  const compiler = createCompiler(fixture, filesystem, options);

  const stats = await compileAsync(compiler);

  return {
    stats,
    outputPath: compiler.outputPath,
    filesystem,
  };
};
