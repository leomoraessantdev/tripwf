import { Ticket, BedDouble, ExternalLink, MapPin } from 'lucide-react'
import Imagem from '../ui/Imagem.jsx'
import { formatarEUR, formatarBRL, formatarPreco } from '../../utils/formatadores.js'
import { linkIngresso, linkReserva } from '../../utils/links.js'
import { useViagem } from '../../context/ViagemContext.jsx'

function somarUmDia(data) {
  if (!data) return null
  const d = new Date(data)
  d.setDate(d.getDate() + 1)
  return d
}

export default function ResumoEscolhas({ dadosViagem }) {
  const { viajantes } = useViagem()

  // Junta todas as atrações em listas planas e propaga datas + viajantes
  // para que o link de compra/reserva já abra com tudo pré-preenchido.
  const atracoes = dadosViagem.flatMap((d) =>
    d.atracoes.map((a) => ({
      ...a,
      cidadeNome: d.cidade.nome,
      bandeira: d.cidade.bandeira,
      link: linkIngresso(a.nome, d.cidade.nome, {
        dataInicio: d.dataInicio,
        dataFim: d.dataFim
      })
    }))
  )
  const hospedagens = dadosViagem
    .filter((d) => d.hospedagem)
    .map((d) => ({
      ...d.hospedagem,
      cidadeNome: d.cidade.nome,
      bandeira: d.cidade.bandeira,
      dias: d.dias,
      total: d.custoHospedagem,
      link: linkReserva(d.hospedagem.nome, d.cidade.nome, {
        dataInicio: d.dataInicio,
        dataFim: somarUmDia(d.dataFim),
        viajantes
      })
    }))

  if (atracoes.length === 0 && hospedagens.length === 0) {
    return (
      <div className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-2xl p-6 shadow-soft dark:shadow-none text-center text-primary-700/70 dark:text-ink-200">
        Volte ao planejador para escolher atrações e hospedagens em cada cidade.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {hospedagens.length > 0 && (
        <section>
          <header className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-xl text-primary-900 dark:text-ink-50 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-primary-500" />
              Hospedagens reservadas
            </h3>
            <span className="text-xs text-primary-500 dark:text-ink-300 font-semibold">{hospedagens.length} no total</span>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospedagens.map((h) => (
              <ItemCard
                key={h.id}
                imagem={h.imagem}
                nome={h.nome}
                cidade={h.cidadeNome}
                bandeira={h.bandeira}
                meta={`${h.tipo} · ${h.bairro}`}
                precoLabel={`${formatarEUR(h.precoNoite)}/noite × ${h.dias}`}
                preco={h.total}
                link={h.link}
                botao="Reservar no Booking"
                icone={BedDouble}
                corBotao="primary"
              />
            ))}
          </div>
        </section>
      )}

      {atracoes.length > 0 && (
        <section>
          <header className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-xl text-primary-900 dark:text-ink-50 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-accent-500" />
              Atrações escolhidas
            </h3>
            <span className="text-xs text-primary-500 font-semibold">{atracoes.length} no total</span>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {atracoes.map((a) => (
              <ItemCard
                key={a.id}
                imagem={a.imagem}
                nome={a.nome}
                cidade={a.cidadeNome}
                bandeira={a.bandeira}
                meta={`${a.duracao} · ${a.categoria}`}
                preco={a.preco}
                precoLabel={a.preco === 0 ? 'Entrada' : 'Ingresso'}
                link={a.link}
                botao="Comprar no GetYourGuide"
                icone={Ticket}
                corBotao="accent"
              />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

function ItemCard({ imagem, nome, cidade, bandeira, meta, preco, precoLabel, link, botao, icone: Icone, corBotao }) {
  const corClasses = corBotao === 'accent'
    ? 'bg-accent-500 hover:bg-accent-600'
    : 'bg-primary-500 hover:bg-primary-600'

  return (
    <article className="card-base h-full flex flex-col">
      <div className="relative aspect-[4/3] w-full">
        <Imagem
          src={imagem}
          alt={nome}
          className="absolute inset-0"
        />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div className="text-[11px] text-primary-500 dark:text-ink-300 font-semibold flex items-center gap-1">
          <span className="text-sm leading-none">{bandeira}</span>
          <MapPin className="w-3 h-3" />
          {cidade}
        </div>
        <h4 className="font-display font-bold text-sm text-primary-900 dark:text-ink-50 leading-tight line-clamp-2 min-h-[2.5rem]">
          {nome}
        </h4>
        <div className="text-[11px] text-primary-500 dark:text-ink-300">{meta}</div>
        <div className="pt-2 mt-auto border-t border-cream-200 dark:border-ink-700">
          <div className="flex items-end justify-between mb-2">
            <span className="text-[10px] text-primary-500 dark:text-ink-300 uppercase tracking-wider font-semibold">{precoLabel}</span>
            <div className="text-right">
              <div className="font-display font-extrabold text-base text-primary-900 dark:text-ink-50 leading-none">
                {formatarPreco(preco)}
              </div>
              {preco > 0 && (
                <div className="text-[10px] text-primary-500 dark:text-ink-300 mt-0.5">{formatarBRL(preco)}</div>
              )}
            </div>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition ${corClasses}`}
          >
            <Icone className="w-3.5 h-3.5" />
            {botao}
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>
    </article>
  )
}
