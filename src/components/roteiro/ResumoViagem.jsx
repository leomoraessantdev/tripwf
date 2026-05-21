import {
  TrendingDown, TrendingUp, AlertTriangle, BedDouble, Ticket, Coffee, Plane, Wallet
} from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'

const PROXIMO_THRESHOLD = 0.9

// =============================================================
// Card premium de investimento total.
//   - Mesmo background gradient do HeroRoteiro (primary-700 → 500 → 600
//     + blobs accent) para continuidade visual.
//   - 4 categorias em chips translúcidos com ícone branco
//   - Barra de orçamento com gradient accent quando dentro do plano
// =============================================================

const CATEGORIAS = [
  { id: 'hospedagem',  icone: BedDouble, label: 'Hospedagem',  chave: 'accommodation' },
  { id: 'atracoes',    icone: Ticket,    label: 'Atrações',    chave: 'attractions' },
  { id: 'alimentacao', icone: Coffee,    label: 'Alimentação', chave: 'food',      estimado: true },
  { id: 'transporte',  icone: Plane,     label: 'Transporte',  chave: 'transport', estimado: true }
]

export default function ResumoViagem() {
  const { totais, viajantes } = useViagem()
  const dentro = totais.dentroDoOrcamento
  const ratio = totais.custoTotal / Math.max(totais.orcamentoTotal, 1)
  const pct = Math.min(100, ratio * 100)

  let estado
  if (!dentro) estado = 'acima'
  else if (ratio >= PROXIMO_THRESHOLD) estado = 'proximo'
  else estado = 'dentro'

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-soft">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-600 dark:from-ink-900 dark:via-ink-800 dark:to-ink-950" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-500/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 45%)'
        }}
        aria-hidden="true"
      />

      <div className="relative p-6 sm:p-8 text-white">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-block text-accent-300 font-semibold text-xs uppercase tracking-wider mb-1">
              Investimento total
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight">
              Quanto custa sua viagem
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-display font-extrabold text-4xl sm:text-5xl text-white leading-none">
              {formatarEUR(totais.custoTotal)}
            </div>
            <div className="text-sm text-white/75 mt-1.5">
              {formatarBRL(totais.custoTotal)}
              {viajantes > 1 && (
                <>
                  <span className="mx-1.5 text-white/40">·</span>
                  {formatarEUR(totais.perPerson)}/pessoa
                </>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {CATEGORIAS.map((c) => (
            <CategoriaCard
              key={c.id}
              icone={c.icone}
              label={c.label}
              valor={totais[c.chave] || 0}
              estimado={c.estimado}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Wallet className="w-4 h-4 text-accent-300" />
              Comparação com seu orçamento
            </div>
            <StatusBadge estado={estado} totais={totais} />
          </div>
          <div className="h-3 bg-white/15 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-700 rounded-full',
                estado === 'acima'
                  ? 'bg-danger'
                  : estado === 'proximo'
                    ? 'bg-warning'
                    : 'bg-gradient-to-r from-accent-300 to-accent-500'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/65 mt-1.5">
            <span>{formatarEUR(0)}</span>
            <span className="font-semibold">
              Orçamento {formatarEUR(totais.orcamentoTotal)} ({formatarBRL(totais.orcamentoTotal)})
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatusBadge({ estado, totais }) {
  if (estado === 'acima') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-danger text-white">
        <span aria-hidden="true">🔴</span>
        <TrendingUp className="w-3 h-3" />
        Acima em {formatarEUR(-totais.diferenca)}
      </span>
    )
  }
  if (estado === 'proximo') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-warning text-white">
        <span aria-hidden="true">🟡</span>
        <AlertTriangle className="w-3 h-3" />
        Próximo do limite
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-success text-white">
      <span aria-hidden="true">🟢</span>
      <TrendingDown className="w-3 h-3" />
      Sobra {formatarEUR(totais.diferenca)}
    </span>
  )
}

function CategoriaCard({ icone: Icone, label, valor, estimado }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur border border-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
          <Icone className="w-5 h-5 text-accent-300" />
        </div>
        {estimado && (
          <span className="text-[9px] uppercase tracking-wider text-white/70 font-bold bg-white/10 px-1.5 py-0.5 rounded">
            Est.
          </span>
        )}
      </div>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-1">
        {label}
      </div>
      <div className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight">
        {formatarEUR(valor)}
      </div>
      <div className="text-[10px] text-white/55 mt-1">
        {formatarBRL(valor)}
      </div>
    </div>
  )
}
