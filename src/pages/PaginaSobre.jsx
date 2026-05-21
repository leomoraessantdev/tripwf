import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, ArrowRight, AlertCircle, Compass, Plane, BedDouble, Ticket,
  Train, Wallet, Map as MapIcon, ListChecks, Wand2, Shield, Globe2,
  GraduationCap, Quote
} from 'lucide-react'
import Imagem from '../components/ui/Imagem.jsx'

const PROBLEMAS = [
  { titulo: 'Custos imprevisíveis', desc: 'Hospedagem, atrações, transportes e alimentação somam de forma diferente em cada cidade.' },
  { titulo: 'Pesquisa exaustiva', desc: 'Dezenas de abas abertas em Booking, GetYourGuide, Trainline, Google Flights e Wikipedia.' },
  { titulo: 'Roteiro confuso', desc: 'Dias mal distribuídos, ordem errada das cidades e deslocamentos que tomam tempo de mais.' },
  { titulo: 'Decisões difíceis', desc: 'Qual hotel? Qual atração entra na lista? Quanto reservar para cada cidade?' }
]

const SOLUCOES = [
  { titulo: 'Planejamento em 4 passos', desc: 'Orçamento → cidades → dias → escolhas. Stepper clicável com auto-sugestão.', icone: Compass },
  { titulo: 'Comparador inteligente', desc: '9 dimensões lado a lado (custo, cultural, noturna, gastronomia, segurança…) + recomendação ponderada pelo estilo.', icone: Sparkles },
  { titulo: 'Modo Surpresa', desc: 'Gerador automático que monta um roteiro completo a partir do seu perfil de viajante.', icone: Wand2 },
  { titulo: 'Custo realista', desc: 'Hospedagem + atrações + alimentação por cidade (custo de vida real) + transporte entre trechos.', icone: Wallet },
  { titulo: 'Tudo centralizado', desc: 'Mapa, transportes, reservas, ingressos, checklist e PDF — em um único lugar.', icone: MapIcon },
  { titulo: 'Inteligência por datas', desc: 'Detecta alta/baixa temporada e pré-preenche checkin/checkout/data nos links de reserva.', icone: GraduationCap }
]

const FUNCIONALIDADES = [
  { icone: Plane, titulo: 'Planejamento de viagem', desc: 'Fluxo guiado em 4 passos. Auto-sugestão de atrações e hospedagens por estilo.' },
  { icone: BedDouble, titulo: 'Hospedagens', desc: '64 opções (hotel, hostel, apartamento) com avaliação, bairro e link real no Booking.' },
  { icone: Ticket, titulo: 'Atrações', desc: '80+ atrações em 16 cidades com preço, duração, categoria e link no GetYourGuide.' },
  { icone: Train, titulo: 'Transporte', desc: 'Avião, trem, ônibus e carro com estimativa de tempo e preço entre cada par de cidades.' },
  { icone: Wallet, titulo: 'Controle de orçamento', desc: 'Painel flutuante com total/pessoa/dia, breakdown e indicador 🟢🟡🔴 vs orçamento.' },
  { icone: MapIcon, titulo: 'Mapa do roteiro', desc: 'Leaflet + OpenStreetMap com markers numerados, polyline tracejada e popup informativo.' },
  { icone: ListChecks, titulo: 'Checklist adaptativo', desc: 'Preparativos personalizados pelo roteiro (documentos, reservas, moeda local) com progresso persistente.' },
  { icone: Wand2, titulo: 'Sugestões inteligentes', desc: 'Modo Surpresa, sugestões de economia, ordem do dia por período e comparador de cidades.' }
]

const TECH = [
  { nome: 'React 18', tipo: 'Framework' },
  { nome: 'Vite 5', tipo: 'Build tool' },
  { nome: 'Tailwind CSS 3', tipo: 'Estilização' },
  { nome: 'React Router 6', tipo: 'Roteamento' },
  { nome: 'Framer Motion', tipo: 'Animações' },
  { nome: 'Leaflet + OSM', tipo: 'Mapa interativo' },
  { nome: 'lucide-react', tipo: 'Ícones' },
  { nome: 'jsPDF + html2canvas', tipo: 'Exportação PDF' },
  { nome: 'localStorage', tipo: 'Persistência' },
  { nome: 'Wikipedia REST', tipo: 'Textos auxiliares' }
]

