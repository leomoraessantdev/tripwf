import { Check, MapPin, Minus, Plus, CalendarRange, Utensils } from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import Imagem from '../ui/Imagem.jsx'
import ComparadorCidades from './ComparadorCidades.jsx'
import { formatarEUR } from '../../utils/formatadores.js'

export default function PassoCidades() {
  const {
    todasCidades,
    cidadesSelecionadas,
    toggleCidade,
    cidadeEstaSelecionada,
    setDias
  } = useViagem()

  const totalDias = cidadesSelecionadas.reduce((acc, c) => acc + c.dias, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 mb-4">
          <MapPin className="w-8 h-8 text-accent-500" />
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-3 text-balance">
          Quais cidades quer visitar?
        </h2>
        <p className="text-primary-700/75 dark:text-ink-200 text-lg mb-2">
          Marque as cidades e ajuste os dias direto no card.
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-2">
          <span className="px-4 py-2 rounded-full bg-accent-500/10 text-accent-700 dark:text-accent-300 font-semibold text-sm">
            {cidadesSelecionadas.length} {cidadesSelecionadas.length === 1 ? 'cidade' : 'cidades'}
          </span>
          {cidadesSelecionadas.length > 0 && (
            <span className="px-4 py-2 rounded-full bg-primary-500/10 text-primary-700 dark:bg-ink-800 dark:text-ink-100 font-semibold text-sm inline-flex items-center gap-1">
              <CalendarRange className="w-3.5 h-3.5" />
              {totalDias} {totalDias === 1 ? 'dia no total' : 'dias no total'}
            </span>
          )}
        </div>
      </div>

      <ComparadorCidades />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {todasCidades.map((cidade) => {
          const ativa = cidadeEstaSelecionada(cidade.slug)
          const cs = cidadesSelecionadas.find((c) => c.slug === cidade.slug)
          return (
            <article
              key={cidade.slug}
              className={clsx(
                'card-base h-full flex flex-col transition-all',
                ativa && 'ring-4 ring-accent-500 -translate-y-1'
              )}
            >
              <button
                type="button"
                onClick={() => toggleCidade(cidade.slug)}
                className="block text-left relative aspect-[4/3] w-full overflow-hidden group"
                aria-label={ativa ? `Remover ${cidade.nome}` : `Adicionar ${cidade.nome}`}
              >
                <Imagem
                  src={cidade.imagem}
                  alt={cidade.nome}
                  className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-card-gradient" />
                {ativa && (
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs opacity-90 flex items-center gap-1 mb-0.5">
                    <span>{cidade.bandeira}</span> {cidade.pais}
                  </div>
                  <div className="font-display font-extrabold text-xl drop-shadow leading-tight">
                    {cidade.nome}
                  </div>
                </div>
              </button>

              <div className={clsx('p-4 flex-1 flex flex-col gap-3', ativa ? 'bg-accent-500/5 dark:bg-accent-500/10' : 'bg-white dark:bg-ink-900')}>
                <div className="flex items-center gap-1.5 text-xs text-primary-700 dark:text-ink-100 bg-cream-100 dark:bg-ink-800 rounded-md px-2.5 py-1.5">
                  <Utensils className="w-3.5 h-3.5 flex-shrink-0 text-accent-500" />
                  <span className="flex-1">Alimentação</span>
                  <span className="font-bold text-primary-900 dark:text-ink-50">
                    ~{formatarEUR(cidade.custoAlimentacaoDia)}/dia
                  </span>
                </div>

                {ativa ? (
                  <DiasPicker
                    dias={cs?.dias ?? 3}
                    onChange={(d) => setDias(cidade.slug, d)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCidade(cidade.slug)}
                    className="btn-base bg-primary-500 hover:bg-primary-600 dark:bg-ink-700 dark:hover:bg-ink-500 dark:ring-1 dark:ring-ink-600 text-white px-4 py-2 text-sm w-full mt-auto"
                  >
                    Adicionar à viagem
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function DiasPicker({ dias, onChange }) {
  return (
    <div className="mt-auto">
      <div className="flex items-center justify-between gap-2 bg-white dark:bg-ink-800 dark:ring-1 dark:ring-ink-700 rounded-xl p-2 shadow-soft dark:shadow-none">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, dias - 1))}
          className="w-9 h-9 rounded-lg bg-cream-200 hover:bg-cream-300 dark:bg-ink-700 dark:hover:bg-ink-500 text-primary-700 dark:text-ink-100 flex items-center justify-center transition"
          aria-label="Diminuir dias"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="text-center flex-1">
          <div className="font-display font-extrabold text-xl text-primary-900 dark:text-ink-50 leading-none">
            {dias}
          </div>
          <div className="text-[10px] text-primary-500 dark:text-ink-300 font-semibold uppercase tracking-wider">
            {dias === 1 ? 'dia' : 'dias'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(30, dias + 1))}
          className="w-9 h-9 rounded-lg bg-accent-500 hover:bg-accent-600 text-white flex items-center justify-center transition"
          aria-label="Aumentar dias"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1 mt-1.5 justify-center">
        {[2, 3, 5, 7].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={clsx(
              'text-xs px-2 py-0.5 rounded font-semibold transition',
              dias === preset
                ? 'bg-accent-500 text-white'
                : 'text-primary-500 dark:text-ink-300 hover:bg-cream-200 dark:hover:bg-ink-700'
            )}
          >
            {preset}d
          </button>
        ))}
      </div>
    </div>
  )
}
