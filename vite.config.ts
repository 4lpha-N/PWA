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
    plugins: [
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
