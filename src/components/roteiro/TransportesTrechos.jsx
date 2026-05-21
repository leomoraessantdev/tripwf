import { memo, useMemo } from 'react'
import {
  Plane, Train, Bus, Car, ExternalLink, Clock, Wallet,
  Route, Zap, PiggyBank, CalendarDays, TrendingUp, Users
} from 'lucide-react'
import clsx from 'clsx'
import { sugestoesTransporte } from '../../utils/transportes.js'
import { haversine, formatarDistancia } from '../../utils/distancia.js'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'
import { formatarData, formatarDataDiaSemana } from '../../utils/datas.js'
import { multiplicadorVooMedio, detectarTemporada } from '../../utils/temporadas.js'
import { useViagem } from '../../context/ViagemContext.jsx'

const ICONES = {
  aviao: Plane,
  trem: Train,
  onibus: Bus,
  carro: Car
}

const COR_BORDA = {
  aviao: 'border-accent-500',
  trem: 'border-primary-500',
  onibus: 'border-success',
  carro: 'border-warning'
}

const COR_BG = {
  aviao: 'bg-accent-500/10 text-accent-600',
  trem: 'bg-primary-500/10 text-primary-600',
  onibus: 'bg-success/10 text-success',
  carro: 'bg-warning/10 text-warning'
}

