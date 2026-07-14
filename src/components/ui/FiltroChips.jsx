// Linha de chips de filtro reutilizável (categoria de atração, tipo de
// hospedagem, etc.). Controlada: recebe valor atual e callback.
export default function FiltroChips({ opcoes, valor, aoMudar, rotulo }) {
  return (
    <div role="group" aria-label={rotulo} className="flex flex-wrap gap-2">
      {opcoes.map((op) => {
        const ativo = op === valor
        return (
          <button
            key={op}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoMudar(op)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
              ativo
                ? 'bg-primary-500 text-white shadow-sm dark:bg-accent-500'
                : 'bg-white text-primary-700 ring-1 ring-cream-300 hover:ring-primary-300 hover:bg-cream-100 dark:bg-ink-800 dark:text-ink-200 dark:ring-ink-700 dark:hover:ring-ink-500'
            }`}
          >
            {op}
          </button>
        )
      })}
    </div>
  )
}
