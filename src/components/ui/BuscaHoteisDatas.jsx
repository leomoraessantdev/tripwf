import { CalendarSearch, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { linkReservaAccor, linkBuscaBooking } from '../../utils/links.js'
import { formatarDataDiaSemana } from '../../utils/datas.js'

// Busca de TODOS os hotéis da cidade já filtrada nas datas do roteiro
// (check-in = chegada na cidade, check-out = manhã do trecho seguinte).
// Só aparece quando a cidade está no roteiro e há data de ida definida.
export default function BuscaHoteisDatas({ cidade, compacto = false }) {
  const { dadosViagem, viajantes } = useViagem()
  const noRoteiro = dadosViagem.find((d) => d.cidade?.slug === cidade.slug)
  if (!noRoteiro?.dataInicio) return null

  const checkout = new Date(noRoteiro.dataFim)
  checkout.setDate(checkout.getDate() + 1)
  const opts = { dataInicio: noRoteiro.dataInicio, dataFim: checkout, viajantes }
  const noites = noRoteiro.dias

  const links = [
    cidade.accorDestino && {
      label: 'Hotéis Accor nessas datas',
      url: linkReservaAccor(cidade.accorDestino, opts),
      destaque: true
    },
    { label: 'Todos os hotéis no Booking', url: linkBuscaBooking(cidade.nome, cidade.pais, opts) }
  ].filter(Boolean)

  return (
    <div
      className={clsx(
        'rounded-2xl border border-primary-500/20 bg-primary-500/5 dark:bg-ink-800/60 dark:border-ink-700',
        compacto ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <CalendarSearch className="w-4 h-4 mt-0.5 text-primary-600 dark:text-accent-300 shrink-0" aria-hidden="true" />
        <p className="text-xs text-primary-700 dark:text-ink-200 leading-relaxed">
          <span className="font-semibold">Escolher hotel nas suas datas:</span>{' '}
          entrada {formatarDataDiaSemana(noRoteiro.dataInicio)} · saída {formatarDataDiaSemana(checkout)} ·{' '}
          {noites} {noites === 1 ? 'noite' : 'noites'} · {viajantes} {viajantes === 1 ? 'hóspede' : 'hóspedes'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition',
              l.destaque
                ? 'bg-primary-500 hover:bg-primary-600 text-white dark:bg-accent-500 dark:hover:bg-accent-600'
                : 'bg-white hover:bg-cream-200 text-primary-700 ring-1 ring-cream-300 dark:bg-ink-700 dark:hover:bg-ink-600 dark:text-ink-100 dark:ring-ink-600'
            )}
          >
            {l.label}
            <ExternalLink className="w-3 h-3 opacity-70" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  )
}
