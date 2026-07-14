import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PaginaInicial from './pages/PaginaInicial.jsx'
import PaginaCidade from './pages/PaginaCidade.jsx'
import PaginaPlanejador from './pages/PaginaPlanejador.jsx'
import PaginaRoteiro from './pages/PaginaRoteiro.jsx'
import PaginaMeusRoteiros from './pages/PaginaMeusRoteiros.jsx'
import PaginaSobre from './pages/PaginaSobre.jsx'
import Pagina404 from './pages/Pagina404.jsx'
import ToastSalvo from './components/ui/ToastSalvo.jsx'
import ModalRetomar from './components/ui/ModalRetomar.jsx'
import { useViagem } from './context/ViagemContext.jsx'
import { decodificarRoteiro } from './utils/compartilhar.js'

export default function App() {
  const { aplicarRoteiroCompartilhado } = useViagem()
  const location = useLocation()
  const navigate = useNavigate()

  // Detecta ?v=<token> na URL → oferece carregar roteiro compartilhado.
  // Roda uma vez por mount; remove o param da URL depois para evitar
  // recarregar o mesmo roteiro a cada navegação.
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('v')
    if (!token) return
    const novoEstado = decodificarRoteiro(token)
    if (!novoEstado) {
      navigate(location.pathname, { replace: true })
      return
    }
    const ok = window.confirm(
      'Você abriu um link de roteiro compartilhado. Carregar e substituir seu planejamento atual?'
    )
    if (ok) {
      aplicarRoteiroCompartilhado(novoEstado)
      navigate('/roteiro', { replace: true })
    } else {
      navigate(location.pathname, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" className="flex-1">
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
      </main>
      <Footer />
      <ToastSalvo />
      <ModalRetomar />
    </div>
  )
}
