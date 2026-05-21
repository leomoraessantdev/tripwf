import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { cidades } from '../../data/cidades.js'
import Imagem from '../ui/Imagem.jsx'
import Tag from '../ui/Tag.jsx'

export default function DestinosGrid() {
  return (
    <section id="destinos" className="container-app py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cidades.map((cidade, i) => (
          <motion.div
            key={cidade.slug}
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
                    <h3 className="font-display font-extrabold text-2xl mb-1 drop-shadow">{cidade.nome}</h3>
                    <div className="flex items-center gap-1 text-sm text-white/90">
                      <MapPin className="w-3.5 h-3.5" />
                      {cidade.destaques?.[0] || cidade.pais}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-2">
                    <ArrowUpRight className="w-4 h-4 text-primary-700" />
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
    </section>
  )
}
