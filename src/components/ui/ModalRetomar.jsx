import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, ArrowRight, RotateCcw, X, Calendar, MapPin, Users, Wallet } from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { lerUltimaEdicao, formatarTempoRelativo } from '../../utils/saveTracker.js'
import { formatarEUR } from '../../utils/formatadores.js'

const CHAVE_SESSAO = 'tripwf-modal-retomar-visto'

// Modal de retomada — aparece SOMENTE na home, uma única vez por sessão,
// quando há roteiro salvo no localStorage (cidadesSelecionadas.length > 0).
// Marca sessionStorage ao fechar para não reaparecer durante a navegação.
export default function ModalRetomar() {
  const {
    dadosViagem, cidadesSelecionadas, totais, viajantes,
    dataIda, orcamentoDiario, limparViagem
  } = useViagem()
  const location = useLocation()
  const [aberto, setAberto] = useState(false)
  const [ultima, setUltima] = useState(0)

  useEffect(() => {
    if (location.pathname !== '/') return
    if (cidadesSelecionadas.length === 0) return
    let visto = null
    try { visto = sessionStorage.getItem(CHAVE_SESSAO) } catch { /* sandbox sem sessionStorage */ }
    if (visto) return
    setUltima(lerUltimaEdicao())
    setAberto(true)
  }, [location.pathname, cidadesSelecionadas.length])

  const fechar = () => {
    setAberto(false)
    try { sessionStorage.setItem(CHAVE_SESSAO, '1') } catch { /* idem */ }
  }

  const comecarNovo = () => {
    const ok = window.confirm('Isso apaga o roteiro salvo. Tem certeza?')
    if (!ok) return
    limparViagem()
    fechar()
  }

  if (!aberto) return null

  const bandeiras = dadosViagem.slice(0, 6).map((d) => d.cidade.bandeira).join(' ')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/70 backdrop-blur-sm"
        onClick={fechar}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-retomar"
        >
          <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-6">
            <button
              type="button"
              onClick={fechar}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg shrink-0">
                <Bookmark className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-accent-300">
                  Bem-vindo de volta
                </div>
                <h2 id="titulo-retomar" className="font-display font-extrabold text-xl sm:text-2xl leading-tight">
                  Você tem um roteiro salvo
                </h2>
              </div>
            </div>
            {ultima > 0 && (
              <div className="text-xs text-white/70 mt-2">
                Última edição {formatarTempoRelativo(ultima)}
              </div>
            )}
          </div>

          <div className="p-6 space-y-3">
            <Info
              icone={MapPin}
              label="Cidades"
              valor={`${dadosViagem.length} ${dadosViagem.length === 1 ? 'cidade' : 'cidades'}`}
              extra={bandeiras}
            />
            <Info
              icone={Calendar}
              label="Duração"
              valor={`${totais.totalDias} ${totais.totalDias === 1 ? 'dia' : 'dias'}`}
              extra={dataIda ? `partindo ${dataIda.split('-').reverse().join('/')}` : ''}
            />
            <Info icone={Users} label="Viajantes" valor={viajantes} />
            <Info
              icone={Wallet}
              label="Orçamento diário"
              valor={`${formatarEUR(orcamentoDiario)}/pessoa`}
            />
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={comecarNovo}
              className="btn-base bg-cream-200 hover:bg-cream-300 text-primary-700 dark:bg-ink-800 dark:hover:bg-ink-700 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-4 py-3 text-sm flex-1"
            >
              <RotateCcw className="w-4 h-4" /> Começar novo
            </button>
            <Link
              to="/roteiro"
              onClick={fechar}
              className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-4 py-3 text-sm flex-1 font-semibold shadow-soft"
            >
              Continuar roteiro <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Info({ icone: Icone, label, valor, extra }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
        <Icone className="w-4 h-4 text-accent-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-primary-500 dark:text-ink-300">{label}</div>
        <div className="font-semibold text-primary-900 dark:text-ink-50 text-sm truncate">
          {valor}
          {extra && <span className="text-primary-500 dark:text-ink-300 font-normal"> · {extra}</span>}
        </div>
      </div>
    </div>
  )
}
