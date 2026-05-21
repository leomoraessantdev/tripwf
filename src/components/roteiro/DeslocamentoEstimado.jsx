import { Footprints, TrainFront, Clock, Activity } from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { estimarDeslocamento, formatarDuracao } from '../../utils/deslocamento.js'

const INTENSIDADE_VISUAL = {
  leve: {
    rotulo: 'Roteiro leve',
    emoji: '🟢',
    cor: 'text-success',
    fundo: 'bg-success/10',
    borda: 'border-success/30',
    descricao: 'Ritmo confortável, caminhadas curtas e tempo de sobra entre atrações.'
  },
  moderado: {
    rotulo: 'Roteiro moderado',
    emoji: '🟡',
    cor: 'text-warning',
    fundo: 'bg-warning/10',
    borda: 'border-warning/30',
    descricao: 'Bom equilíbrio entre caminhada e transporte público — leve calçado confortável.'
  },
  intenso: {
    rotulo: 'Roteiro intenso',
    emoji: '🔴',
    cor: 'text-danger',
    fundo: 'bg-danger/10',
    borda: 'border-danger/30',
    descricao: 'Muitas atrações por dia. Reserve pausas no trajeto e priorize as imperdíveis.'
  }
}

export default function DeslocamentoEstimado() {
  const { dadosViagem, totais } = useViagem()
  const est = estimarDeslocamento(dadosViagem, totais.totalDias)
  if (!est) return null

  const visual = INTENSIDADE_VISUAL[est.intensidade]
  const kmCaminhada = (Math.round(est.kmCaminhadaDia * 10) / 10).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })
  const trechosMetroDia = Math.round(est.trechosMetroDia)
  const tempoDia = formatarDuracao(est.minutosDia)

  return (
    <article className="card-base p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-accent-500" />
          </div>
          <div>
            <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider">
              Ritmo da viagem
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
              Seu deslocamento estimado
            </h2>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm self-start sm:self-auto ${visual.fundo} ${visual.borda} ${visual.cor}`}
        >
          <span className="text-base leading-none" aria-hidden="true">{visual.emoji}</span>
          {visual.rotulo}
        </span>
      </header>

      <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
        <Tile
          icone={Footprints}
          destaque={`${kmCaminhada} km`}
          rotulo="Caminhada por dia"
          texto="Inclui exploração local e conexões a pé entre atrações."
        />
        <Tile
          icone={TrainFront}
          destaque={`${trechosMetroDia} ${trechosMetroDia === 1 ? 'trecho' : 'trechos'} de metrô`}
          rotulo="Por dia, em média"
          texto={
            est.trechosMetroTotal === 0
              ? 'Roteiro essencialmente a pé — sem metrô estimado.'
              : `Cerca de ${est.trechosMetroTotal} ${est.trechosMetroTotal === 1 ? 'trecho' : 'trechos'} no total da viagem.`
          }
        />
        <Tile
          icone={Clock}
          destaque={tempoDia}
          rotulo="Deslocamento diário"
          texto="Tempo somado de caminhada e transporte público."
        />
      </div>

      <p className="mt-6 pt-5 border-t border-cream-200 dark:border-ink-700 text-sm text-primary-700/80 dark:text-ink-200">
        <span className="font-semibold text-primary-900 dark:text-ink-50">{visual.rotulo}:</span> {visual.descricao}
      </p>
    </article>
  )
}

function Tile({ icone: Icone, destaque, rotulo, texto }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 h-full flex flex-col bg-cream-100 border border-cream-200 dark:bg-ink-800/60 dark:border-ink-700">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center shrink-0">
          <Icone className="w-4 h-4 text-accent-500" />
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
