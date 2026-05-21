import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, MapPin, Plane } from 'lucide-react'
import Imagem from '../ui/Imagem.jsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarEUR, formatarBRL } from '../../utils/formatadores.js'

const EXEMPLO = {
  destinos: [
    { cidade: 'Paris', pais: 'França', dias: 4, preco: 680 },
    { cidade: 'Roma', pais: 'Itália', dias: 3, preco: 490 },
    { cidade: 'Lisboa', pais: 'Portugal', dias: 3, preco: 350 }
  ],
  total: 1520
}

export default function Hero() {
  const { dadosViagem, totais } = useViagem()
  const temRoteiro = dadosViagem.length > 0
  const destinos = temRoteiro
    ? dadosViagem.slice(0, 3).map((d) => ({
        cidade: d.cidade.nome,
        pais: d.cidade.pais,
        dias: d.dias,
        preco: Math.round(d.custoTotal)
      }))
    : EXEMPLO.destinos
  const total = temRoteiro ? Math.round(totais.custoTotal) : EXEMPLO.total
  const tituloRota = destinos.map((d) => d.cidade).join(' → ')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Imagem
          src="/images/cities/paris.jpg"
          alt="Paris ao entardecer"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>

      <div className="container-app pt-20 pb-12 grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 text-white"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-accent-500" />
            Planeje sua viagem em 4 passos simples
          </div>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-balance mb-6">
            Sua aventura europeia
            <span className="block text-accent-400">começa aqui.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-xl mb-8 leading-relaxed">
            Descubra <strong className="text-white">16 destinos imperdíveis</strong>, escolha
            atrações, hospedagens e monte um roteiro personalizado dentro do seu orçamento.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/planejador"
              className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 text-base font-semibold shadow-hover"
            >
              Começar a planejar
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#destinos"
              className="btn-base bg-white/10 backdrop-blur hover:bg-white/20 text-white px-8 py-4 text-base font-semibold border border-white/20"
            >
              Explorar destinos
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            <Stat numero="16" label="Cidades" />
            <Stat numero="80+" label="Atrações" />
            <Stat numero="64" label="Hospedagens" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 hidden lg:block"
        >
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -right-4 w-40 h-40 bg-primary-500/40 rounded-full blur-3xl" />
            <div className="relative glass-dark rounded-3xl p-6 border border-white/20">
              <div className="flex items-center gap-3 text-white mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/30 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">
                      {temRoteiro ? 'Seu roteiro' : 'Próximo destino'}
                    </div>
                    {!temRoteiro && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/15 text-white/70 font-bold uppercase tracking-wider">
                        Exemplo
                      </span>
                    )}
                  </div>
                  <div className="font-display font-bold text-lg truncate">{tituloRota}</div>
                </div>
              </div>
              {destinos.map((d) => (
                <DestinoMini
                  key={d.cidade}
                  cidade={d.cidade}
                  pais={d.pais}
                  dias={d.dias}
                  preco={d.preco}
                />
              ))}
              <div className="border-t border-white/10 mt-4 pt-4 flex items-center justify-between">
                <span className="text-white/70 text-sm">Total estimado</span>
                <div className="text-right">
                  <div className="font-display font-extrabold text-2xl text-accent-400 leading-none">
                    {formatarEUR(total)}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">≈ {formatarBRL(total)}</div>
                </div>
              </div>
              {temRoteiro && (
                <Link
                  to="/roteiro"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-accent-300 hover:text-accent-200 transition"
                >
                  Ver roteiro completo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-semibold tracking-widest uppercase animate-pulse">
        ↓ Role para descobrir
      </div>
    </section>
  )
}

function Stat({ numero, label }) {
  return (
    <div>
      <div className="font-display font-extrabold text-3xl text-accent-400">{numero}</div>
      <div className="text-sm text-white/70 font-semibold">{label}</div>
    </div>
  )
}

function DestinoMini({ cidade, pais, dias, preco }) {
  return (
    <div className="flex items-center justify-between py-2 text-white">
      <div className="flex items-center gap-3 min-w-0">
        <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{cidade}</div>
          <div className="text-xs text-white/60 truncate">{pais} · {dias} {dias === 1 ? 'dia' : 'dias'}</div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-display font-bold text-sm text-white/90 leading-none">{formatarEUR(preco)}</div>
        <div className="text-[10px] text-white/55 mt-0.5">{formatarBRL(preco)}</div>
      </div>
    </div>
  )
}
