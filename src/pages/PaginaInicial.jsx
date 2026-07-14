import Hero from '../components/home/Hero.jsx'
import DestinosGrid from '../components/home/DestinosGrid.jsx'
import ComoFunciona from '../components/home/ComoFunciona.jsx'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

export default function PaginaInicial() {
  useTituloPagina(null)
  return (
    <>
      <Hero />
      <DestinosGrid />
      <ComoFunciona />
    </>
  )
}