const IMAGENS_MOSAICO = [
  '/images/cities/paris.jpg',
  '/images/cities/roma.jpg',
  '/images/cities/lisboa.jpg',
  '/images/cities/barcelona.jpg'
]

export default function PaginaSobre() {
  return (
    <div className="bg-cream-100 dark:bg-ink-950 pt-16 sm:pt-20">
      <HeroSobre />
      <SecaoProblema />
      <SecaoSolucao />
      <SecaoFuncionalidades />
      <SecaoTecnologias />
      <CTAFinal />
    </div>
  )
}

function HeroSobre() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 dark:from-ink-900 dark:via-ink-950 dark:to-ink-950 text-white">
      <div className="absolute -top-24 -right-24 w-[480px] h-[480px] bg-accent-500/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-primary-500/30 rounded-full blur-3xl" />

      <div className="container-app py-16 sm:py-24 relative grid lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-accent-400" />
            Sobre o TripWF
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6 text-balance">
            Planeje sua viagem pela
            <span className="block text-accent-400">Europa de forma inteligente</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mb-8 leading-relaxed">
            O <strong className="text-white">TripWF</strong> foi criado para simplificar o planejamento
            de viagens internacionais, tornando o processo mais organizado, econômico e personalizado —
            sem precisar abrir trinta abas no navegador.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/planejador"
              className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-7 py-3.5 text-base font-semibold shadow-hover"
            >
              Começar a planejar <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#problema"
              className="btn-base bg-white/10 backdrop-blur hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 text-base font-semibold"
            >
              Conhecer o projeto
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
            <Stat numero="16" label="Cidades europeias" />
            <Stat numero="80+" label="Atrações catalogadas" />
            <Stat numero="0" label="Backend necessário" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-3 relative">
            {IMAGENS_MOSAICO.map((src, i) => (
              <div
                key={src}
                className={`relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-2xl ${
                  i % 2 === 0 ? 'translate-y-4' : '-translate-y-4'
                }`}
              >
                <Imagem src={src} alt="" className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />
              </div>
            ))}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 text-primary-900 dark:text-ink-100 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] uppercase tracking-wider font-bold text-primary-500 dark:text-ink-300">TCC 2026</div>
                <div className="font-display font-extrabold text-sm">Trabalho de Conclusão</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ numero, label }) {
  return (
    <div>
      <div className="font-display font-extrabold text-3xl sm:text-4xl text-accent-400 leading-none">{numero}</div>
      <div className="text-xs sm:text-sm text-white/75 font-semibold mt-1">{label}</div>
    </div>
  )
}