function dataParaIso(d) {
  if (!d) return ''
  const a = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${a}-${m}-${dia}`
}

function MapaRoteiroBase({ dadosViagem }) {
  const { dataVoltaEfetiva, viajantes } = useViagem()

  const trechos = useMemo(() => {
    const arr = []
    for (let i = 0; i < dadosViagem.length - 1; i++) {
      const a = dadosViagem[i]?.cidade
      const b = dadosViagem[i + 1]?.cidade
      if (!a || !b || a.lat == null || b.lat == null) continue
      const km = haversine(a.lat, a.lng, b.lat, b.lng)
      // Data do trecho = quando o usuário sai da cidade A pra B
      // = dataInicio da cidade B (chegada nela)
      const dataDoTrecho = dataParaIso(dadosViagem[i + 1]?.dataInicio)
      // Multiplicador de temporada — média dos voos das duas cidades naquela
      // data. Aplica em todos os modos (avião/trem/ônibus/carro) porque alta
      // temporada encarece todo o sistema, não só voos.
      const mult = multiplicadorVooMedio(a.slug, b.slug, dataDoTrecho)
      const temporadaDestino = detectarTemporada(b.slug, dataDoTrecho)
      const opcoes = sugestoesTransporte(km, a.nome, b.nome, dataDoTrecho, '', mult)
      arr.push({
        chave: `${a.slug}-${b.slug}`,
        origem: a,
        destino: b,
        km,
        dataDoTrecho: dadosViagem[i + 1]?.dataInicio,
        multiplicador: mult,
        temporadaDestino,
        opcoes
      })
    }
    return arr
  }, [dadosViagem, dataVoltaEfetiva])

  if (trechos.length === 0) return null

  return (
    <section className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-soft dark:shadow-none overflow-hidden">
      <header className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-3">
        <div>
          <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider mb-1">
            Como chegar
          </span>
          <h2 className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50 flex items-center gap-2">
            <Route className="w-5 h-5 text-accent-500" />
            Transportes entre cidades
          </h2>
          <p className="text-sm text-primary-700/70 dark:text-ink-200 mt-1">
            Estimativas de tempo e preço. Clique em uma opção pra ver passagens reais.
          </p>
        </div>
      </header>

      <div className="px-5 sm:px-6 pb-5 space-y-4">
        {trechos.map((t) => (
          <Trecho key={t.chave} trecho={t} />
        ))}
      </div>
    </section>
  )
}

function Trecho({ trecho }) {
  const { origem, destino, km, opcoes, dataDoTrecho, multiplicador, temporadaDestino } = trecho
  const pctAjuste = Math.round((multiplicador - 1) * 100)
  return (
    <div className="border border-cream-200 rounded-2xl p-4 bg-cream-100/30 dark:bg-ink-800/50 dark:border-ink-700">
      <header className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-primary-900 dark:text-ink-50 font-display font-bold">
          <span className="text-base">{origem.bandeira}</span>
          {origem.nome}
          <Route className="w-3.5 h-3.5 text-accent-500 mx-1" />
          <span className="text-base">{destino.bandeira}</span>
          {destino.nome}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-500 dark:text-ink-300 flex-wrap">
          {dataDoTrecho && (
            <span className="inline-flex items-center gap-1 bg-accent-500/10 text-accent-700 dark:text-accent-300 px-2 py-1 rounded-full">
              <CalendarDays className="w-3 h-3" />
              {formatarDataDiaSemana(dataDoTrecho)}
            </span>
          )}
          {temporadaDestino && (
            <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full border', temporadaDestino.classes)}>
              <span>{temporadaDestino.emoji}</span>
              {temporadaDestino.label}
            </span>
          )}
          <span>{formatarDistancia(km)} em linha reta</span>
        </div>
      </header>

      {pctAjuste !== 0 && (
        <div className="text-[11px] text-primary-700/80 dark:text-ink-200 mb-3 inline-flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-accent-500" />
          {pctAjuste > 0
            ? `Preços estimados ~${pctAjuste}% mais altos por causa da alta temporada no destino.`
            : `Preços estimados ~${Math.abs(pctAjuste)}% mais baratos — baixa temporada no destino.`}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {opcoes.map((o) => (
          <ModalOpcao key={o.tipo} opcao={o} />
        ))}
      </div>
    </div>
  )
}

function ModalOpcao({ opcao }) {
  const Icone = ICONES[opcao.tipo] || Plane
  return (
    <article
      className={clsx(
        'bg-white dark:bg-ink-800 rounded-xl border-2 p-3 flex flex-col gap-2 transition-all hover:-translate-y-0.5 hover:shadow-soft',
        opcao.recomendado ? COR_BORDA[opcao.tipo] : 'border-cream-200 dark:border-ink-700'
      )}
    >
      <div className="flex items-center justify-between">
        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', COR_BG[opcao.tipo])}>
          <Icone className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          {opcao.recomendado && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-500 text-white">
              Recomendado
            </span>
          )}
          {opcao.maisRapida && !opcao.recomendado && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-500 text-white inline-flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5" /> Mais rápido
            </span>
          )}
          {opcao.maisBarata && !opcao.recomendado && !opcao.maisRapida && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success text-white inline-flex items-center gap-0.5">
              <PiggyBank className="w-2.5 h-2.5" /> Mais barato
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="font-display font-bold text-primary-900 dark:text-ink-50 text-base leading-tight">
          {opcao.nome}
        </div>
        <div className="text-xs text-primary-500 dark:text-ink-300 inline-flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {opcao.duracaoTexto}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-primary-500 dark:text-ink-300 uppercase tracking-wider font-semibold flex items-center gap-1">
          <Wallet className="w-2.5 h-2.5" /> Estimativa
        </div>
        <div className="font-display font-extrabold text-primary-900 dark:text-ink-50 leading-tight">
          {formatarEUR(opcao.precoMin)}
          <span className="text-xs text-primary-500 dark:text-ink-300 font-normal mx-0.5">a</span>
          {formatarEUR(opcao.precoMax)}
        </div>
        <div className="text-[10px] text-primary-500 dark:text-ink-300">
          {formatarBRL(opcao.precoMin)} a {formatarBRL(opcao.precoMax)}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-auto pt-1">
        {opcao.links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-1 text-xs font-semibold text-primary-700 bg-cream-200 hover:bg-cream-300 dark:text-ink-100 dark:bg-ink-700 dark:hover:bg-ink-500 transition px-2 py-1.5 rounded-md"
          >
            <span>{l.label}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        ))}
      </div>
    </article>
  )
}

export default memo(MapaRoteiroBase)
