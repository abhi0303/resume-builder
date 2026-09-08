import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ResumeProvider } from './state/ResumeContext'
import { FormattingProvider } from './state/FormattingContext'
import { DialogProvider } from './state/DialogContext'
import './styles/global.css'

// Offline support for the installed app; the dev server has no service worker.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // BASE_URL keeps this correct under a sub-path deploy (GitHub Pages).
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
      /* offline support is optional — the app works without it */
    })
  })
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResumeProvider>
      <FormattingProvider>
        <DialogProvider>
          <App />
        </DialogProvider>
      </FormattingProvider>
    </ResumeProvider>
  </React.StrictMode>,
)
