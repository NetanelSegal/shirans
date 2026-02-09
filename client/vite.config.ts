import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shirans/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.md'],
  },
  assetsInclude: ['**/*.MOV', '**/*.mov'],
  server: {
    port: 5174,
    host: true,
  },
});
