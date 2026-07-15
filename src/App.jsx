import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PaginaInicial from './pages/PaginaInicial.jsx'
import ToastSalvo from './components/ui/ToastSalvo.jsx'
import ModalRetomar from './components/ui/ModalRetomar.jsx'
import ModalRoteiroCompartilhado from './components/ui/ModalRoteiroCompartilhado.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { useViagem } from './context/ViagemContext.jsx'
import { decodificarRoteiro } from './utils/compartilhar.js'

// Páginas fora da home carregam sob demanda: o chunk do mapa (leaflet)
// e o restante só baixam quando o usuário navega até elas.
const PaginaCidade = lazy(() => import('./pages/PaginaCidade.jsx'))
const PaginaPlanejador = lazy(() => import('./pages/PaginaPlanejador.jsx'))
const PaginaRoteiro = lazy(() => import('./pages/PaginaRoteiro.jsx'))
const PaginaMeusRoteiros = lazy(() => import('./pages/PaginaMeusRoteiros.jsx'))
const PaginaSobre = lazy(() => import('./pages/PaginaSobre.jsx'))
const Pagina404 = lazy(() => import('./pages/Pagina404.jsx'))

function CarregandoPagina() {
  return (
    <div className="flex items-center justify-center py-32" role="status" aria-label="Carregando página">
      <div className="w-8 h-8 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  const { aplicarRoteiroCompartilhado } = useViagem()
  const location = useLocation()
  const navigate = useNavigate()

  // Detecta ?v=<token> na URL → oferece carregar roteiro compartilhado.
  // A detecção acontece no inicializador (primeiro render) e não num effect
  // de propósito: o ModalRetomar decide abrir no effect DELE, que roda antes
  // do effect do App — a supressão via sessionStorage precisa já existir.
  const [roteiroPendente, setRoteiroPendente] = useState(() => {
    const token = new URLSearchParams(window.location.search).get('v')
    if (!token) return null
    const novoEstado = decodificarRoteiro(token)
    if (novoEstado) {
      // Suprime o ModalRetomar nesta sessão — dois modais ao mesmo tempo não.
      try { sessionStorage.setItem('tripwf-modal-retomar-visto', '1') } catch { /* sandbox */ }
    }
    return novoEstado
  })

  // Token inválido: só limpa o param da URL.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('v') && !roteiroPendente) {
      navigate(location.pathname, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carregarCompartilhado = () => {
    aplicarRoteiroCompartilhado(roteiroPendente)
    setRoteiroPendente(null)
    navigate('/roteiro', { replace: true })
  }

  const recusarCompartilhado = () => {
    setRoteiroPendente(null)
    navigate(location.pathname, { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" className="flex-1">
        {/* key: navegar para outra rota reseta o boundary após um crash */}
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<CarregandoPagina />}>
            <Routes>
              <Route path="/" element={<PaginaInicial />} />
              <Route path="/cidade/:slug" element={<PaginaCidade />} />
              <Route path="/planejador" element={<PaginaPlanejador />} />
              <Route path="/roteiro" element={<PaginaRoteiro />} />
              <Route path="/meus-roteiros" element={<PaginaMeusRoteiros />} />
              <Route path="/sobre" element={<PaginaSobre />} />
              <Route path="/404" element={<Pagina404 />} />
              <Route path="*" element={<Pagina404 />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <ToastSalvo />
      <ModalRetomar />
      <ModalRoteiroCompartilhado
        estado={roteiroPendente}
        aoCarregar={carregarCompartilhado}
        aoRecusar={recusarCompartilhado}
      />
    </div>
  )
}
