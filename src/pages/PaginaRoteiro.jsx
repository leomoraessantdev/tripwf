import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Download, RotateCcw, Sparkles, MapPin, ArrowRight, Share2, Check, Pencil, Save, Bookmark
} from 'lucide-react'
import { useViagem } from '../context/ViagemContext.jsx'
import { exportarRoteiroPdf } from '../utils/exportarPdf.js'
import { gerarLinkCompartilhamento, compartilharLink } from '../utils/compartilhar.js'
import { emitirSalvamento } from '../utils/saveTracker.js'
import { salvarRoteiro, sugerirNomeRoteiro } from '../utils/roteirosSalvos.js'
import HeroRoteiro from '../components/roteiro/HeroRoteiro.jsx'
import ResumoRapido from '../components/roteiro/ResumoRapido.jsx'
import ResumoViagem from '../components/roteiro/ResumoViagem.jsx'
import CardEconomia from '../components/roteiro/CardEconomia.jsx'
import SugestoesEconomia from '../components/roteiro/SugestoesEconomia.jsx'
import TimelineRoteiro from '../components/roteiro/TimelineRoteiro.jsx'
import MapaRoteiro from '../components/roteiro/MapaRoteiro.jsx'
import TransportesTrechos from '../components/roteiro/TransportesTrechos.jsx'
import DeslocamentoEstimado from '../components/roteiro/DeslocamentoEstimado.jsx'
import CidadeRoteiro from '../components/roteiro/CidadeRoteiro.jsx'
import ResumoEscolhas from '../components/roteiro/ResumoEscolhas.jsx'
import ChecklistViagem from '../components/roteiro/ChecklistViagem.jsx'
import Botao from '../components/ui/Botao.jsx'

