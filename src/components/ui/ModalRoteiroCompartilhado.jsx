import { motion, AnimatePresence } from 'framer-motion'
import { Gift, ArrowRight, X, Calendar, MapPin, Users, Wallet } from 'lucide-react'
import { buscarCidade } from '../../data/cidades.js'
import { formatarEUR } from '../../utils/formatadores.js'

// Modal exibido quando o usuário abre um link ?v=<token> de roteiro
// compartilhado. Substitui o window.confirm: mostra um resumo do que
// vai ser carregado antes de sobrescrever o planejamento atual.
// Visual espelha o ModalRetomar para manter consistência.
export default function ModalRoteiroCompartilhado({ estado, aoCarregar, aoRecusar }) {
  if (!estado) return null

  const cidades = (estado.cidadesSelecionadas || [])
    .map((cs) => ({ ...cs, cidade: buscarCidade(cs.slug) }))
    .filter((cs) => cs.cidade)
  const totalDias = cidades.reduce((acc, cs) => acc + cs.dias, 0)
  const bandeiras = cidades.slice(0, 6).map((cs) => cs.cidade.bandeira).join(' ')
  const nomes = cidades.map((cs) => cs.cidade.nome).join(', ')

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/70 backdrop-blur-sm"
        onClick={aoRecusar}
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
          aria-labelledby="titulo-compartilhado"
        >
          <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-6">
            <button
              type="button"
              onClick={aoRecusar}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg shrink-0">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-accent-300">
                  Link de roteiro
                </div>
                <h2 id="titulo-compartilhado" className="font-display font-extrabold text-xl sm:text-2xl leading-tight">
                  Alguém compartilhou um roteiro com você
                </h2>
              </div>
            </div>
            <div className="text-xs text-white/70 mt-2">
              Carregar substitui o seu planejamento atual.
            </div>
          </div>

          <div className="p-6 space-y-3">
            <Info
              icone={MapPin}
              label="Cidades"
              valor={`${cidades.length} ${cidades.length === 1 ? 'cidade' : 'cidades'}`}
              extra={bandeiras || nomes}
            />
            <Info
              icone={Calendar}
              label="Duração"
              valor={`${totalDias} ${totalDias === 1 ? 'dia' : 'dias'}`}
              extra={estado.dataIda ? `partindo ${estado.dataIda.split('-').reverse().join('/')}` : ''}
            />
            <Info icone={Users} label="Viajantes" valor={estado.viajantes || 1} />
            <Info
              icone={Wallet}
              label="Orçamento diário"
              valor={`${formatarEUR(estado.orcamentoDiario || 0)}/pessoa`}
            />
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={aoRecusar}
              className="btn-base bg-cream-200 hover:bg-cream-300 text-primary-700 dark:bg-ink-800 dark:hover:bg-ink-700 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-4 py-3 text-sm flex-1"
            >
              Manter o meu
            </button>
            <button
              type="button"
              onClick={aoCarregar}
              className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-4 py-3 text-sm flex-1 font-semibold shadow-soft"
            >
              Carregar roteiro <ArrowRight className="w-4 h-4" />
            </button>
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
