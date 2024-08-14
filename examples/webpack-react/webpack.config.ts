import type { Configuration } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import * as path from 'node:path';
// FIXME: This does not work atm, due to being in CJS instead of ESM
// import type { LoaderOptions as SvgUseOptions } from '@svg-use/webpack';
import { Config } from '@swc/core';

const swcOptions: Config = {
  jsc: {
    transform: {
      react: {
        runtime: 'automatic',
      },
    },
  },
};

const config: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  context: __dirname,
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [new HTMLWebpackPlugin()],
  module: {
    rules: [
      {
        // Make assets such as `arrow.svg?svgUse` compatible with `svg >
        // use[href]`. Emit an the transformed asset, and returned a JS module
        // with all the relevant information.
        test: /\.svg$/i,
        resourceQuery: /svgUse/,
        // This loader chain ultimately returns JS code, and emits an asset
        type: 'javascript/auto',
        use: [
          {
            loader: '@svg-use/webpack',
            options: {
              // customize to your heart's content
              svgAssetFilename: 'svgAssets/[name]-[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /(node_modules)/,
        use: [{ loader: 'swc-loader', options: swcOptions }],
      },
    ],
  },
};

export default config;
