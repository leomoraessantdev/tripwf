import { memo } from 'react'
import {
  Plane, Train, Bus, Car, ExternalLink, Clock, Wallet,
  Route, Zap, PiggyBank, CalendarDays, TrendingUp, CheckCircle2, Circle, BadgeCheck
} from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarDistancia } from '../../utils/distancia.js'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'
import { formatarDataDiaSemana } from '../../utils/datas.js'
import { opcaoSelecionada, custoOpcao } from '../../utils/trechos.js'

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

function TransportesTrechosBase() {
  const { trechos, transportesEscolhidos, escolherTransporte, viajantes, totais } = useViagem()

  if (trechos.length === 0) return null

  return (
    <section className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-soft dark:shadow-none overflow-hidden">
      <header className="px-5 sm:px-6 pt-5 pb-3 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider mb-1">
            Como chegar
          </span>
          <h2 className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50 flex items-center gap-2">
            <Route className="w-5 h-5 text-accent-500" aria-hidden="true" />
            Transportes entre cidades
          </h2>
          <p className="text-sm text-primary-700/70 dark:text-ink-200 mt-1 max-w-2xl">
            Escolha como fazer cada trecho — o valor entra no total da viagem na hora. Os links já abrem
            no dia do deslocamento{viajantes > 1 ? ` para ${viajantes} passageiros` : ''}.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider font-bold text-primary-500 dark:text-ink-300">
            Transporte no total
          </div>
          <div className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50 leading-tight">
            {formatarEUR(totais.transport)}
          </div>
          <div className="text-[10px] text-primary-500 dark:text-ink-300">{formatarBRL(totais.transport)}</div>
        </div>
      </header>

      <div className="px-5 sm:px-6 pb-5 space-y-4">
        {trechos.map((t) => (
          <Trecho
            key={t.chave}
            trecho={t}
            selecionada={opcaoSelecionada(t, transportesEscolhidos)}
            viajantes={viajantes}
            aoEscolher={(tipo) => escolherTransporte(t.chave, tipo)}
          />
        ))}
      </div>
    </section>
  )
}

