import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
// import svgUse from '@svg-use/rollup';
import svgUse from './viteSvgUsePlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    inspect(),
    react(),
    {
      ...svgUse({}),
      enforce: 'pre',
    },
  ],
  build: {
    assetsInlineLimit: (filePath) => {
      // Do not inline SVG images, because base64 is not a valid target for
      // `use[href]`. If you can think of a more narrow check (such that it
      // targets only assets relevant to `@svg-use`), do let us know!
      return !filePath.endsWith('.svg');
    },
  },
});
