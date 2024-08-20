import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import svgUse from '@svg-use/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [inspect(), react(), svgUse()],
});
