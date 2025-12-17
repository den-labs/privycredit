import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('@reown/appkit-adapter-wagmi')) {
            return 'appkit-adapter';
          }
          if (id.includes('@walletconnect')) {
            return 'walletconnect';
          }
          if (id.includes('@reown/appkit-ui')) {
            return 'appkit-ui';
          }
          if (id.includes('@reown/appkit-scaffold-ui')) {
            return 'appkit-scaffold';
          }
          if (id.includes('@reown/appkit-wallet')) {
            return 'appkit-wallet';
          }
          if (id.includes('@reown/appkit-pay')) {
            return 'appkit-pay';
          }
          if (id.includes('@reown/appkit-controllers')) {
            return 'appkit-controllers';
          }
          if (id.includes('@reown/appkit-utils')) {
            return 'appkit-utils';
          }
          if (id.includes('@reown/appkit-common')) {
            return 'appkit-common';
          }
          if (id.includes('@reown/appkit')) {
            return 'appkit-core';
          }
          if (id.includes('wagmi')) {
            return 'wagmi';
          }
          if (id.includes('viem')) {
            return 'viem';
          }
          if (id.includes('@tanstack')) {
            return 'query';
          }
          if (id.includes('react-dom') || id.includes('react/')) {
            return 'react';
          }
        },
      },
    },
  },
});
