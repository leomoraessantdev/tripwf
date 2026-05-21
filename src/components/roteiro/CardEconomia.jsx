import { useMemo } from 'react'
import {
  PiggyBank, Check, TrendingDown, ArrowRight,
  BedDouble, Ticket, Plane, Thermometer, Lightbulb
} from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { calcularEconomia } from '../../utils/economiaCalculada.js'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'

// =============================================================
// Card "Quanto você economizou planejando".
// =============================================================
// Mostra baseline (turista sem planejar) × atual, breakdown por categoria,
// indicador 🟢/🟡/🔴 e top sugestão de economia adicional.

const INDICADOR = {
  excelente: {
    emoji: '🟢',
    rotulo: 'Excelente economia',
    chip: 'bg-success/15 text-success border-success/30'
  },
  moderado: {
    emoji: '🟡',
    rotulo: 'Economia moderada',
    chip: 'bg-warning/15 text-warning border-warning/30'
  },
  alto: {
    emoji: '🔴',
    rotulo: 'Alto custo',
    chip: 'bg-danger/15 text-danger border-danger/30'
  }
}

const CATEGORIAS = [
  { id: 'hospedagem',  icone: BedDouble,    label: 'Hospedagem' },
  { id: 'atracoes',    icone: Ticket,       label: 'Atrações' },
  { id: 'transporte',  icone: Plane,        label: 'Transporte' },
  { id: 'temporada',   icone: Thermometer,  label: 'Temporada' }
]

export default function CardEconomia() {
  const { dadosViagem, totais, dataIda } = useViagem()
  const economia = useMemo(
    () => calcularEconomia({ dadosViagem, totais, dataIda }),
    [dadosViagem, totais, dataIda]
  )

  if (!economia || economia.economiaTotal < 1) return null

  const ind = INDICADOR[economia.indicador]
  const pctEconomia = Math.round(economia.ratio * 100)

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-soft">
      {/* Background premium: mesmo gradient do HeroRoteiro/ResumoViagem
          para continuidade visual + blobs accent. */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-600" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-success/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(95,139,76,0.25), transparent 45%)'
        }}
        aria-hidden="true"
      />

      <div className="relative p-6 sm:p-8 text-white">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-success flex items-center justify-center shrink-0 shadow-lg">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="inline-block text-success font-semibold text-xs uppercase tracking-wider mb-1 bg-white/95 px-2.5 py-0.5 rounded-full">
                Economia estimada
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                Quanto você economizou planejando
              </h2>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-semibold text-xs bg-white/95 ${ind.chip}`}
          >
            <span className="text-base leading-none" aria-hidden="true">{ind.emoji}</span>
            {ind.rotulo}
          </span>
        </header>

        {/* Bloco principal — valor da economia em destaque */}
        <div className="text-center mb-6">
          <div className="text-[11px] uppercase tracking-wider font-bold text-white/70 mb-1.5 inline-flex items-center gap-1.5">
            <span aria-hidden="true">💰</span>
            Você economizou aproximadamente
          </div>
          <div className="font-display font-extrabold text-5xl sm:text-6xl text-white leading-none">
            {formatarEUR(economia.economiaTotal)}
          </div>
          <div className="text-sm text-white/70 mt-2">
            {formatarBRL(economia.economiaTotal)}
            {pctEconomia > 0 && (
              <>
                <span className="mx-2 text-white/40">·</span>
                {pctEconomia}% abaixo do esperado para uma viagem similar
              </>
            )}
          </div>
        </div>

        {/* Comparação visual: viagem média × seu roteiro × economia */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <ComparacaoCard
            rotulo="Viagem média semelhante"
            valor={economia.baselineTotal}
            destaque={false}
          />
          <ComparacaoCard
            rotulo="Seu roteiro"
            valor={economia.atualTotal}
            destaque
          />
          <ComparacaoCard
            rotulo="Economia"
            valor={economia.economiaTotal}
            destaque={false}
            verde
          />
        </div>

        {/* Explicação: badges de causas da economia */}
        {economia.badges.length > 0 && (
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4 sm:p-5 mb-6">
            <div className="text-[11px] uppercase tracking-wider font-bold text-white/80 mb-3 inline-flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-success" />
              Seu planejamento evitou gastos desnecessários através de
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {economia.badges.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-white/95 leading-snug">
                  <Check className="w-4 h-4 text-success shrink-0 mt-0.5" strokeWidth={3} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Breakdown numérico por categoria */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {CATEGORIAS.map((c) => (
            <BreakdownTile
              key={c.id}
              icone={c.icone}
              label={c.label}
              valor={economia.breakdown[c.id]}
            />
          ))}
        </div>

        {/* Sugestão extra — economia adicional via troca de hotel */}
        {economia.topSugestao && (
          <div className="rounded-2xl bg-accent-500 text-white p-4 sm:p-5 flex items-start gap-3 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/85 mb-0.5">
                Quer economizar ainda mais?
              </div>
              <p className="text-sm sm:text-base font-semibold leading-snug">
                {economia.topSugestao.texto}
              </p>
              <p className="text-xs text-white/80 mt-1">
                {economia.topSugestao.hotelAtual}
                <ArrowRight className="inline w-3 h-3 mx-1.5" />
                {economia.topSugestao.hotelAlternativo}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ComparacaoCard({ rotulo, valor, destaque, verde }) {
  return (
    <div
      className={
        destaque
          ? 'rounded-2xl p-4 sm:p-5 bg-white text-primary-900 shadow-soft'
          : verde
            ? 'rounded-2xl p-4 sm:p-5 bg-success text-white shadow-soft'
            : 'rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur border border-white/15 text-white'
      }
    >
      <div
        className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${
          destaque ? 'text-primary-500' : verde ? 'text-white/85' : 'text-white/70'
        }`}
      >
        {rotulo}
      </div>
      <div className="font-display font-extrabold text-2xl sm:text-3xl leading-none">
        {verde ? '−' : ''}{formatarEUR(valor)}
      </div>
      <div
        className={`text-[10px] mt-1 ${
          destaque ? 'text-primary-500' : verde ? 'text-white/75' : 'text-white/55'
        }`}
      >
        {formatarBRL(valor)}
      </div>
    </div>
  )
}

function BreakdownTile({ icone: Icone, label, valor }) {
  const semGanho = valor < 1
  return (
    <div
      className={`rounded-xl p-3 backdrop-blur border transition ${
        semGanho
          ? 'bg-white/5 border-white/10 opacity-60'
          : 'bg-white/10 border-white/15'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
          <Icone className="w-3.5 h-3.5 text-success" />
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-white/75">
          {label}
        </span>
      </div>
      <div className="font-display font-extrabold text-lg sm:text-xl text-white leading-none">
        {semGanho ? '—' : `−${formatarEUR(valor)}`}
      </div>
    </div>
  )
}
