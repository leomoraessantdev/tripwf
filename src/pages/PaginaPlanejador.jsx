import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import PassosIndicador from '../components/planejador/PassosIndicador.jsx'
import PassoOrcamento from '../components/planejador/PassoOrcamento.jsx'
import PassoCidades from '../components/planejador/PassoCidades.jsx'
import PassoDias from '../components/planejador/PassoDias.jsx'
import PassoEscolhas from '../components/planejador/PassoEscolhas.jsx'
import BudgetSummary from '../components/planejador/BudgetSummary.jsx'
import Botao from '../components/ui/Botao.jsx'
import { useViagem } from '../context/ViagemContext.jsx'
import { emitirSalvamento } from '../utils/saveTracker.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

const PASSOS = [
  { titulo: 'Orçamento', componente: PassoOrcamento },
  { titulo: 'Cidades', componente: PassoCidades },
  { titulo: 'Dias', componente: PassoDias },
  { titulo: 'Escolhas', componente: PassoEscolhas }
]

export default function PaginaPlanejador() {
  useTituloPagina('Planejador', 'Monte sua viagem pela Europa em 4 passos: orçamento, cidades, dias e escolhas.')
  const [passo, setPasso] = useState(1)
  const navigate = useNavigate()
  const { cidadesSelecionadas } = useViagem()

  const Componente = PASSOS[passo - 1].componente

  const podeAvancar = () => {
    if (passo === 2) return cidadesSelecionadas.length > 0
    return true
  }

  const proximo = () => {
    emitirSalvamento()
    if (passo < PASSOS.length) {
      setPasso(passo + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/roteiro')
    }
  }

  const anterior = () => {
    if (passo > 1) {
      setPasso(passo - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="pt-24 pb-32 bg-cream-100 dark:bg-ink-950 min-h-screen">
      <div className="container-app">
        <div className="text-center mb-10">
          <span className="inline-block text-accent-500 font-semibold text-sm uppercase tracking-wider mb-2">
            Planejador de viagem
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50">
            Monte seu roteiro perfeito
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          <PassosIndicador passos={PASSOS} atual={passo} onIr={setPasso} />
        </div>

        <div className="mb-10">
          <Componente />
        </div>

        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 justify-between items-center bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-2xl shadow-soft dark:shadow-none p-4">
          <Botao variante="ghost" onClick={anterior} disabled={passo === 1}>
            <ArrowLeft className="w-4 h-4" /> Anterior
          </Botao>
          <div className="text-sm text-primary-500 dark:text-ink-300 font-semibold">
            Passo {passo} de {PASSOS.length}
          </div>
          <Botao variante="primario" onClick={proximo} disabled={!podeAvancar()}>
            {passo === PASSOS.length ? (
              <>
                Ver meu roteiro <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Próximo <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Botao>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-40">
        <BudgetSummary />
      </div>
    </div>
  )
}
