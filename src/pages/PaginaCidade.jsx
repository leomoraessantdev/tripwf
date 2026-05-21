import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, BedDouble, ArrowRight } from 'lucide-react'
import { buscarCidade } from '../data/cidades.js'
import { useViagem } from '../context/ViagemContext.jsx'
import CidadeHero from '../components/cidade/CidadeHero.jsx'
import AtracaoCard from '../components/cidade/AtracaoCard.jsx'
import HospedagemCard from '../components/cidade/HospedagemCard.jsx'
import MelhorEpoca from '../components/cidade/MelhorEpoca.jsx'
import { useEffect } from 'react'

export default function PaginaCidade() {
  const { slug } = useParams()
  const cidade = buscarCidade(slug)
  const { toggleCidade, cidadeEstaSelecionada } = useViagem()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!cidade) return <Navigate to="/" />

  const selecionada = cidadeEstaSelecionada(slug)

  return (
    <>
      <CidadeHero
        cidade={cidade}
        selecionada={selecionada}
        onToggle={() => toggleCidade(slug)}
      />

      <section className="container-app pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <MelhorEpoca cidade={cidade} />
        </motion.div>
      </section>

      <section className="container-app py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
            <Camera className="w-6 h-6 text-accent-500" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-3xl text-primary-900 dark:text-ink-50">
              Atrações em destaque
            </h2>
            <p className="text-primary-700/70 dark:text-ink-200">{cidade.atracoes.length} experiências imperdíveis</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cidade.atracoes.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            >
              <AtracaoCard atracao={a} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-cream-200/50 dark:bg-ink-900/40 py-16">
        <div className="container-app">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 dark:bg-accent-500/10 flex items-center justify-center">
              <BedDouble className="w-6 h-6 text-primary-500 dark:text-accent-400" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-3xl text-primary-900 dark:text-ink-50">
                Onde se hospedar
              </h2>
              <p className="text-primary-700/70 dark:text-ink-200">{cidade.hospedagens.length} opções para todos os bolsos</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cidade.hospedagens.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              >
                <HospedagemCard hospedagem={h} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-ink-900 dark:to-ink-950 dark:ring-1 dark:ring-ink-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent-500/30 rounded-full blur-3xl" />
          <div className="relative max-w-2xl">
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl mb-3 text-balance">
              Pronto para incluir {cidade.nome} no seu roteiro?
            </h3>
            <p className="text-white/85 mb-6 text-lg">
              Vá para o planejador e escolha quantos dias quer ficar, suas atrações favoritas e a hospedagem ideal.
            </p>
            <Link
              to="/planejador"
              className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-base font-semibold shadow-hover inline-flex"
            >
              Ir para o planejador
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
