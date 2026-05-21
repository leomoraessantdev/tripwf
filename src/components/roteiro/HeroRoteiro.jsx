import { motion } from 'framer-motion'
import { Sparkles, Compass, MapPin, CalendarDays } from 'lucide-react'
import { useViagem } from '../../context/ViagemContext.jsx'
import { estimarDeslocamento } from '../../utils/deslocamento.js'
import { gerarNarrativa } from '../../utils/narrativaRoteiro.js'
import { computarDatasCidades, formatarDataLonga } from '../../utils/datas.js'

const ESTILO_LABEL = { economico: 'Econômico', conforto: 'Conforto', luxo: 'Luxo' }

export default function HeroRoteiro() {
  const {
    dadosViagem, totais, estilo, origem, dataIda, cidadesSelecionadas
  } = useViagem()

  const desloc = estimarDeslocamento(dadosViagem, totais.totalDias)
  const intensidade = desloc?.intensidade || 'leve'
  const narrativa = gerarNarrativa({ dadosViagem, totais, estilo, intensidade })
  const { dataVolta, cidadesComDatas } = computarDatasCidades(dataIda, cidadesSelecionadas)
  const dataInicio = cidadesComDatas[0]?.dataInicio

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-soft">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-600 dark:from-ink-900 dark:via-ink-800 dark:to-ink-950" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-500/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 45%)'
        }}
        aria-hidden="true"
      />

      <div className="relative px-6 sm:px-12 py-12 sm:py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-1.5 text-accent-300 font-semibold text-[11px] uppercase tracking-wider mb-5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            Roteiro finalizado
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance mb-4">
            {narrativa.titulo}
          </h1>

          <div className="font-display text-lg sm:text-2xl text-accent-300 font-bold mb-6">
            {narrativa.subtitulo}
          </div>

          <div className="space-y-3 text-white/90 max-w-2xl text-base sm:text-lg leading-relaxed">
            <p>{narrativa.mensagem}</p>
            <p className="text-white/80 flex items-start gap-2">
              <Compass className="w-5 h-5 mt-1 text-accent-300 shrink-0" />
              <span>{narrativa.mensagemEmocional}</span>
            </p>
          </div>
        </motion.div>

        {(origem || dataInicio || estilo) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            {origem && (
              <Chip icone={MapPin}>
                <span className="text-white/70">Saindo de</span>{' '}
                <strong className="font-semibold">{origem}</strong>
              </Chip>
            )}
            {dataInicio && (
              <Chip icone={CalendarDays}>
                <strong className="font-semibold">{formatarDataLonga(dataInicio)}</strong>
                <span className="text-white/70 mx-1.5">→</span>
                <strong className="font-semibold">{formatarDataLonga(dataVolta)}</strong>
              </Chip>
            )}
            {estilo && (
              <span className="bg-accent-500 text-white px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-bold shadow-soft">
                {ESTILO_LABEL[estilo] || 'Conforto'}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function Chip({ icone: Icone, children }) {
  return (
    <span className="glass-dark px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs border border-white/15">
      <Icone className="w-3 h-3 text-accent-300" />
      {children}
    </span>
  )
}
