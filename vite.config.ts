import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // Configuración para GitHub Pages
    base: mode === 'production' ? '/jii2025-react/' : '/',
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      // Optimizaciones para producción
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      // Configuración para GitHub Pages
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            let extType = info[info.length - 1];
            
            if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(assetInfo.name || '')) {
              extType = 'images';
            } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              extType = 'fonts';
            } else if (/\.css$/i.test(assetInfo.name || '')) {
              extType = 'css';
            }
            
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0'),
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    assetsInclude: ['**/*.pdf'],
  }
})