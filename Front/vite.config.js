import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { env } from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${env.PNG_ADMIN_PORT || 3030}`,
        configure(proxy) {
          proxy.on('error', (_error, _req, response) => {
            if (!response.headersSent) {
              response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' })
              response.end(JSON.stringify({ error: 'API administrativa indisponível. Reinicie com npm run dev na pasta Front.' }))
            }
          })
        },
      },
    },
  },
})
