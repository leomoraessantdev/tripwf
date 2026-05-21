import clsx from 'clsx'

const variantes = {
  primario: 'bg-accent-500 hover:bg-accent-600 text-white shadow-soft hover:shadow-hover',
  secundario: 'bg-primary-500 hover:bg-primary-600 text-white shadow-soft hover:shadow-hover dark:bg-ink-800 dark:hover:bg-ink-700 dark:ring-1 dark:ring-ink-700',
  ghost: 'bg-transparent hover:bg-cream-200 text-primary-700 dark:hover:bg-ink-800 dark:text-ink-100',
  outline: 'border-2 border-primary-500 text-primary-700 hover:bg-primary-500 hover:text-white dark:border-ink-600 dark:text-ink-100 dark:hover:bg-ink-800 dark:hover:border-ink-500',
  branco: 'bg-white hover:bg-cream-100 text-primary-700 shadow-soft dark:bg-ink-900 dark:hover:bg-ink-800 dark:text-ink-100 dark:ring-1 dark:ring-ink-700'
}

const tamanhos = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export default function Botao({
  children,
  variante = 'primario',
  tamanho = 'md',
  className,
  ...props
}) {
  return (
    <button
      className={clsx('btn-base', variantes[variante], tamanhos[tamanho], className)}
      {...props}
    >
      {children}
    </button>
  )
}
