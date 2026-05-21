import { useState } from 'react'
import {
  Wallet, BedDouble, Ticket, Coffee, Plane,
  TrendingDown, TrendingUp, ChevronDown, ChevronUp, Users
} from 'lucide-react'
import clsx from 'clsx'
import { useTripCost } from '../../hooks/useTripCost.js'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'

// Cores baseadas no total da viagem (faixa de €)
function corDoTotal(total) {
  if (total < 1500) return { bg: 'bg-success', text: 'text-success', label: 'Econômico' }
  if (total < 3000) return { bg: 'bg-warning', text: 'text-warning', label: 'Moderado' }
  return { bg: 'bg-accent-500', text: 'text-accent-600', label: 'Premium' }
}

const MODOS = [
  { id: 'total', label: 'Total' },
  { id: 'pessoa', label: '/pessoa' },
  { id: 'dia', label: '/dia' }
]

export default function BudgetSummary() {
  const tripCost = useTripCost()
  const { totais, orcamentoDiario, cidadesSelecionadas } = useViagem()
  const [expandido, setExpandido] = useState(false)
  const [modo, setModo] = useState('total')

  if (cidadesSelecionadas.length === 0 || tripCost.totalDays === 0) return null

  const cor = corDoTotal(tripCost.total)
  const dentro = totais.dentroDoOrcamento
  const percent =
    totais.orcamentoTotal > 0
      ? Math.min(100, (tripCost.total / totais.orcamentoTotal) * 100)
      : 0

  const valorExibido = {
    total: tripCost.total,
    pessoa: tripCost.perPerson,
    dia: tripCost.perDay
  }[modo]

  const items = [
    { icone: BedDouble, label: 'Hospedagem', valor: tripCost.accommodation, cor: 'text-primary-600' },
    { icone: Ticket, label: 'Atrações', valor: tripCost.attractions, cor: 'text-accent-600' },
    { icone: Coffee, label: 'Alimentação', valor: tripCost.food, cor: 'text-success' },
    { icone: Plane, label: 'Transporte', valor: tripCost.transport, cor: 'text-warning' }
  ]

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-hover dark:shadow-2xl dark:shadow-black/40 border border-cream-200 dark:border-ink-700 overflow-hidden transition-all duration-300">
      {/* Header com total e botão expand */}
      <button
        type="button"
        onClick={() => setExpandido((e) => !e)}
        className="w-full p-4 flex items-center justify-between gap-3 hover:bg-cream-100/40 dark:hover:bg-ink-800 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cor.bg)}>
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-500 dark:text-ink-300">
              Estimativa total · {cor.label}
            </div>
            <div className={clsx('font-display font-extrabold text-2xl leading-tight transition-all', cor.text)}>
              {formatarEUR(valorExibido)}
            </div>
            <div className="text-[10px] text-primary-500 dark:text-ink-300 leading-none">
              {formatarBRL(valorExibido)} {modo === 'total' && tripCost.travelers > 1 && `· ${tripCost.travelers} viajantes`}
            </div>
          </div>
        </div>
        {expandido ? (
          <ChevronDown className="w-5 h-5 text-primary-500 dark:text-ink-300 flex-shrink-0" />
        ) : (
          <ChevronUp className="w-5 h-5 text-primary-500 dark:text-ink-300 flex-shrink-0" />
        )}
      </button>

      {/* Toggle de modo (Total / pessoa / dia) */}
      <div className="px-4 pb-3 flex gap-1">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setModo(m.id)}
            className={clsx(
              'flex-1 text-xs font-semibold py-1.5 rounded-lg transition',
              modo === m.id
                ? 'bg-primary-500 text-white dark:bg-accent-500'
                : 'bg-cream-200 text-primary-700 hover:bg-cream-300 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700'
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Barra de orçamento (sempre visível) */}
      <div className="px-4 pb-3">
        <div className="h-2 bg-cream-200 dark:bg-ink-800 rounded-full overflow-hidden">
          <div
            className={clsx('h-full transition-all duration-500', dentro ? 'bg-success' : 'bg-danger')}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-primary-500 dark:text-ink-300 mt-1.5">
          <span>
            Orçamento: {formatarEUR(orcamentoDiario)}/dia/pessoa
          </span>
          <span className={clsx('font-bold inline-flex items-center gap-1', dentro ? 'text-success' : 'text-danger')}>
            {dentro ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {dentro
              ? `Sobra ${formatarEUR(totais.diferenca)}`
              : `Excede ${formatarEUR(-totais.diferenca)}`}
          </span>
        </div>
      </div>

      {/* Breakdown expandido */}
      {expandido && (
        <div className="border-t border-cream-200 dark:border-ink-700 px-4 py-3 space-y-2 animate-fade-in">
          {items.map((it) => (
            <div key={it.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-ink-100">
                <it.icone className={clsx('w-4 h-4', it.cor)} />
                {it.label}
              </div>
              <div className="text-right">
                <div className="font-bold text-primary-900 dark:text-ink-50 text-sm leading-none">
                  {formatarEUR(it.valor)}
                </div>
                <div className="text-[10px] text-primary-500 dark:text-ink-300 mt-0.5">
                  {formatarBRL(it.valor)}
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-cream-200 dark:border-ink-700 text-[10px] text-primary-500/70 dark:text-ink-300 leading-relaxed">
            <Users className="inline w-3 h-3 mr-1" />
            Estimativas: alimentação €40/dia/pessoa, transporte €80/trecho.
            {tripCost.travelers > 1 && ` Multiplicado por ${tripCost.travelers} viajantes.`}
          </div>
        </div>
      )}
    </div>
  )
}