export default function PaginaRoteiro() {
  const {
    dadosViagem, limparViagem, totais,
    orcamentoDiario, viajantes, cidadesSelecionadas,
    origem, dataIda, dataVolta, estilo, checklistConcluidos
  } = useViagem()
  const navigate = useNavigate()
  const [exportando, setExportando] = useState(false)
  const [feedbackShare, setFeedbackShare] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const salvarERedirecionar = () => {
    if (salvando || dadosViagem.length === 0) return
    setSalvando(true)
    try {
      const estado = {
        orcamentoDiario, viajantes, origem, dataIda, dataVolta, estilo,
        cidadesSelecionadas, checklistConcluidos
      }
      const nomeSugerido = sugerirNomeRoteiro(estado, dadosViagem)
      const nome = window.prompt('Dê um nome ao roteiro:', nomeSugerido) ?? nomeSugerido
      salvarRoteiro({ estado, dadosViagem, totais, nome })
      emitirSalvamento({ texto: 'Roteiro salvo ✓' })
      navigate('/meus-roteiros')
    } catch (e) {
      alert('Erro ao salvar roteiro: ' + e.message)
      setSalvando(false)
    }
  }

  const exportar = async () => {
    setExportando(true)
    try {
      await exportarRoteiroPdf('roteiro-imprimir', `tripwf-roteiro-${Date.now()}.pdf`)
    } catch (e) {
      alert('Erro ao gerar PDF: ' + e.message)
    } finally {
      setExportando(false)
    }
  }

  const compartilhar = async () => {
    const url = gerarLinkCompartilhamento({
      orcamentoDiario, viajantes, origem, dataIda, dataVolta, estilo, cidadesSelecionadas
    })
    const r = await compartilharLink(url, `TripWF — roteiro de ${dadosViagem.length} cidades`)
    if (r === 'copiado') {
      setFeedbackShare('Link copiado!')
      setTimeout(() => setFeedbackShare(null), 2500)
    } else if (r === 'erro') {
      setFeedbackShare('Erro ao copiar')
      setTimeout(() => setFeedbackShare(null), 2500)
    }
  }

  if (dadosViagem.length === 0) {
    return <RoteiroVazio />
  }

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-cream-100 dark:bg-ink-950 min-h-screen">
      <div className="container-app">
        {/* Barra de ações — fora do imprimir para não cair no PDF */}
        <div className="flex flex-wrap justify-end gap-2 mb-5">
          <Botao variante="ghost" onClick={limparViagem}>
            <RotateCcw className="w-4 h-4" /> Limpar
          </Botao>
          <Link
            to="/planejador"
            className="btn-base bg-white hover:bg-cream-200 text-primary-700 dark:bg-ink-900 dark:hover:bg-ink-800 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-4 py-2.5 text-sm shadow-soft dark:shadow-none"
          >
            <Pencil className="w-4 h-4" /> Editar
          </Link>
          <Botao
            variante="secundario"
            onClick={salvarERedirecionar}
            disabled={salvando}
          >
            <Save className="w-4 h-4" /> {salvando ? 'Salvando...' : 'Salvar'}
          </Botao>
          <Botao variante="secundario" onClick={compartilhar}>
            {feedbackShare ? (
              <>
                <Check className="w-4 h-4" /> {feedbackShare}
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> Compartilhar
              </>
            )}
          </Botao>
          <Botao variante="primario" onClick={exportar} disabled={exportando}>
            <Download className="w-4 h-4" />
            {exportando ? 'Gerando PDF...' : 'Exportar PDF'}
          </Botao>
        </div>

        <div id="roteiro-imprimir" className="space-y-8 bg-cream-100 dark:bg-ink-950 p-1 sm:p-2">
          <HeroRoteiro />

          <ResumoRapido />

          <ResumoViagem />

          <CardEconomia />

          <SugestoesEconomia />

          <TimelineRoteiro />

          <MapaRoteiro dadosViagem={dadosViagem} />

          <TransportesTrechos dadosViagem={dadosViagem} />

          <DeslocamentoEstimado />

          <section>
            <header className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider">
                  Roteiro por cidade
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
                  Suas {dadosViagem.length === 1 ? 'cidade' : `${dadosViagem.length} cidades`}
                </h2>
              </div>
            </header>
            <div className="space-y-6">
              {dadosViagem.map((d, i) => (
                <CidadeRoteiro key={d.slug} dados={d} indice={i + 1} />
              ))}
            </div>
          </section>

          <section>
            <header className="mb-4">
              <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider mb-1">
                Reservas e ingressos
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
                Garanta sua viagem
              </h2>
              <p className="text-sm text-primary-700/70 dark:text-ink-200 mt-1">
                Clique em cada item para abrir a página de reserva ou compra de ingresso.
              </p>
            </header>
            <ResumoEscolhas dadosViagem={dadosViagem} />
          </section>

          <ChecklistViagem />

          <CardSalvarRoteiro onSalvar={salvarERedirecionar} salvando={salvando} />

          <div className="text-center text-xs text-primary-500 dark:text-ink-300 py-4">
            Roteiro gerado por TripWF — TCC · {totais.totalDias} dias · {dadosViagem.length} cidades
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/meus-roteiros"
            className="btn-base bg-white hover:bg-cream-200 text-primary-700 dark:bg-ink-900 dark:hover:bg-ink-800 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-6 py-3 shadow-soft dark:shadow-none"
          >
            <Bookmark className="w-4 h-4" /> Meus roteiros salvos
          </Link>
          <Link
            to="/planejador"
            className="btn-base bg-white hover:bg-cream-200 text-primary-700 dark:bg-ink-900 dark:hover:bg-ink-800 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-6 py-3 shadow-soft dark:shadow-none"
          >
            <Sparkles className="w-4 h-4" /> Editar roteiro
          </Link>
        </div>
      </div>
    </div>
  )
}

function CardSalvarRoteiro({ onSalvar, salvando }) {
  return (
    <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 dark:from-ink-800 dark:to-ink-900 p-6 sm:p-8 text-white shadow-soft">
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-accent-500/30 blur-3xl"
      />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
            <Bookmark className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="inline-block text-accent-300 font-semibold text-xs uppercase tracking-wider mb-1">
              Sua biblioteca de viagens
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight">
              Salvar este roteiro
            </h2>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              Guarde esta versão completa (cidades, datas, hospedagens, atrações, orçamento
              e checklist) para abrir, comparar ou editar quando quiser.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSalvar}
          disabled={salvando}
          className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-6 py-3.5 text-base shadow-hover self-start sm:self-auto shrink-0 disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          {salvando ? 'Salvando...' : 'Salvar roteiro'}
        </button>
      </div>
    </article>
  )
}

function RoteiroVazio() {
  return (
    <div className="pt-24 pb-20 bg-cream-100 dark:bg-ink-950 min-h-screen flex items-center">
      <div className="container-app text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-3xl bg-accent-500/10 flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-accent-500" />
        </div>
        <h1 className="font-display font-extrabold text-4xl text-primary-900 dark:text-ink-50 mb-4">
          Seu roteiro está vazio
        </h1>
        <p className="text-lg text-primary-700/80 dark:text-ink-200 mb-8">
          Que tal começar pelo nosso planejador? Em poucos minutos você terá um roteiro completo
          pela Europa, dentro do seu orçamento.
        </p>
        <Link
          to="/planejador"
          className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-base shadow-hover inline-flex"
        >
          Começar a planejar <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
