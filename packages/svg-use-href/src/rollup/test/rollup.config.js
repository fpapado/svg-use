import svgUseHref from '../../../dist/esm/rollup/index.js';

export default {
  input: '__fixtures__/input.js',
  plugins: [svgUseHref()],
  output: [
    {
      file: 'bundle.js',
      format: 'es',
    },
  ],
};
