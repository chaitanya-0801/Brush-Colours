import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ActivityProvider } from './context/ActivityContext'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ActivityProvider>
          <App />
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
