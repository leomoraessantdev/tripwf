import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Home, Map } from 'lucide-react'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

// Página 404 personalizada — mantém o tom de viagem do produto.
export default function Pagina404() {
  useTituloPagina('Página não encontrada')

  return (
    <section className="container-app py-24 sm:py-32 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
          <motion.div
            animate={{ rotate: [0, 20, -15, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Compass className="w-14 h-14 text-white" aria-hidden="true" />
          </motion.div>
        </div>
        <span className="absolute -bottom-3 -right-3 bg-accent-500 text-white font-display font-extrabold text-sm px-3 py-1 rounded-full shadow-md rotate-6">
          404
        </span>
      </motion.div>

      <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-primary-900 dark:text-ink-50 mb-4 text-balance">
        Você saiu do roteiro
      </h1>
      <p className="text-lg text-primary-700/75 dark:text-ink-200 max-w-md mb-10 leading-relaxed">
        Esta página não existe no mapa. Acontece com os melhores viajantes —
        vamos te colocar de volta no caminho.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-base bg-primary-500 hover:bg-primary-600 text-white px-6 py-3">
          <Home className="w-4 h-4" aria-hidden="true" />
          Voltar para a home
        </Link>
        <Link to="/planejador" className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-6 py-3">
          <Map className="w-4 h-4" aria-hidden="true" />
          Planejar uma viagem
        </Link>
      </div>
    </section>
  )
}
