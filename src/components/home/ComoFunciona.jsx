import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, MapPin, CalendarRange, FileDown, ArrowRight } from 'lucide-react'

const passos = [
  {
    icone: Wallet,
    titulo: 'Defina seu orçamento',
    descricao: 'Diga quanto pretende gastar por dia e veja em tempo real se está dentro do plano.'
  },
  {
    icone: MapPin,
    titulo: 'Escolha as cidades',
    descricao: 'Selecione entre 16 destinos europeus com base em seus interesses e estilo de viagem.'
  },
  {
    icone: CalendarRange,
    titulo: 'Monte o roteiro',
    descricao: 'Defina dias por cidade, escolha atrações e hospedagens com preços transparentes.'
  },
  {
    icone: FileDown,
    titulo: 'Exporte e viaje',
    descricao: 'Baixe seu roteiro completo em PDF para levar com você na aventura.'
  }
]

export default function ComoFunciona() {
  return (
    <section className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-ink-900 dark:to-ink-950 text-white py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="container-app relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Como funciona
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-4 text-balance">
            Da inspiração ao roteiro pronto em minutos
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Quatro passos simples que transformam o sonho da viagem europeia em um plano detalhado e dentro do orçamento.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {passos.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="glass-dark rounded-2xl p-6 border border-white/15 h-full hover:border-accent-500/40 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center mb-4">
                  <p.icone className="w-6 h-6 text-white" />
                </div>
                <div className="text-accent-400 font-display font-extrabold text-sm mb-1">
                  PASSO {i + 1}
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{p.titulo}</h3>
                <p className="text-white/75 text-sm leading-relaxed">{p.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/planejador"
            className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-base font-semibold shadow-hover inline-flex"
          >
            Começar agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
