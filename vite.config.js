import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dashboard-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/dashboard' || req.url === '/dashboard/') {
            req.url = '/dashboard.html'
          }
          next()
        })
      },
    },
  ],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main:      'index.html',
        dashboard: 'dashboard.html',
      },
    },
  },
})
