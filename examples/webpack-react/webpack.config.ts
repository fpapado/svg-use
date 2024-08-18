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
        // Match assets such as `arrow.svg?svgUse`, making them compatible with `svg >
        // use[href]`. Emit a transformed SVG asset, and return a JS module
        // with all the relevant information.
        test: /\.svg$/i,
        resourceQuery: {
          and: [/svgUse/i, { not: [/noTheme/i] }],
        },
        // This loader chain ultimately returns JS code, and emits an asset
        type: 'javascript/auto',
        use: [
          {
            loader: '@svg-use/webpack',
            options: {
              // Customise to your heart's content
              svgAssetFilename: 'svgAssets/[name]-[contenthash].[ext]',
            },
          },
        ],
      },
      {
        // Assets without a theme, such as country flags.
        // Referenced as `icon.svg?svgUse&noTheme`
        test: /\.svg$/i,
        resourceQuery: {
          and: [/svgUse/i, /noTheme/i],
        },
        type: 'javascript/auto',
        use: [
          {
            loader: '@svg-use/webpack',
            options: {
              getThemeSubstitutions: null,
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
