import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
  optimizeDeps: {
    include: ['zod', 'katex', 'react-katex'],
  },
  plugins: [react(), tsconfigPaths(), nodeResolve()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
  },
});
