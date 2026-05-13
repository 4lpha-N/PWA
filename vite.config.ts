import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

// Ersetzt font-display: swap durch optional in @fontsource Dateien (verhindert CLS)
const fontDisplayOptionalPlugin = {
  name: 'fontsource-display-optional',
  transform(code: string, id: string) {
    if (id.includes('@fontsource') && id.endsWith('.css')) {
      return { code: code.replace(/font-display:\s*swap/g, 'font-display: optional') }
    }
  },
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appBasePath = env.VITE_APP_BASE_PATH ?? '/PWA/'

  return {
    base: appBasePath,
    server: {
      headers: {
        // Erlaubt Google Auth Popup window.close() aufzurufen
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
    plugins: [
      // Dev-CORS-Proxy: GET /proxy?url=<encodedUrl> → fetcht serverseitig und gibt HTML zurück
      {
        name: 'cors-proxy',
        configureServer(server) {
          server.middlewares.use('/proxy', async (req, res, next) => {
            const rawUrl = new URL(req.url ?? '', 'http://localhost').searchParams.get('url')
            if (!rawUrl) return next()
            try {
              const response = await fetch(rawUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; dev-proxy/1.0)' },
              })
              const html = await response.text()
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.end(html)
            } catch (err) {
              res.statusCode = 502
              res.end(String(err))
            }
          })
        },
      },

      fontDisplayOptionalPlugin,
      react(),
      tsconfigPaths(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: '4lpha Web App',
          short_name: '4lpha',
          start_url: appBasePath,
          display: 'standalone',
          // background_color: '#ffffff',
          // theme_color: '#317EFB',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),
    ],
  }
})
