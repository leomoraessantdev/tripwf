import { useMemo } from 'react'
import { ListChecks, Check, RotateCcw, Sparkles } from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { gerarChecklist } from '../../utils/checklistViagem.js'

export default function ChecklistViagem() {
  const { dadosViagem, checklistConcluidos, toggleChecklistItem, resetarChecklist } = useViagem()
  const itens = useMemo(() => gerarChecklist({ dadosViagem }), [dadosViagem])

  if (itens.length === 0) return null

  const idsValidos = new Set(itens.map((i) => i.id))
  const marcados = checklistConcluidos.filter((id) => idsValidos.has(id))
  const totalConcluidos = marcados.length
  const total = itens.length
  const progresso = Math.round((totalConcluidos / total) * 100)
  const completo = totalConcluidos === total
  const algumMarcado = totalConcluidos > 0

  return (
    <article className="card-base p-6 sm:p-8 relative overflow-hidden">
      {completo && (
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-success/15 blur-3xl"
        />
      )}

      <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
            <ListChecks className="w-6 h-6 text-accent-500" />
          </div>
          <div>
            <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider">
              Preparativos finais
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
              Checklist da viagem
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {algumMarcado && (
            <button
              type="button"
              onClick={resetarChecklist}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-700 dark:text-ink-300 dark:hover:text-ink-100 transition px-3 py-2 rounded-lg hover:bg-cream-200 dark:hover:bg-ink-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetar
            </button>
          )}
          <div className="text-right shrink-0">
            <div
              className={`font-display font-extrabold text-2xl leading-none ${
                completo ? 'text-success' : 'text-primary-900 dark:text-ink-50'
              }`}
            >
              {totalConcluidos}<span className="text-primary-500/60 dark:text-ink-300 text-lg">/{total}</span>
            </div>
            <div className="text-[11px] mt-1 text-primary-500 dark:text-ink-300 font-semibold uppercase tracking-wider">
              {completo ? 'Tudo pronto!' : 'concluídos'}
            </div>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <div className="w-full h-2 rounded-full bg-cream-200 dark:bg-ink-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completo ? 'bg-success' : 'bg-gradient-to-r from-accent-400 to-accent-600'
            }`}
            style={{ width: `${progresso}%` }}
          />
        </div>
        {completo && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/30 bg-success/10 text-success font-semibold text-sm shadow-soft">
              <Sparkles className="w-4 h-4" />
              Pronto para embarcar
            </div>
          </div>
        )}
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        {itens.map((item) => {
          const feito = marcados.includes(item.id)
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                aria-pressed={feito}
                aria-label={`${feito ? 'Desmarcar' : 'Marcar'}: ${item.titulo}`}
                className={`group w-full h-full text-left rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 border transition-all duration-200 ${
                  feito
                    ? 'bg-success/5 border-success/30 dark:bg-success/10 dark:border-success/40'
                    : 'bg-cream-50 border-cream-200 hover:border-accent-500/40 hover:shadow-soft hover:-translate-y-0.5 dark:bg-ink-800/60 dark:border-ink-700'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 transition ${
                    feito
                      ? 'bg-success/10 opacity-60'
                      : 'bg-white shadow-soft dark:bg-ink-900 dark:shadow-none dark:ring-1 dark:ring-ink-700 group-hover:scale-105'
                  }`}
                >
                  <span aria-hidden="true">{item.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className={`font-display font-bold text-sm sm:text-base leading-tight ${
                        feito ? 'text-primary-700/60 line-through dark:text-ink-300' : 'text-primary-900 dark:text-ink-50'
                      }`}
                    >
                      {item.titulo}
                    </h3>
                    <span
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                        feito
                          ? 'bg-success border-success text-white'
                          : 'border-primary-200 bg-white group-hover:border-accent-500 dark:border-ink-600 dark:bg-ink-900'
                      }`}
                    >
                      {feito && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      feito ? 'text-primary-700/45 dark:text-ink-300' : 'text-primary-700/75 dark:text-ink-200'
                    }`}
                  >
                    {item.descricao}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
