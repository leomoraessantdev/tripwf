import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight, Search, SearchX } from 'lucide-react'
import { cidades } from '../../data/cidades.js'
import { formatarEUR } from '../../utils/formatadores.js'
import Imagem from '../ui/Imagem.jsx'
import Tag from '../ui/Tag.jsx'

const ORDENACOES = {
  Populares: null,
  'Menor custo/dia': (a, b) => a.custoMedioDia - b.custoMedioDia,
  'Maior custo/dia': (a, b) => b.custoMedioDia - a.custoMedioDia
}

export default function DestinosGrid() {
  const [busca, setBusca] = useState('')
  const [pais, setPais] = useState('Todos')
  const [ordem, setOrdem] = useState('Populares')

  const paises = useMemo(
    () => ['Todos', ...new Set(cidades.map((c) => c.pais))].sort((a, b) =>
      a === 'Todos' ? -1 : b === 'Todos' ? 1 : a.localeCompare(b, 'pt-BR')
    ),
    []
  )

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    let lista = cidades.filter((c) => {
      if (pais !== 'Todos' && c.pais !== pais) return false
      if (!termo) return true
      const alvo = `${c.nome} ${c.pais} ${c.destaques.join(' ')}`.toLowerCase()
      return alvo.includes(termo)
    })
    const comparador = ORDENACOES[ordem]
    if (comparador) lista = [...lista].sort(comparador)
    return lista
  }, [busca, pais, ordem])

  return (
    <section id="destinos" className="container-app py-20">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-block text-accent-500 font-semibold text-sm uppercase tracking-wider mb-3">
          Destinos imperdíveis
        </span>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-primary-900 dark:text-ink-50 mb-4 text-balance">
          16 cidades para se apaixonar
        </h2>
        <p className="text-primary-700/80 dark:text-ink-200 text-lg leading-relaxed">
          De Paris a Istambul, monte sua viagem combinando os destinos mais icônicos da Europa
          com hospedagens e atrações cuidadosamente selecionadas.
        </p>
      </div>

      {/* Busca + filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-3xl mx-auto">
        <label className="relative flex-1">
          <span className="sr-only">Buscar destino</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 dark:text-ink-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar cidade, país ou atração…"
            className="input-base pl-10 w-full"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-ink-200">
          <span className="sr-only">Filtrar por país</span>
          <select value={pais} onChange={(e) => setPais(e.target.value)} className="input-base py-2.5 w-full sm:w-auto">
            {paises.map((p) => <option key={p} value={p}>{p === 'Todos' ? 'Todos os países' : p}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-ink-200">
          <span className="sr-only">Ordenar destinos</span>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)} className="input-base py-2.5 w-full sm:w-auto">
            {Object.keys(ORDENACOES).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      </div>

      {visiveis.length === 0 ? (
        <div className="text-center py-16 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 dark:bg-ink-800 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 text-primary-400 dark:text-ink-400" aria-hidden="true" />
          </div>
          <p className="font-display font-bold text-xl text-primary-900 dark:text-ink-50 mb-1">
            Nenhum destino encontrado
          </p>
          <p className="text-sm text-primary-700/70 dark:text-ink-300">
            Tente outro termo ou limpe os filtros para ver as 16 cidades.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visiveis.map((cidade, i) => (
            <motion.div
              key={cidade.slug}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            >
              <Link to={`/cidade/${cidade.slug}`} className="block group h-full">
                <article className="card-base h-full flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Imagem
                      src={cidade.imagem}
                      alt={cidade.nome}
                      className="absolute inset-0 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-card-gradient" />
                    <div className="absolute top-4 left-4">
                      <Tag variante="branco">
                        <span className="text-base leading-none">{cidade.bandeira}</span>
                        {cidade.pais}
                      </Tag>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <h3 className="font-display font-extrabold text-2xl mb-1 drop-shadow">{cidade.nome}</h3>
                          <div className="flex items-center gap-1 text-sm text-white/90">
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            {cidade.destaques?.[0] || cidade.pais}
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] font-bold bg-white/95 text-primary-800 px-2 py-1 rounded-full shadow-sm">
                          ~{formatarEUR(cidade.custoMedioDia)}/dia
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-2">
                      <ArrowUpRight className="w-4 h-4 text-primary-700" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-primary-700/80 dark:text-ink-200 mb-3 line-clamp-3 leading-relaxed flex-1">
                      {cidade.descricao}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {cidade.destaques.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className="text-xs px-2 py-1 rounded-md bg-cream-200 text-primary-700 dark:bg-ink-800 dark:text-ink-100 font-medium"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
