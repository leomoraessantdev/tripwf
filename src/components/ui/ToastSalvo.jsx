import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { escutarSalvamento } from '../../utils/saveTracker.js'

const DURACAO_MS = 2200
const TEXTO_PADRAO = 'Roteiro salvo automaticamente'

export default function ToastSalvo() {
  const [visivel, setVisivel] = useState(false)
  const [texto, setTexto] = useState(TEXTO_PADRAO)
  const timerRef = useRef(null)

  useEffect(() => {
    return escutarSalvamento(({ texto: t }) => {
      setTexto(t || TEXTO_PADRAO)
      setVisivel(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisivel(false), DURACAO_MS)
    })
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[60] pointer-events-none">
      <AnimatePresence>
        {visivel && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 bg-primary-900 dark:bg-ink-800 dark:ring-1 dark:ring-ink-600 text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/10"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">{texto}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
