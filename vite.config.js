import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: { port: 5174 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icone.PNG'],
      manifest: {
        name: 'NotesParfaites',
        short_name: 'Notes',
        description: 'Application de notes personnelle',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F4F4F4',
        theme_color: '#F4F4F4',
        start_url: '/',
        icons: [
          { src: 'icone.PNG', sizes: 'any', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
});
