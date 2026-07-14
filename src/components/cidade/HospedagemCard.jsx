import { MapPin, BedDouble, ExternalLink } from 'lucide-react'
import Imagem from '../ui/Imagem.jsx'
import BotaoFavorito from '../ui/BotaoFavorito.jsx'
import Tag from '../ui/Tag.jsx'
import Avaliacao from '../ui/Avaliacao.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'
import { useLinkReservaComData } from '../../hooks/useLinkComData.js'

const coresTipo = {
  Hotel: 'bg-primary-500 text-white',
  Hostel: 'bg-accent-500 text-white',
  Apartamento: 'bg-success text-white'
}

export default function HospedagemCard({ hospedagem }) {
  const link = useLinkReservaComData(hospedagem)
  return (
    <article className="card-base h-full flex flex-col">
      <div className="relative aspect-[4/3] w-full">
        <Imagem
          src={hospedagem.imagem}
          alt={hospedagem.nome}
          className="absolute inset-0"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${coresTipo[hospedagem.tipo] || 'bg-primary-500 text-white'}`}>
            {hospedagem.tipo}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Tag variante="branco">
            <Avaliacao valor={hospedagem.avaliacao} />
          </Tag>
        </div>
        <div className="absolute bottom-3 right-3">
          <BotaoFavorito tipo="hospedagens" id={hospedagem.id} nome={hospedagem.nome} />
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-lg text-primary-900 dark:text-ink-50 mb-1 line-clamp-2 min-h-[3.5rem]">
          {hospedagem.nome}
        </h3>
        <div className="flex items-center gap-1 text-sm text-primary-500 dark:text-ink-300 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {hospedagem.bairro}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hospedagem.comodidades.slice(0, 3).map((c) => (
            <span
              key={c}
              className="text-xs px-2 py-1 rounded-md bg-cream-200 text-primary-700 dark:bg-ink-800 dark:text-ink-100 font-medium"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="pt-3 mb-3 border-t border-cream-200 dark:border-ink-700 flex items-end justify-between">
          <div>
            <div className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50">
              {formatarEUR(hospedagem.precoNoite)}
            </div>
            <div className="text-xs text-primary-500 dark:text-ink-300">por noite · {formatarBRL(hospedagem.precoNoite)}</div>
          </div>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-base bg-primary-500 hover:bg-primary-600 dark:bg-ink-700 dark:hover:bg-ink-500 dark:ring-1 dark:ring-ink-600 text-white px-4 py-2.5 text-sm w-full mt-auto"
        >
          <BedDouble className="w-4 h-4" />
          Reservar
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    </article>
  )
}
