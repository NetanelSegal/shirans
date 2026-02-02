import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@shirans/shared': '../shared/src',
    },
  },
  assetsInclude: ['**/*.MOV', '**/*.mov'],
  server: {
    port: 5174,
    host: true,
  },
});
