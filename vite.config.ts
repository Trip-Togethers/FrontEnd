import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@api': '/src/api',
      '@assets':'/src/assets',
      '@components': '/src/components',
      '@common': '/src/components/common',
      '@constants/*': '/src/constants',
      '@hooks/*':'/src/hooks',
      '@models/*':  '/src/models',
      '@pages/*': '/src/pages',
      '@store/*': '/src/store',
      '@styles/*': '/src/styles',
      '@utils/*': '/src/utils',
    },
  },
});