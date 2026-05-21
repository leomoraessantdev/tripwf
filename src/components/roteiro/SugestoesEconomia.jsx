import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, TrendingDown, Pencil } from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { gerarSugestoesEconomia } from '../../utils/sugerirEconomia.js'
import { formatarEUR } from '../../utils/formatadores.js'

const ESTADO_VISUAL = {
  proximo: {
    rotulo: '🟡 Próximo do limite',
    titulo: 'Veja como abrir folga no orçamento',
    chipBg: 'bg-warning/15',
    chipText: 'text-warning',
    borda: 'border-warning/30'
  },
  acima: {
    rotulo: '🔴 Acima do orçamento',
    titulo: 'Como economizar na sua viagem',
    chipBg: 'bg-danger/15',
    chipText: 'text-danger',
    borda: 'border-danger/30'
  }
}

export default function SugestoesEconomia() {
  const { dadosViagem, totais, dataIda } = useViagem()

  const dados = useMemo(
    () => gerarSugestoesEconomia({
      dadosViagem,
      totais,
      orcamentoTotal: totais.orcamentoTotal,
      dataIda
    }),
    [dadosViagem, totais, dataIda]
  )

  if (!dados || dados.estado === 'dentro' || dados.sugestoes.length === 0) {
    return null
  }

  const visual = ESTADO_VISUAL[dados.estado]
  const tituloAlvo = dados.estado === 'acima'
    ? `Para economizar ${formatarEUR(dados.deficit)}`
    : 'Para ganhar mais folga'

  return (
    <article className={`bg-white dark:bg-ink-900 rounded-3xl shadow-soft dark:shadow-none border-2 ${visual.borda} p-6 sm:p-8`}>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
            <span className="text-2xl" aria-hidden="true">💰</span>
          </div>
          <div className="min-w-0">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1.5 ${visual.chipBg} ${visual.chipText}`}
            >
              {visual.rotulo}
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
              {visual.titulo}
            </h2>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-primary-500 dark:text-ink-300">
            {tituloAlvo}
          </div>
          <div className="font-display font-extrabold text-3xl sm:text-4xl text-success leading-none mt-1 inline-flex items-center gap-1.5">
            <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7" />
            {formatarEUR(dados.totalEconomia)}
          </div>
          <div className="text-[10px] text-primary-500 dark:text-ink-300 mt-1">economia potencial</div>
        </div>
      </header>

      <ul className="space-y-2.5">
        {dados.sugestoes.map((s, i) => (
          <li
            key={`${s.tipo}-${i}`}
            className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-cream-50 border border-cream-200 hover:border-accent-500/30 hover:bg-cream-100 dark:bg-ink-800/60 dark:border-ink-700 dark:hover:bg-ink-800 transition-all duration-200"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-ink-900 shadow-soft dark:shadow-none flex items-center justify-center shrink-0 text-xl sm:text-2xl">
              <span aria-hidden="true">{s.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                <h3 className="font-display font-bold text-base sm:text-lg text-primary-900 dark:text-ink-50 leading-tight">
                  {s.titulo}
                </h3>
                <span className="font-display font-extrabold text-success dark:text-emerald-300 shrink-0 whitespace-nowrap text-lg">
                  −{formatarEUR(s.economia)}
                </span>
              </div>
              <p className="text-sm text-primary-700/75 dark:text-ink-200 leading-relaxed">
                {s.detalhe}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-5 border-t border-cream-200 dark:border-ink-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2 text-xs text-primary-700/70 dark:text-ink-200">
          <Lightbulb className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
          <p>
            Sugestões geradas a partir das alternativas reais do seu roteiro — priorizamos as
            trocas de menor impacto na experiência.
          </p>
        </div>
        <Link
          to="/planejador"
          className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 text-sm shadow-soft self-start sm:self-auto"
        >
          <Pencil className="w-3.5 h-3.5" />
          Ajustar no planejador
        </Link>
      </div>
    </article>
  )
}
