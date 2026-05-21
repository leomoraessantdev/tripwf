import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarEUR } from '../../utils/formatadores.js'

// Banner com 5 KPIs em emoji + número grande. Visualmente "produto",
// sem ícones lucide para reforçar leitura rápida.

export default function ResumoRapido() {
  const { dadosViagem, totais, cidadesSelecionadas } = useViagem()
  if (cidadesSelecionadas.length === 0) return null

  const ncid = cidadesSelecionadas.length
  const noites = totais.totalDias
  const atracoes = dadosViagem.reduce((s, d) => s + d.atracoes.length, 0)
  const trechos = Math.max(0, dadosViagem.length - 1)

  const stats = [
    { emoji: '🌍', label: ncid === 1 ? 'Cidade'  : 'Cidades',        valor: ncid },
    { emoji: '🏨', label: noites === 1 ? 'Noite' : 'Noites',         valor: noites },
    { emoji: '🎟️', label: atracoes === 1 ? 'Atração' : 'Atrações',    valor: atracoes },
    { emoji: '🚄', label: trechos === 1 ? 'Deslocamento' : 'Deslocamentos', valor: trechos },
    { emoji: '💰', label: 'Total',                                    valor: formatarEUR(totais.custoTotal), destaque: true }
  ]

  return (
    <section aria-label="Resumo rápido da viagem">
      <span className="block text-accent-500 font-semibold text-[11px] uppercase tracking-wider mb-3">
        Resumo rápido
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s) => (
          <Card key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}

function Card({ emoji, label, valor, destaque }) {
  return (
    <div
      className={`group rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        destaque
          ? 'bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-soft hover:shadow-hover'
          : 'bg-white border border-cream-200 hover:border-accent-500/30 hover:shadow-soft text-primary-900 dark:bg-ink-900 dark:border-ink-700 dark:text-ink-50 dark:hover:border-accent-500/50'
      }`}
    >
      <div className="text-2xl sm:text-3xl mb-1.5 leading-none transition-transform group-hover:scale-110 origin-left">
        <span aria-hidden="true">{emoji}</span>
      </div>
      <div
        className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold mb-1 ${
          destaque ? 'text-white/80' : 'text-primary-500 dark:text-ink-300'
        }`}
      >
        {label}
      </div>
      <div
        className={`font-display font-extrabold leading-none ${
          destaque ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
        }`}
      >
        {valor}
      </div>
    </div>
  )
}
