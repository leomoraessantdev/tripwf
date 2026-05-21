import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Sparkles, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import Imagem from '../ui/Imagem.jsx'
import Tag from '../ui/Tag.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'

export default function CidadeHero({ cidade, selecionada, onToggle }) {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Imagem
          src={cidade.imagem}
          alt={cidade.nome}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-primary-900/20" />
      </div>

      <div className="container-app relative pt-24 pb-12 text-white">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos destinos
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <Tag variante="branco" className="mb-4">
            <span className="text-base">{cidade.bandeira}</span>
            {cidade.pais}
          </Tag>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mb-4 drop-shadow text-balance">
            {cidade.nome}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-6 leading-relaxed">
            {cidade.descricao}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <Utensils className="w-4 h-4 text-accent-400" />
              Alimentação ~{formatarEUR(cidade.custoAlimentacaoDia)} ({formatarBRL(cidade.custoAlimentacaoDia)}) /dia
            </div>
            <button
              onClick={onToggle}
              className={`btn-base px-6 py-3 text-base font-semibold ${
                selecionada
                  ? 'bg-success hover:bg-success/90 text-white'
                  : 'bg-accent-500 hover:bg-accent-600 text-white shadow-hover'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              {selecionada ? 'Adicionado à viagem' : 'Adicionar à minha viagem'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
