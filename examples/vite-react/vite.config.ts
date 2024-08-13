import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import svgUseHref from '@svg-use/rollup';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    inspect(),
    react(),
    {
      ...svgUseHref({}),
      enforce: 'pre',
    },
  ],
});
