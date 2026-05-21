import { Star } from 'lucide-react'

export default function Avaliacao({ valor, mostrarNumero = true, tamanho = 14 }) {
  return (
    <div className="inline-flex items-center gap-1">
      <Star className="text-accent-500 fill-accent-500" size={tamanho} />
      {mostrarNumero && (
        <span className="text-sm font-semibold text-primary-700 dark:text-ink-100">{valor.toFixed(1)}</span>
      )}
    </div>
  )
}
