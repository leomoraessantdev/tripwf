import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, X, MapPin, Calendar, Wallet, RefreshCw, ArrowRight,
  Star, Gem, Leaf, Loader2
} from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { gerarRoteiroSurpresa } from '../../utils/surpreendaMe.js'
import { buscarCidade } from '../../data/cidades.js'
import { formatarEUR } from '../../utils/formatadores.js'
import Botao from '../ui/Botao.jsx'

// Mensagens de loading rotativas — passam ideia de IA pensando.
const MENSAGENS_LOADING = [
  'Analisando seu perfil de viajante…',
  'Selecionando cidades ideais para você…',
  'Calculando a melhor distribuição de dias…',
  'Escolhendo atrações imperdíveis…',
  'Reservando as melhores hospedagens…',
  'Traçando a rota perfeita…',
  'Finalizando os detalhes…'
]

const ICONE_ESTILO = { economico: Leaf, conforto: Star, luxo: Gem }
const LABEL_ESTILO = { economico: 'Econômico', conforto: 'Conforto', luxo: 'Luxo' }

export default function ModalSurpresa({ aberto, aoFechar }) {
  const {
    orcamentoDiario, viajantes, dataIda, dataVolta, estilo,
    aplicarRoteiroSurpresa
  } = useViagem()
  const navigate = useNavigate()

  const [fase, setFase] = useState('gerando')   // 'gerando' | 'pronto'
  const [mensagemIdx, setMensagemIdx] = useState(0)
  const [plano, setPlano] = useState(null)

  const gerar = useCallback(() => {
    setFase('gerando')
    setMensagemIdx(0)
    const novaSemente = Math.floor(Math.random() * 0xFFFF) + 1
    const resultado = gerarRoteiroSurpresa({
      orcamentoDiario, dataIda, dataVolta, estilo, semente: novaSemente
    })
    // Pequeno delay simulado pra dar tempo das mensagens rotativas tocarem.
    // ~2.4s no total: 7 mensagens × 350ms.
    setTimeout(() => {
      setPlano(resultado)
      setFase('pronto')
    }, 2400)
  }, [orcamentoDiario, dataIda, dataVolta, estilo])

  // Ciclo das mensagens enquanto está gerando
  useEffect(() => {
    if (fase !== 'gerando') return
    const t = setInterval(() => {
      setMensagemIdx((i) => Math.min(i + 1, MENSAGENS_LOADING.length - 1))
    }, 350)
    return () => clearInterval(t)
  }, [fase])

  // Reset quando reabre
  useEffect(() => {
    if (aberto) gerar()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])

  // ESC fecha o modal
  useEffect(() => {
    if (!aberto) return
    const onKey = (e) => { if (e.key === 'Escape') aoFechar() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aberto, aoFechar])

  const aplicarEIr = () => {
    if (!plano) return
    aplicarRoteiroSurpresa(plano.cidadesSelecionadas)
    aoFechar()
    navigate('/roteiro')
  }

  const previewCidades = useMemo(() => {
    if (!plano) return []
    return plano.cidadesSelecionadas.map((cs) => {
      const c = buscarCidade(cs.slug)
      return c ? { nome: c.nome, bandeira: c.bandeira, dias: cs.dias, slug: cs.slug } : null
    }).filter(Boolean)
  }, [plano])

  const custoEstimado = useMemo(() => {
    if (!plano) return 0
    const viaj = Math.max(1, viajantes)
    return plano.cidadesSelecionadas.reduce((acc, cs) => {
      const c = buscarCidade(cs.slug)
      if (!c) return acc
      const hosp = c.hospedagens.find((h) => h.id === cs.hospedagemEscolhida)
      const custoHosp = hosp ? hosp.precoNoite * cs.dias : 0
      const custoAtr = c.atracoes
        .filter((a) => cs.atracoesEscolhidas.includes(a.id))
        .reduce((s, a) => s + a.preco, 0)
      const custoFood = (c.custoAlimentacaoDia || 40) * cs.dias * viaj
      return acc + custoHosp + custoAtr + custoFood
    }, 0) + Math.max(0, plano.cidadesSelecionadas.length - 1) * 80
  }, [plano, viajantes])

  if (!aberto) return null

  const IconeEstilo = ICONE_ESTILO[estilo] || Star

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/70 backdrop-blur-sm overflow-y-auto"
        onClick={aoFechar}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-surpresa"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-6 sm:p-8">
            <button
              type="button"
              onClick={aoFechar}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-accent-300">
                  Modo Surpresa
                </div>
                <h2 id="titulo-surpresa" className="font-display font-extrabold text-2xl sm:text-3xl leading-tight">
                  {fase === 'gerando' ? 'Montando sua viagem perfeita…' : 'Pronto! Olha o que preparamos pra você'}
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {fase === 'gerando' ? (
              <LoadingPanel mensagemIdx={mensagemIdx} />
            ) : (
              <ResultadoPanel
                plano={plano}
                previewCidades={previewCidades}
                custoEstimado={custoEstimado}
                estilo={estilo}
                IconeEstilo={IconeEstilo}
                orcamentoDiario={orcamentoDiario}
              />
            )}
          </div>

          {/* Footer */}
          {fase === 'pronto' && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row gap-3 sm:justify-between border-t border-cream-200 dark:border-ink-700 pt-5">
              <Botao variante="ghost" onClick={gerar}>
                <RefreshCw className="w-4 h-4" /> Gerar novamente
              </Botao>
              <Botao variante="primario" onClick={aplicarEIr}>
                Aplicar e ver roteiro <ArrowRight className="w-4 h-4" />
              </Botao>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function LoadingPanel({ mensagemIdx }) {
  const progresso = ((mensagemIdx + 1) / MENSAGENS_LOADING.length) * 100
  return (
    <div className="py-6">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
            <Loader2 className="w-9 h-9 text-white animate-spin" />
          </div>
        </div>
      </div>

      <div className="text-center min-h-[2.5rem] mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mensagemIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="font-display font-bold text-lg text-primary-900 dark:text-ink-50"
          >
            {MENSAGENS_LOADING[mensagemIdx]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full bg-cream-200 dark:bg-ink-800 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-500 to-accent-700 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progresso}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function ResultadoPanel({ plano, previewCidades, custoEstimado, estilo, IconeEstilo, orcamentoDiario }) {
  return (
    <div className="space-y-5">
      {/* Justificativa */}
      <div className="bg-gradient-to-br from-accent-500/10 to-accent-500/5 dark:from-accent-500/15 dark:to-accent-500/5 border border-accent-500/20 dark:border-accent-500/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-primary-900 dark:text-ink-50 text-lg leading-snug mb-1">
              {plano.justificativa.resumo}
            </div>
            <div className="text-sm text-primary-700/80 dark:text-ink-200 leading-relaxed">
              {plano.justificativa.detalhe}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo do plano */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <CartaoResumo icone={MapPin} label="Cidades" valor={plano.nCidades} />
        <CartaoResumo icone={Calendar} label="Dias" valor={plano.totalDias} />
        <CartaoResumo icone={IconeEstilo} label="Estilo" valor={LABEL_ESTILO[estilo]} />
        <CartaoResumo icone={Wallet} label="Custo estimado" valor={formatarEUR(custoEstimado)} />
      </div>

      {/* Rota */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-primary-500 dark:text-ink-300 mb-2">
          Sua rota
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {previewCidades.map((c, i) => (
            <div key={c.slug} className="flex items-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 bg-cream-100 border border-cream-300 dark:bg-ink-800 dark:border-ink-700 rounded-full px-3 py-1.5">
                <span className="text-base leading-none">{c.bandeira}</span>
                <span className="font-semibold text-sm text-primary-900 dark:text-ink-50">{c.nome}</span>
                <span className="text-[10px] font-bold text-accent-600 dark:text-accent-300 bg-accent-500/15 px-1.5 py-0.5 rounded-full">
                  {c.dias}d
                </span>
              </div>
              {i < previewCidades.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-accent-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Aviso de orçamento */}
      {custoEstimado > orcamentoDiario * plano.totalDias * 1.15 && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-500/30 dark:text-amber-300 rounded-xl p-3">
          ⚠️ O custo estimado passa do orçamento informado. Você pode aplicar e ajustar
          escolhas no planejador, ou clicar em <strong>Gerar novamente</strong>.
        </div>
      )}
    </div>
  )
}

function CartaoResumo({ icone: Icone, label, valor }) {
  return (
    <div className="bg-cream-100 dark:bg-ink-800 rounded-xl p-3 text-center">
      <Icone className="w-4 h-4 text-accent-500 mx-auto mb-1" />
      <div className="text-[10px] font-bold uppercase tracking-wider text-primary-500 dark:text-ink-300">{label}</div>
      <div className="font-display font-extrabold text-primary-900 dark:text-ink-50 text-base sm:text-lg leading-tight mt-0.5">
        {valor}
      </div>
    </div>
  )
}
