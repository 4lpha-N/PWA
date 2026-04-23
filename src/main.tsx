import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './index.scss'

import { ThemeProvider } from "next-themes"

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
