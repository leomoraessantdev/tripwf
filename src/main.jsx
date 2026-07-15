import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { ViagemProvider } from './context/ViagemContext.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

// Deploy novo invalida os hashes dos chunks antigos. Quem estava com o site
// aberto antes do deploy navega → import dinâmico de página falha (404) →
// Vite emite vite:preloadError. Recarregar busca o index.html novo com os
// hashes atuais em vez de deixar a navegação morta.
window.addEventListener('vite:preloadError', (event) => {
  const CHAVE = 'tripwf-reload-por-chunk'
  let jaRecarregou = false
  try {
    jaRecarregou = Boolean(sessionStorage.getItem(CHAVE))
    sessionStorage.setItem(CHAVE, '1')
  } catch { /* sem sessionStorage — reload único mesmo assim */ }
  // Segunda falha seguida = chunk realmente indisponível; deixa o erro
  // propagar pro ErrorBoundary em vez de entrar em loop de reload.
  if (jaRecarregou) return
  event.preventDefault()
  window.location.reload()
})

// App de pé há 10s sem estourar preload = chunks íntegros; libera o flag
// pra um PRÓXIMO deploy (na mesma sessão) poder recarregar de novo.
setTimeout(() => {
  try { sessionStorage.removeItem('tripwf-reload-por-chunk') } catch { /* ok */ }
}, 10000)

// Boundary EXTERNO: cobre crash no ViagemProvider (estado corrompido na
// carga) e nos overlays globais (modais/toast), que ficam fora do boundary
// por rota dentro do App. Sem ele, crash aí = tela branca sem recuperação.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ViagemProvider>
          <App />
        </ViagemProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
