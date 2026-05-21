import { useMemo, useState } from 'react'
import {
  ArrowLeftRight, ChevronDown, Sparkles, Scale, X, AlertTriangle
} from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { compararCidades } from '../../utils/compararCidades.js'
import { formatarEUR } from '../../utils/formatadores.js'
import Imagem from '../ui/Imagem.jsx'

export default function ComparadorCidades() {
  const { todasCidades, estilo, orcamentoDiario } = useViagem()
  const [slugA, setSlugA] = useState('')
  const [slugB, setSlugB] = useState('')
  const [aberto, setAberto] = useState(false)

  const comparacao = useMemo(() => {
    if (!slugA || !slugB || slugA === slugB) return null
    return compararCidades(slugA, slugB, { estilo, orcamentoDiario })
  }, [slugA, slugB, estilo, orcamentoDiario])

  const limpar = () => {
    setSlugA('')
    setSlugB('')
  }

  return (
    <article className="card-base p-5 sm:p-6 mb-8 hover:translate-y-0 hover:shadow-soft">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="w-full flex items-center justify-between gap-3 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5 text-accent-500" />
          </div>
          <div>
            <span className="block text-accent-500 font-semibold text-[11px] uppercase tracking-wider">
              Em dúvida entre dois destinos?
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-primary-900 dark:text-ink-50 leading-tight">
              Comparador inteligente de cidades
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-primary-500 dark:text-ink-300 transition-transform shrink-0 ${aberto ? 'rotate-180' : ''}`}
        />
      </button>

      {aberto && (
        <div className="mt-5 pt-5 border-t border-cream-200 dark:border-ink-700">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 sm:items-end">
            <Seletor
              rotulo="Destino A"
              valor={slugA}
              onChange={setSlugA}
              cidades={todasCidades}
              excluir={slugB}
            />
            <div className="hidden sm:flex items-end justify-center pb-2.5">
              <div className="w-9 h-9 rounded-full bg-primary-500/10 dark:bg-ink-800 flex items-center justify-center font-display font-bold text-primary-700 dark:text-ink-100 text-sm">
                vs
              </div>
            </div>
            <Seletor
              rotulo="Destino B"
              valor={slugB}
              onChange={setSlugB}
              cidades={todasCidades}
              excluir={slugA}
            />
          </div>

          {(slugA || slugB) && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-700 dark:text-ink-300 dark:hover:text-ink-100 transition px-3 py-1.5 rounded-lg hover:bg-cream-200 dark:hover:bg-ink-800"
              >
                <X className="w-3.5 h-3.5" />
                Limpar comparação
              </button>
            </div>
          )}

          {!comparacao && (
            <div className="mt-5 text-center text-sm text-primary-700/70 dark:text-ink-200 bg-cream-100 dark:bg-ink-800/60 rounded-2xl p-6 flex flex-col items-center gap-2">
              <Scale className="w-8 h-8 text-primary-500/40 dark:text-ink-300" />
              Escolha <strong className="text-primary-900 dark:text-ink-50">dois destinos diferentes</strong> acima para
              ver a comparação inteligente em 9 critérios.
            </div>
          )}

          {comparacao && <Resultado comp={comparacao} />}
        </div>
      )}
    </article>
  )
}

function Seletor({ rotulo, valor, onChange, cidades, excluir }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider font-semibold text-primary-500 dark:text-ink-300 block mb-1.5">
        {rotulo}
      </span>
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="input-base bg-white dark:bg-ink-900 text-sm"
      >
        <option value="">Selecione…</option>
        {cidades.map((c) => (
          <option key={c.slug} value={c.slug} disabled={c.slug === excluir}>
            {c.bandeira} {c.nome} · {c.pais}
          </option>
        ))}
      </select>
    </label>
  )
}

function Resultado({ comp }) {
  const {
    cidadeA, cidadeB, custoA, custoB,
    dimensoes, recomendada, motivoRecomendacao, alertaOrcamento
  } = comp

  return (
    <div className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <CidadeHeader cidade={cidadeA} custo={custoA} destaque={recomendada === cidadeA.slug} />
        <CidadeHeader cidade={cidadeB} custo={custoB} destaque={recomendada === cidadeB.slug} />
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white p-5 sm:p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="inline-block text-white/80 font-semibold text-[11px] uppercase tracking-wider mb-1">
              Melhor para você
            </span>
            <h4 className="font-display font-extrabold text-xl sm:text-2xl leading-tight mb-1.5">
              {recomendada
                ? `Recomendamos ${recomendada === cidadeA.slug ? cidadeA.nome : cidadeB.nome}`
                : 'Empate técnico'}
            </h4>
            <p className="text-sm text-white/90 leading-relaxed">{motivoRecomendacao}</p>
            {alertaOrcamento && (
              <div className="mt-3 inline-flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {alertaOrcamento}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {dimensoes.map((d) => (
          <LinhaDimensao key={d.id} dim={d} cidadeA={cidadeA} cidadeB={cidadeB} />
        ))}
      </div>
    </div>
  )
}

function CidadeHeader({ cidade, custo, destaque }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border-2 transition relative ${
        destaque ? 'border-accent-500 shadow-hover' : 'border-cream-200 dark:border-ink-700'
      }`}
    >
      <div className="relative aspect-[16/9]">
        <Imagem src={cidade.imagem} alt={cidade.nome} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-card-gradient" />
        <div className="absolute bottom-2 left-3 right-3 text-white">
          <div className="text-[10px] opacity-90 flex items-center gap-1">
            <span>{cidade.bandeira}</span> {cidade.pais}
          </div>
          <div className="font-display font-extrabold text-base sm:text-lg leading-tight drop-shadow">
            {cidade.nome}
          </div>
        </div>
        {destaque && (
          <div className="absolute top-2 right-2 bg-accent-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-soft">
            Recomendada
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 text-center bg-white dark:bg-ink-900">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-primary-500 dark:text-ink-300">
          Custo médio/dia
        </div>
        <div className="font-display font-extrabold text-base sm:text-lg text-primary-900 dark:text-ink-50 leading-tight">
          {formatarEUR(custo)}
        </div>
      </div>
    </div>
  )
}

function LinhaDimensao({ dim, cidadeA, cidadeB }) {
  const empate = dim.vencedora === null
  const venceA = dim.vencedora === cidadeA.slug
  const nomeVencedora = venceA ? cidadeA.nome : cidadeB.nome

  // % das barras (0-100). Custo + custoBeneficio: usa min-max relativo.
  // Demais: valor já é 1-5, escala para 0-100.
  let pctA, pctB
  if (dim.id === 'custo') {
    const max = Math.max(dim.valorA, dim.valorB)
    // Inverte: barra maior = mais econômico (vencedor)
    pctA = max > 0 ? (1 - dim.valorA / max) * 70 + 30 : 50
    pctB = max > 0 ? (1 - dim.valorB / max) * 70 + 30 : 50
  } else if (dim.id === 'custoBeneficio') {
    const max = Math.max(dim.valorA, dim.valorB)
    pctA = max > 0 ? (dim.valorA / max) * 100 : 0
    pctB = max > 0 ? (dim.valorB / max) * 100 : 0
  } else {
    pctA = (dim.valorA / 5) * 100
    pctB = (dim.valorB / 5) * 100
  }

  return (
    <div className="rounded-2xl p-4 bg-cream-50 border border-cream-200 dark:bg-ink-800/60 dark:border-ink-700">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none shrink-0" aria-hidden="true">{dim.emoji}</span>
          <span className="font-semibold text-sm text-primary-900 dark:text-ink-50 truncate">{dim.rotulo}</span>
        </div>
        {empate ? (
          <span className="text-[10px] font-bold text-primary-500 dark:text-ink-300 uppercase tracking-wider shrink-0">
            Empate
          </span>
        ) : (
          <span className="text-[10px] font-bold text-accent-700 dark:text-accent-300 bg-accent-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            {dim.rotuloVitoria}: {nomeVencedora}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <BarraComparacao nome={cidadeA.nome} pct={pctA} destacada={venceA && !empate} />
        <BarraComparacao nome={cidadeB.nome} pct={pctB} destacada={!venceA && !empate} />
      </div>
    </div>
  )
}

function BarraComparacao({ nome, pct, destacada }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-16 sm:w-20 text-[11px] font-semibold truncate ${
          destacada ? 'text-primary-900 dark:text-ink-50' : 'text-primary-700/60 dark:text-ink-300'
        }`}
      >
        {nome}
      </div>
      <div className="flex-1 h-2 rounded-full bg-cream-200 dark:bg-ink-700 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            destacada ? 'bg-accent-500' : 'bg-primary-300 dark:bg-ink-500'
          }`}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  )
}
