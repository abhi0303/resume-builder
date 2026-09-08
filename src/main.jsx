import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ResumeProvider } from './state/ResumeContext'
import { FormattingProvider } from './state/FormattingContext'
import { DialogProvider } from './state/DialogContext'
import './styles/global.css'

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
