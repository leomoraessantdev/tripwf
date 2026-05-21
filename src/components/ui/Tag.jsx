import clsx from 'clsx'

const variantes = {
  default: 'bg-cream-200 text-primary-700 dark:bg-ink-800 dark:text-ink-100',
  primario: 'bg-primary-500/10 text-primary-700 border border-primary-500/20 dark:bg-ink-800 dark:text-ink-100 dark:border-ink-600',
  acento: 'bg-accent-500/10 text-accent-700 border border-accent-500/20 dark:text-accent-300 dark:border-accent-500/40',
  preco: 'bg-accent-500 text-white shadow-sm',
  sucesso: 'bg-success/10 text-success border border-success/20 dark:bg-success/20 dark:text-emerald-300',
  branco: 'bg-white/95 text-primary-700 backdrop-blur shadow-sm dark:bg-ink-900/80 dark:text-ink-100'
}

export default function Tag({ children, variante = 'default', icone: Icone, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
        variantes[variante],
        className
      )}
    >
      {Icone && <Icone className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}
