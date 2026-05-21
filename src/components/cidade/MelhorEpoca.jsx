import { Sun, Flame, Wallet, CloudSun } from 'lucide-react'

// Painel "Melhor época para visitar". Recebe a cidade já enriquecida
// com cidade.epoca (atribuído em data/cidades.js a partir de data/epocas.js).
// Renderiza nada quando a cidade não tem dados de época.
export default function MelhorEpoca({ cidade }) {
  const epoca = cidade?.epoca
  if (!epoca) return null

  return (
    <article className="card-base p-6 sm:p-8">
      <header className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
          <CloudSun className="w-6 h-6 text-accent-500" />
        </div>
        <div>
          <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider">
            Quando ir
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
            Melhor época para visitar
          </h2>
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
        <Bloco
          rotulo="Melhor época"
          destaque={epoca.melhoresMeses}
          texto={epoca.descMelhor}
          icone={Sun}
          cor="text-accent-500"
          fundo="bg-accent-500/10"
          realce
        />
        <Bloco
          rotulo="Alta temporada"
          destaque={epoca.altaTemporada}
          texto="Mais turistas, filas longas e preços altos de hospedagem."
          icone={Flame}
          cor="text-danger"
          fundo="bg-danger/10"
        />
        <Bloco
          rotulo="Melhor custo-benefício"
          destaque={epoca.custoBeneficio}
          texto="Clima ainda confortável com passagens e hotéis mais baratos."
          icone={Wallet}
          cor="text-success"
          fundo="bg-success/10"
        />
      </div>

      <div className="mt-6 pt-5 border-t border-cream-200 dark:border-ink-700 text-sm text-primary-700/80 dark:text-ink-200 flex items-start gap-2">
        <CloudSun className="w-4 h-4 mt-0.5 text-primary-500 dark:text-ink-300 shrink-0" />
        <p>
          <span className="font-semibold text-primary-900 dark:text-ink-50">Clima predominante:</span> {epoca.clima}
        </p>
      </div>
    </article>
  )
}

function Bloco({ rotulo, destaque, texto, icone: Icone, cor, fundo, realce }) {
  return (
    <div
      className={
        'rounded-2xl p-4 sm:p-5 h-full flex flex-col ' +
        (realce
          ? 'bg-cream-200/60 border border-accent-500/20 dark:bg-ink-800/80 dark:border-accent-500/30'
          : 'bg-cream-100 border border-cream-200 dark:bg-ink-800/50 dark:border-ink-700')
      }
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg ${fundo} flex items-center justify-center shrink-0`}>
          <Icone className={`w-4 h-4 ${cor}`} />
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-primary-500 dark:text-ink-300">
          {rotulo}
        </span>
      </div>
      <h3 className="font-display font-bold text-lg sm:text-xl text-primary-900 dark:text-ink-50 leading-tight mb-1.5">
        {destaque}
      </h3>
      <p className="text-sm text-primary-700/75 dark:text-ink-200 leading-relaxed">{texto}</p>
    </div>
  )
}
