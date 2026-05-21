import clsx from 'clsx'
import { Check } from 'lucide-react'

export default function PassosIndicador({ passos, atual, onIr }) {
  return (
    <div className="w-full">
      <ol className="flex items-center justify-between gap-2 sm:gap-4">
        {passos.map((p, i) => {
          const numero = i + 1
          const completo = numero < atual
          const ativo = numero === atual
          return (
            <li key={p.titulo} className="flex-1 flex items-center">
              <button
                onClick={() => onIr?.(numero)}
                disabled={!completo && !ativo}
                className="flex flex-col items-center gap-2 group disabled:cursor-not-allowed flex-1 min-w-0"
              >
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm transition-all',
                    completo && 'bg-success text-white',
                    ativo && 'bg-accent-500 text-white shadow-glow',
                    !completo && !ativo && 'bg-cream-200 text-primary-400 dark:bg-ink-800 dark:text-ink-300'
                  )}
                >
                  {completo ? <Check className="w-5 h-5" /> : numero}
                </div>
                <div className="text-center min-w-0">
                  <div className={clsx('text-xs font-semibold uppercase tracking-wider', ativo ? 'text-accent-500' : 'text-primary-400 dark:text-ink-300')}>
                    Passo {numero}
                  </div>
                  <div className={clsx('text-xs sm:text-sm font-semibold truncate', ativo || completo ? 'text-primary-900 dark:text-ink-50' : 'text-primary-400 dark:text-ink-300')}>
                    {p.titulo}
                  </div>
                </div>
              </button>
              {i < passos.length - 1 && (
                <div className={clsx('h-0.5 flex-1 mx-2 transition-colors', numero < atual ? 'bg-success' : 'bg-cream-300 dark:bg-ink-700')} />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
