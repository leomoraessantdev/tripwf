import { Bus, Train, Users, Clock, MapPin, ExternalLink, Lightbulb, PiggyBank, Route, Coins, Globe } from 'lucide-react'
import clsx from 'clsx'
import Imagem from '../ui/Imagem.jsx'
import BotaoFavorito from '../ui/BotaoFavorito.jsx'
import Tag from '../ui/Tag.jsx'
import Avaliacao from '../ui/Avaliacao.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'
import { useViagem } from '../../context/ViagemContext.jsx'
import { linkOmioComData, OMIO_ID } from '../../utils/transportes.js'
import { dataParaIso } from '../../utils/trechos.js'
import { formatarDataDiaSemana } from '../../utils/datas.js'

// Dia sugerido do bate e volta: o primeiro dia inteiro na cidade-base
// (o dia de chegada costuma ser consumido pelo deslocamento).
function useDiaBateVolta(cidadeNome) {
  const { dadosViagem, viajantes } = useViagem()
  const d = dadosViagem.find((x) => x.cidade?.nome === cidadeNome)
  if (!d?.dataInicio) return { data: null, viajantes }
  const data = new Date(d.dataInicio)
  if (d.dias > 1) data.setDate(data.getDate() + 1)
  return { data, viajantes }
}

function linksComData(opcao, data, viajantes) {
  if (!data || !opcao.omio) return opcao.links
  const { de, para, modal } = opcao.omio
  const url = linkOmioComData(OMIO_ID[de], OMIO_ID[para], dataParaIso(data), { modal, viajantes })
  if (!url) return opcao.links
  return opcao.links.map((l) => (l.label.startsWith('Omio') ? { ...l, url } : l))
}

const ICONE_MODAL = { onibus: Bus, trem: Train, tour: Users }

