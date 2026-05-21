import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'

export default function ResumoFlutuante() {
  const { totais, orcamentoDiario, cidadesSelecionadas } = useViagem()
  if (cidadesSelecionadas.length === 0 || totais.totalDias === 0) return null

  const dentro = totais.dentroDoOrcamento
  const percent = totais.orcamentoTotal > 0
    ? Math.min(100, (totais.custoTotal / totais.orcamentoTotal) * 100)
    : 0

  return (
    <div className="bg-white rounded-2xl shadow-hover p-5 border border-cream-200">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-accent-500" />
        <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Resumo da viagem</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div>
          <div className="font-display font-extrabold text-xl text-primary-900">{cidadesSelecionadas.length}</div>
          <div className="text-xs text-primary-500">cidades</div>
        </div>
        <div>
          <div className="font-display font-extrabold text-xl text-primary-900">{totais.totalDias}</div>
          <div className="text-xs text-primary-500">dias</div>
        </div>
        <div>
          <div className="font-display font-extrabold text-xl text-accent-500 leading-none">
            {formatarEUR(totais.custoTotal)}
          </div>
          <div className="text-[10px] text-primary-500 mt-0.5">{formatarBRL(totais.custoTotal)}</div>
          <div className="text-xs text-primary-500">total</div>
        </div>
      </div>
      <div className="mb-2">
        <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
          <div
            className={clsx('h-full transition-all', dentro ? 'bg-success' : 'bg-danger')}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-primary-500">
          Orç.: {formatarEUR(orcamentoDiario)} ({formatarBRL(orcamentoDiario)})/dia
        </span>
        <span className={clsx('font-bold inline-flex items-center gap-1', dentro ? 'text-success' : 'text-danger')}>
          {dentro ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {dentro
            ? `Sobra ${formatarEUR(totais.diferenca)}`
            : `Excede ${formatarEUR(-totais.diferenca)}`}
        </span>
      </div>
    </div>
  )
}
