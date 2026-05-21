import { Clock, Tag as TagIcon, Ticket, ExternalLink } from 'lucide-react'
import Imagem from '../ui/Imagem.jsx'
import Tag from '../ui/Tag.jsx'
import WikiExtract from '../ui/WikiExtract.jsx'
import { formatarPreco, formatarBRL } from '../../utils/formatadores.js'
import { useLinkIngressoComData } from '../../hooks/useLinkComData.js'

export default function AtracaoCard({ atracao }) {
  const link = useLinkIngressoComData(atracao)
  return (
    <article className="card-base h-full flex flex-col">
      <div className="relative aspect-[4/3] w-full">
        <Imagem
          src={atracao.imagem}
          alt={atracao.nome}
          className="absolute inset-0"
        />
        <div className="absolute top-3 left-3">
          <Tag variante="branco">{atracao.categoria}</Tag>
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <Tag variante="preco">{formatarPreco(atracao.preco)}</Tag>
          {atracao.preco > 0 && (
            <span className="bg-white/95 dark:bg-ink-900/90 text-primary-700 dark:text-ink-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {formatarBRL(atracao.preco)}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-lg text-primary-900 dark:text-ink-50 mb-2 line-clamp-2 min-h-[3.5rem]">
          {atracao.nome}
        </h3>
        <p className="text-sm text-primary-700/75 dark:text-ink-200 mb-3 line-clamp-3 leading-relaxed flex-1">
          {atracao.descricao}
        </p>
        <WikiExtract wiki={atracao.wiki} />
        <div className="flex items-center gap-3 text-xs text-primary-500 dark:text-ink-300 font-semibold pt-3 mb-3 border-t border-cream-200 dark:border-ink-700">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {atracao.duracao}
          </span>
          <span className="inline-flex items-center gap-1">
            <TagIcon className="w-3.5 h-3.5" />
            {atracao.cidade}
          </span>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-4 py-2.5 text-sm w-full mt-auto"
        >
          <Ticket className="w-4 h-4" />
          Comprar ingresso
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    </article>
  )
}
