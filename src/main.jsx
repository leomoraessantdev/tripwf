import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ViagemProvider } from './context/ViagemContext.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ViagemProvider>
        <App />
      </ViagemProvider>
    </BrowserRouter>
  </React.StrictMode>
)
