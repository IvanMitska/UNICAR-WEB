import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Таргет для современных браузеров - меньший бандл
    target: 'es2020',
    // Минификация с esbuild (быстрее terser, хороший результат)
    minify: 'esbuild',
    // CSS код splitting
    cssCodeSplit: true,
    // Оптимизация CSS минификации
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-form': ['react-hook-form', 'zod'],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          'vendor-icons': ['lucide-react'],
        },
        // Оптимизированные имена чанков для лучшего кеширования
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
    // Не генерировать sourcemap в продакшене для меньшего размера
    sourcemap: false,
  },
  // Оптимизация dev сервера
  server: {
    // Предварительная сборка зависимостей
    warmup: {
      clientFiles: ['./src/App.tsx', './src/pages/HomePage.tsx'],
    },
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
  },
})
