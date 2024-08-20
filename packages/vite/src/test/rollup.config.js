import svgUse from '../../dist/index.js';

export default {
  input: '__fixtures__/input.js',
  plugins: [svgUse()],
  output: [
    {
      file: 'bundle.js',
      format: 'es',
    },
  ],
};
