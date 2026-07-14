import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFavoritos } from '../../hooks/useFavoritos.js'

// Coração de favoritar usado nos cards de atração e hospedagem.
// `tipo` = 'atracoes' | 'hospedagens'.
export default function BotaoFavorito({ tipo, id, nome }) {
  const { ehFavorito, toggleFavorito } = useFavoritos()
  const ativo = ehFavorito(tipo, id)

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault()
        toggleFavorito(tipo, id)
      }}
      aria-pressed={ativo}
      aria-label={ativo ? `Remover ${nome} dos favoritos` : `Salvar ${nome} nos favoritos`}
      title={ativo ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
        ativo
          ? 'bg-accent-500 text-white'
          : 'bg-white/95 text-primary-700 hover:text-accent-500 dark:bg-ink-900/90 dark:text-ink-100'
      }`}
    >
      <Heart className="w-[18px] h-[18px]" fill={ativo ? 'currentColor' : 'none'} aria-hidden="true" />
    </motion.button>
  )
}
