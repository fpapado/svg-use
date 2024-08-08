import type { Configuration } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import * as path from 'node:path';
import type { LoaderOptions as SvgUseHrefOptions } from 'svg-use-href/webpack';
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
        test: /\.svg$/i,
        // Only process assets with ?svgUseHref; leave the rest up to webpack's
        // defaults
        resourceQuery: /svgUseHref/,
        // This ultimately returns JS code, and emits an asset
        type: 'javascript/auto',
        use: [
          // svg-use-href-loader emits an asset and returns a JS module;
          // we still need to specify how to load JS
          { loader: 'swc-loader', options: swcOptions },
          {
            loader: 'svg-use-href/webpack',
            options: {
              // customize to your heart's content
              svgAssetFilename: 'svgAssets/[name]-[contenthash].[ext]',
            } satisfies SvgUseHrefOptions,
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
