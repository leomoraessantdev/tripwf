import { Bed, Ticket, ArrowRight, Route } from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarEUR } from '../../utils/formatadores.js'
import Imagem from '../ui/Imagem.jsx'

// Timeline horizontal das cidades visitadas. Scroll horizontal em
// telas pequenas; html2canvas captura o conteúdo completo (DOM full
// width), então a versão PDF mostra todas as etapas.

export default function TimelineRoteiro() {
  const { dadosViagem } = useViagem()
  if (!dadosViagem || dadosViagem.length === 0) return null

  return (
    <section className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-soft dark:shadow-none p-6 sm:p-8">
      <header className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
          <Route className="w-6 h-6 text-accent-500" />
        </div>
        <div>
          <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider">
            Sua jornada
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
            Timeline da viagem
          </h2>
        </div>
      </header>

      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <ol className="flex items-stretch gap-3 sm:gap-4 min-w-max">
          {dadosViagem.map((d, i) => (
            <li key={d.slug} className="flex items-stretch">
              <ItemCidade dados={d} indice={i + 1} />
              {i < dadosViagem.length - 1 && (
                <div className="flex items-center px-2 sm:px-3 self-center">
                  <div className="w-9 h-9 rounded-full bg-accent-500/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-accent-500" />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ItemCidade({ dados, indice }) {
  const { cidade, hospedagem, atracoes, dias, custoTotal } = dados
  return (
    <article className="w-48 sm:w-56 rounded-2xl overflow-hidden bg-cream-50 border border-cream-200 dark:bg-ink-800/60 dark:border-ink-700 hover:border-accent-500/40 transition-all hover:shadow-soft hover:-translate-y-0.5 group">
      <div className="relative aspect-[4/3]">
        <Imagem
          src={cidade.imagem}
          alt={cidade.nome}
          className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-card-gradient" />
        <div className="absolute top-2 left-2 w-9 h-9 rounded-full bg-accent-500 text-white font-display font-extrabold text-sm flex items-center justify-center shadow-soft border-2 border-white">
          {indice}
        </div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-primary-900 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
          {dias} {dias === 1 ? 'dia' : 'dias'}
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <div className="text-[10px] opacity-90 flex items-center gap-1">
            <span>{cidade.bandeira}</span> {cidade.pais}
          </div>
          <div className="font-display font-bold text-base sm:text-lg leading-tight drop-shadow">
            {cidade.nome}
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-primary-500 dark:text-ink-300 font-semibold uppercase tracking-wider text-[10px]">
            Etapa {indice}
          </span>
          <span className="font-display font-extrabold text-primary-900 dark:text-ink-50 text-sm">
            {formatarEUR(custoTotal)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary-700/80 dark:text-ink-200">
          <Ticket className="w-3.5 h-3.5 text-accent-500 shrink-0" />
          <span>
            {atracoes.length} {atracoes.length === 1 ? 'atração' : 'atrações'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary-700/80 dark:text-ink-200">
          <Bed className="w-3.5 h-3.5 text-accent-500 shrink-0" />
          <span className="truncate" title={hospedagem?.nome}>
            {hospedagem?.nome || 'Sem hospedagem'}
          </span>
        </div>
      </div>
    </article>
  )
}