function SecaoProblema() {
  return (
    <section id="problema" className="py-16 sm:py-24 bg-cream-100 dark:bg-ink-950">
      <div className="container-app">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            O problema
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-4 text-balance">
            Planejar uma viagem pela Europa é mais difícil do que deveria
          </h2>
          <p className="text-lg text-primary-700/75 dark:text-ink-200 leading-relaxed">
            Quem nunca foi conhece o caos: planilhas no Excel, dezenas de abas abertas, decisões
            difíceis sem informação centralizada e medo de estourar o orçamento na chegada.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {PROBLEMAS.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-2xl p-5 shadow-soft dark:shadow-none border-t-4 border-red-400 dark:border-red-500/60"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 flex items-center justify-center mb-3 font-display font-extrabold">
                {i + 1}
              </div>
              <h3 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-1.5">{p.titulo}</h3>
              <p className="text-sm text-primary-700/75 dark:text-ink-200 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SecaoSolucao() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-ink-900">
      <div className="container-app">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            A solução
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-4 text-balance">
            Um planejador que pensa com você
          </h2>
          <p className="text-lg text-primary-700/75 dark:text-ink-200 leading-relaxed">
            O TripWF combina dados reais de 16 destinos com heurísticas inteligentes para entregar
            um roteiro completo em minutos — não em semanas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {SOLUCOES.map((s, i) => {
            const Icone = s.icone
            return (
              <motion.div
                key={s.titulo}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group bg-gradient-to-br from-cream-100 to-white dark:from-ink-800 dark:to-ink-900 rounded-2xl p-6 border border-cream-200 dark:border-ink-700 shadow-soft dark:shadow-none hover:shadow-hover hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
                  <Icone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-extrabold text-primary-900 dark:text-ink-50 text-lg mb-1.5 leading-tight">
                  {s.titulo}
                </h3>
                <p className="text-sm text-primary-700/75 dark:text-ink-200 leading-relaxed">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SecaoFuncionalidades() {
  return (
    <section className="py-16 sm:py-24 bg-cream-100 dark:bg-ink-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent-500/8 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-app relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/15 text-accent-700 dark:text-accent-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Funcionalidades
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-4 text-balance">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-lg text-primary-700/75 dark:text-ink-200 leading-relaxed">
            Cada funcionalidade foi pensada para resolver uma dor real de quem planeja a primeira
            viagem para a Europa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {FUNCIONALIDADES.map((f, i) => {
            const Icone = f.icone
            return (
              <motion.article
                key={f.titulo}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="bg-white dark:bg-ink-900 rounded-2xl p-5 shadow-soft dark:shadow-none hover:shadow-hover hover:-translate-y-1 transition-all border border-cream-200 dark:border-ink-700 h-full flex flex-col"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 text-white flex items-center justify-center mb-3 shadow-md">
                  <Icone className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-primary-900 dark:text-ink-50 text-base mb-1.5 leading-tight">
                  {f.titulo}
                </h3>
                <p className="text-sm text-primary-700/75 dark:text-ink-200 leading-relaxed flex-1">{f.desc}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SecaoTecnologias() {
  return (
    <section className="py-16 sm:py-24 bg-primary-900 dark:bg-ink-950 dark:ring-1 dark:ring-ink-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />

      <div className="container-app relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-accent-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Tecnologias
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-4 text-balance">
            Construído sobre uma stack moderna e leve
          </h2>
          <p className="text-lg text-white/75 leading-relaxed">
            100% client-side, sem backend, sem login, sem cadastro. Tudo roda no seu navegador —
            o roteiro fica salvo localmente e pode ser exportado em PDF ou compartilhado por link.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {TECH.map((t, i) => (
            <motion.div
              key={t.nome}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-accent-500/40 transition-all"
            >
              <div className="text-[10px] uppercase tracking-wider text-accent-300 font-bold mb-1">
                {t.tipo}
              </div>
              <div className="font-display font-bold text-white text-sm leading-tight">
                {t.nome}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8 relative">
          <Quote className="absolute top-4 left-4 w-8 h-8 text-accent-500/40" />
          <div className="pl-8">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed italic mb-4">
              O TripWF nasceu da experiência real de planejar uma viagem pela Europa e perceber que
              nenhuma ferramenta existente reunia, em um só lugar, custo, mapa, transporte, atrações
              e hospedagens com a inteligência que o problema pede.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center font-display font-extrabold text-white">
                L
              </div>
              <div>
                <div className="font-display font-bold text-sm">Leonardo Moraes</div>
                <div className="text-xs text-white/60">Trabalho de Conclusão de Curso · 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTAFinal() {
  return (
    <section className="py-16 sm:py-24 bg-cream-100 dark:bg-ink-950">
      <div className="container-app">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-accent-500 to-accent-700 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="relative text-white">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-white" />
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-3 text-balance">
              Pronto para montar sua viagem?
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
              Em 4 passos você sai com um roteiro completo, mapa interativo, custos detalhados
              e links de reserva já preparados.
            </p>
            <Link
              to="/planejador"
              className="btn-base bg-white hover:bg-cream-100 text-accent-600 px-8 py-4 text-base font-bold shadow-2xl inline-flex"
            >
              Começar agora <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
