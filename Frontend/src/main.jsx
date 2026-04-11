import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='202489251479-r8fmhs3t7glscvcj632j78mng9q8h93a.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>,
)
