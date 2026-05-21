import { BookOpen, ChevronDown, ExternalLink } from 'lucide-react'
import { useWikiResumo } from '../../hooks/useWikiResumo.js'

// Bloco discreto colapsado que mostra o resumo da Wikipedia. Native <details>
// para não precisar gerenciar estado expandido. Usa o cache global do Wikipedia
// REST — se outro componente da página já buscou o mesmo slug, vem instantâneo.
export default function WikiExtract({ wiki, limite = 240 }) {
  const resumo = useWikiResumo(wiki)
  if (!resumo?.extract) return null

  const texto = resumo.extract.length > limite
    ? resumo.extract.slice(0, limite).replace(/\s+\S*$/, '') + '…'
    : resumo.extract

  return (
    <details className="group mb-3 text-xs">
      <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 font-semibold text-primary-500 dark:text-ink-300 hover:text-accent-600 dark:hover:text-accent-400 transition select-none">
        <BookOpen className="w-3.5 h-3.5" />
        Sobre na Wikipedia
        <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 p-3 rounded-lg bg-cream-100 border border-cream-200 dark:bg-ink-800 dark:border-ink-700 leading-relaxed text-primary-700 dark:text-ink-100">
        {resumo.descricao && (
          <div className="text-[10px] uppercase tracking-wider text-primary-500 dark:text-ink-300 font-bold mb-1">
            {resumo.descricao}
          </div>
        )}
        <p>{texto}</p>
        {resumo.urlArtigo && (
          <a
            href={resumo.urlArtigo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-accent-600 hover:text-accent-700 dark:text-accent-300 dark:hover:text-accent-200 font-semibold"
          >
            Ler artigo completo <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>
    </details>
  )
}