export default function BateVoltaCard({ atracao }) {
  const { bateVolta } = atracao
  const { data, viajantes } = useDiaBateVolta(atracao.cidade)
  const opcoes = [...bateVolta.opcoes]
    .sort((a, b) => a.precoIdaVolta - b.precoIdaVolta)
    .map((o) => ({ ...o, links: linksComData(o, data, viajantes) }))
  const foraDoEuro = bateVolta.moeda && bateVolta.moeda !== 'EUR'

  return (
    <article className="card-base flex flex-col lg:flex-row overflow-hidden">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:w-2/5 shrink-0 min-h-[14rem]">
        <Imagem src={atracao.imagem} alt={bateVolta.destino} className="absolute inset-0" />
        <div className="absolute top-3 left-3">
          <Tag variante="branco">
            <Route className="w-3.5 h-3.5" aria-hidden="true" /> Bate e volta
          </Tag>
        </div>
        <div className="absolute bottom-3 left-3">
          <Tag variante="branco">
            <Avaliacao valor={atracao.avaliacao} />
          </Tag>
        </div>
        <div className="absolute bottom-3 right-3">
          <BotaoFavorito tipo="atracoes" id={atracao.id} nome={atracao.nome} />
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col gap-4 min-w-0">
        <header>
          <div className="text-xs font-semibold text-primary-500 dark:text-ink-300 flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span aria-hidden="true">{bateVolta.bandeira}</span> {atracao.local}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {atracao.duracao} · {bateVolta.distancia}
            </span>
            {atracao.linkOficial && (
              <a
                href={atracao.linkOficial}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 dark:text-ink-200 hover:text-accent-600 underline decoration-dotted underline-offset-2"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                Turismo oficial
              </a>
            )}
          </div>
          <h3 className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50">
            {bateVolta.destino}
          </h3>
          <p className="text-sm text-primary-700/75 dark:text-ink-200 leading-relaxed mt-1">
            {atracao.descricao}
          </p>
        </header>

        <div className="flex items-center justify-between gap-3 flex-wrap rounded-xl bg-success/10 px-4 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-success">Custo estimado por pessoa</div>
            <div className="font-display font-extrabold text-xl text-primary-900 dark:text-ink-50 leading-tight">
              {formatarEUR(atracao.preco)}
              <span className="text-xs font-normal text-primary-500 dark:text-ink-300 ml-1.5">{formatarBRL(atracao.preco)}</span>
            </div>
          </div>
          <p className="text-[11px] text-primary-700/80 dark:text-ink-200 max-w-xs">
            Opção mais barata ida e volta
            {bateVolta.entradaPrincipal && ` + ${bateVolta.entradaPrincipal.nome} (${formatarEUR(bateVolta.entradaPrincipal.preco)})`}
          </p>
        </div>

        {data && (
          <p className="text-xs text-primary-700 dark:text-ink-200 -mb-2">
            No seu roteiro: <strong>{formatarDataDiaSemana(data)}</strong> — os links da Omio já abrem nesse dia
            {viajantes > 1 ? ` para ${viajantes} passageiros` : ''}.
          </p>
        )}
        <ul className="space-y-2" aria-label={`Como chegar a ${bateVolta.destino}`}>
          {opcoes.map((o, i) => (
            <OpcaoTransporte key={o.titulo} opcao={o} maisBarata={i === 0} />
          ))}
        </ul>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-cream-100 dark:bg-ink-800 px-4 py-3">
            <div className="text-xs font-bold text-primary-900 dark:text-ink-50 mb-1.5">Roteiro sugerido do dia</div>
            <ol className="text-xs text-primary-700 dark:text-ink-200 space-y-1 list-decimal list-inside leading-relaxed">
              {bateVolta.roteiro.map((passo) => (
                <li key={passo}>{passo}</li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex items-start gap-1.5 text-xs text-primary-700 dark:text-ink-200 bg-cream-100 dark:bg-ink-800 rounded-xl px-4 py-3 leading-relaxed">
              <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-500" aria-hidden="true" />
              <span><span className="font-semibold">Para gastar menos:</span> {atracao.dica}</span>
            </p>
            {foraDoEuro && (
              <p className="flex items-start gap-1.5 text-xs text-warning bg-warning/10 rounded-xl px-4 py-3 leading-relaxed">
                <Coins className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  A Suíça usa franco suíço (CHF) e não faz parte da UE: cartão funciona em todo lugar,
                  mas confira se o seu chip/eSIM tem roaming na Suíça.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function OpcaoTransporte({ opcao, maisBarata }) {
  const Icone = ICONE_MODAL[opcao.tipo] || Train
  return (
    <li
      className={clsx(
        'rounded-xl border-2 p-3 flex flex-col sm:flex-row sm:items-center gap-3',
        maisBarata ? 'border-success bg-success/5' : 'border-cream-200 dark:border-ink-700'
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-primary-500/10 text-primary-600 dark:text-ink-100 flex items-center justify-center shrink-0">
          <Icone className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-sm text-primary-900 dark:text-ink-50">{opcao.titulo}</span>
            {maisBarata && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success text-white inline-flex items-center gap-0.5">
                <PiggyBank className="w-2.5 h-2.5" aria-hidden="true" /> Mais barato
              </span>
            )}
          </div>
          <div className="text-xs text-primary-500 dark:text-ink-300">
            {opcao.trajeto} · {opcao.duracao}
          </div>
          <div className="text-[11px] text-primary-700/70 dark:text-ink-300">{opcao.detalhe}</div>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
        <div className="text-right">
          <div className="font-display font-extrabold text-primary-900 dark:text-ink-50 leading-none">
            {formatarEUR(opcao.precoIdaVolta)}
          </div>
          <div className="text-[10px] text-primary-500 dark:text-ink-300">ida e volta</div>
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          {opcao.links.map((l) => (
            <a
              key={l.url + l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition',
                maisBarata
                  ? 'bg-success text-white hover:brightness-110'
                  : 'text-primary-700 bg-cream-200 hover:bg-cream-300 dark:text-ink-100 dark:bg-ink-700 dark:hover:bg-ink-500'
              )}
            >
              {l.label}
              <ExternalLink className="w-3 h-3 opacity-70" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </li>
  )
}
