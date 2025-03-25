import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 自动更新 Service Worker
      devOptions: {
        enabled: true, // 在开发模式下启用 PWA（便于调试）
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // 缓存的静态资源
      manifest: {
        name: 'CChat',
        short_name: 'Chat',
        description: 'A real-time chat application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png', // 图标路径
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});