function Trecho({ trecho, selecionada, viajantes, aoEscolher }) {
  const { origem, destino, km, opcoes, data, multiplicador, temporadaDestino } = trecho
  const pctAjuste = Math.round((multiplicador - 1) * 100)
  const nomeGrupo = `transporte-${trecho.chave}`
  return (
    <fieldset className="border border-cream-200 rounded-2xl p-4 bg-cream-100/30 dark:bg-ink-800/50 dark:border-ink-700">
      <legend className="sr-only">
        Transporte de {origem.nome} para {destino.nome}
      </legend>
      <header className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-primary-900 dark:text-ink-50 font-display font-bold">
          <span className="text-base" aria-hidden="true">{origem.bandeira}</span>
          {origem.nome}
          <Route className="w-3.5 h-3.5 text-accent-500 mx-1" aria-hidden="true" />
          <span className="text-base" aria-hidden="true">{destino.bandeira}</span>
          {destino.nome}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-500 dark:text-ink-300 flex-wrap">
          {data && (
            <span className="inline-flex items-center gap-1 bg-accent-500/10 text-accent-700 dark:text-accent-300 px-2 py-1 rounded-full">
              <CalendarDays className="w-3 h-3" aria-hidden="true" />
              {formatarDataDiaSemana(data)}
            </span>
          )}
          {temporadaDestino && (
            <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full border', temporadaDestino.classes)}>
              <span aria-hidden="true">{temporadaDestino.emoji}</span>
              {temporadaDestino.label}
            </span>
          )}
          <span>{formatarDistancia(km)} em linha reta</span>
        </div>
      </header>

      {pctAjuste !== 0 && (
        <div className="text-[11px] text-primary-700/80 dark:text-ink-200 mb-3 inline-flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-accent-500" aria-hidden="true" />
          {pctAjuste > 0
            ? `Preços estimados ~${pctAjuste}% mais altos por causa da alta temporada no destino.`
            : `Preços estimados ~${Math.abs(pctAjuste)}% mais baratos — baixa temporada no destino.`}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {opcoes.map((o) => (
          <ModalOpcao
            key={o.tipo}
            opcao={o}
            nomeGrupo={nomeGrupo}
            escolhida={selecionada?.tipo === o.tipo}
            viajantes={viajantes}
            aoEscolher={() => aoEscolher(o.tipo)}
          />
        ))}
      </div>
    </fieldset>
  )
}

function ModalOpcao({ opcao, nomeGrupo, escolhida, viajantes, aoEscolher }) {
  const Icone = ICONES[opcao.tipo] || Plane
  const total = custoOpcao(opcao, viajantes)
  return (
    <article
      className={clsx(
        'relative bg-white dark:bg-ink-800 rounded-xl border-2 p-3 flex flex-col gap-2 transition-all',
        escolhida
          ? clsx(COR_BORDA[opcao.tipo], 'shadow-soft ring-2 ring-offset-1 ring-accent-500/30 dark:ring-offset-ink-900')
          : 'border-cream-200 dark:border-ink-700 hover:-translate-y-0.5 hover:shadow-soft'
      )}
    >
      <label className="flex flex-col gap-2 cursor-pointer">
        <input
          type="radio"
          name={nomeGrupo}
          value={opcao.tipo}
          checked={escolhida}
          onChange={aoEscolher}
          className="sr-only peer"
        />
        <div className="flex items-center justify-between">
          <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', COR_BG[opcao.tipo])}>
            <Icone className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            {opcao.recomendado && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-500 text-white">
                Recomendado
              </span>
            )}
            {opcao.maisRapida && !opcao.recomendado && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-500 text-white inline-flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" aria-hidden="true" /> Mais rápido
              </span>
            )}
            {opcao.maisBarata && !opcao.recomendado && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success text-white inline-flex items-center gap-0.5">
                <PiggyBank className="w-2.5 h-2.5" aria-hidden="true" /> Mais barato
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-primary-900 dark:text-ink-50 text-base leading-tight">
            {opcao.nome}
          </div>
          <div className="text-xs text-primary-500 dark:text-ink-300 inline-flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {opcao.duracaoTexto}
            {opcao.dadoReal && (
              <span className="inline-flex items-center gap-0.5 text-success font-semibold ml-1" title="Duração e preços da rota real (out/2026)">
                <BadgeCheck className="w-3 h-3" aria-hidden="true" /> rota real
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="text-[10px] text-primary-500 dark:text-ink-300 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Wallet className="w-2.5 h-2.5" aria-hidden="true" /> {opcao.porCarro ? 'Por carro' : 'Por pessoa'}
          </div>
          <div className="font-display font-extrabold text-primary-900 dark:text-ink-50 leading-tight">
            {formatarEUR(opcao.precoMin)}
            <span className="text-xs text-primary-500 dark:text-ink-300 font-normal mx-0.5">a</span>
            {formatarEUR(opcao.precoMax)}
          </div>
          <div className="text-[10px] text-primary-500 dark:text-ink-300">
            Na conta: {formatarEUR(total)}
            {!opcao.porCarro && viajantes > 1 && ` (${viajantes}×${formatarEUR(opcao.precoEstimado)})`}
            {' · '}{formatarBRL(total)}
          </div>
        </div>

        <span
          className={clsx(
            'inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-md px-2 py-1.5 transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent-500',
            escolhida
              ? 'bg-accent-500 text-white'
              : 'bg-cream-100 text-primary-700 dark:bg-ink-700 dark:text-ink-100'
          )}
        >
          {escolhida ? <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> : <Circle className="w-3.5 h-3.5" aria-hidden="true" />}
          {escolhida ? 'Escolhido' : 'Escolher este'}
        </span>
      </label>

      <div className="flex flex-col gap-1 mt-auto pt-1 border-t border-cream-200 dark:border-ink-700">
        {opcao.links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-1 text-xs font-semibold text-primary-700 bg-cream-200 hover:bg-cream-300 dark:text-ink-100 dark:bg-ink-700 dark:hover:bg-ink-500 transition px-2 py-1.5 rounded-md"
          >
            <span>{l.label}</span>
            <ExternalLink className="w-3 h-3 opacity-70" aria-hidden="true" />
          </a>
        ))}
      </div>
    </article>
  )
}

export default memo(TransportesTrechosBase)
