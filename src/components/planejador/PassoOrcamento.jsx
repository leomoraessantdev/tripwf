import { useState } from 'react'
import {
  Wallet, TrendingUp, Sparkles, Users, Minus, Plus,
  MapPin, Calendar, Leaf, Star, Gem, Wand2
} from 'lucide-react'
import Slider from '../ui/Slider.jsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { formatarBRL, formatarEUR } from '../../utils/formatadores.js'
import ModalSurpresa from './ModalSurpresa.jsx'

const sugestoes = [
  { valor: 60, titulo: 'Econômico', desc: 'Hostels, street food e transporte público', estilo: 'economico' },
  { valor: 120, titulo: 'Confortável', desc: 'Hotéis 3★, restaurantes e atrações pagas', estilo: 'conforto' },
  { valor: 250, titulo: 'Luxo', desc: 'Hotéis 5★, jantares estrelados e tours privativos', estilo: 'luxo' }
]

const estilos = [
  { id: 'economico', nome: 'Econômico', icone: Leaf, valorSugerido: 60 },
  { id: 'conforto', nome: 'Conforto', icone: Star, valorSugerido: 120 },
  { id: 'luxo', nome: 'Luxo', icone: Gem, valorSugerido: 250 }
]

// Data de hoje + 30 dias como sugestão pro picker
function dataDefault() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

export default function PassoOrcamento() {
  const {
    orcamentoDiario, setOrcamento,
    viajantes, setViajantes,
    origem, setOrigem,
    dataIda, setDataIda,
    dataVolta, setDataVolta, dataVoltaEfetiva,
    estilo, setEstilo
  } = useViagem()
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 mb-4">
          <Wallet className="w-8 h-8 text-accent-500" />
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-3 text-balance">
          Como vai ser sua viagem?
        </h2>
        <p className="text-primary-700/75 dark:text-ink-200 text-lg">
          Conte pra gente o básico — orçamento, datas e estilo — pra ajustarmos as sugestões.
        </p>
      </div>

      {/* Modo Surpresa — atalho que gera roteiro completo a partir do perfil. */}
      <button
        type="button"
        onClick={() => setModalAberto(true)}
        className="group w-full mb-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-5 sm:p-6 text-left shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-accent-500/30"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-500/30 rounded-full blur-3xl group-hover:bg-accent-500/40 transition-colors" />
        <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-accent-500/15 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <Wand2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="text-[11px] font-bold uppercase tracking-wider text-accent-300 mb-0.5">
              Não sabe por onde começar?
            </div>
            <div className="font-display font-extrabold text-xl sm:text-2xl leading-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-300" />
              Surpreenda-me
            </div>
            <div className="text-sm text-white/75 mt-1">
              Gera um roteiro completo automaticamente a partir do seu orçamento, datas e estilo.
            </div>
          </div>
        </div>
      </button>

      <div className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl p-6 shadow-soft dark:shadow-none mb-5">
        <h3 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500" />
          Sobre sua viagem
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <label className="block sm:col-span-3">
            <span className="text-xs font-semibold text-primary-500 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <MapPin className="w-3 h-3" /> De onde você sai?
            </span>
            <input
              type="text"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="ex.: São Paulo, Brasil"
              className="input-base"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-primary-500 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <Calendar className="w-3 h-3" /> Data de ida
            </span>
            <input
              type="date"
              value={dataIda}
              onChange={(e) => setDataIda(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              placeholder={dataDefault()}
              className="input-base"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-primary-500 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
              <Calendar className="w-3 h-3" /> Data de volta
              {!dataVolta && dataVoltaEfetiva && (
                <span className="ml-auto normal-case tracking-normal text-[10px] text-accent-500 font-bold">
                  auto: {new Date(dataVoltaEfetiva + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              )}
            </span>
            <input
              type="date"
              value={dataVolta}
              onChange={(e) => setDataVolta(e.target.value)}
              min={dataIda || new Date().toISOString().slice(0, 10)}
              placeholder={dataVoltaEfetiva}
              className="input-base"
            />
            <span className="text-[10px] text-primary-500/70 mt-1 block">
              Em branco = calcula sozinha somando os dias por cidade
            </span>
          </label>
        </div>

        <div>
          <span className="text-xs font-semibold text-primary-500 dark:text-ink-300 uppercase tracking-wider mb-2 block">
            Estilo de viagem
          </span>
          <div className="grid grid-cols-3 gap-2">
            {estilos.map((e) => {
              const ativo = estilo === e.id
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEstilo(e.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition ${
                    ativo
                      ? 'border-accent-500 bg-accent-500/5 dark:bg-accent-500/15'
                      : 'border-cream-300 bg-white hover:border-primary-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-ink-500'
                  }`}
                >
                  <e.icone className={`w-5 h-5 ${ativo ? 'text-accent-500' : 'text-primary-500 dark:text-ink-300'}`} />
                  <span className={`text-sm font-semibold ${ativo ? 'text-accent-600 dark:text-accent-300' : 'text-primary-700 dark:text-ink-100'}`}>
                    {e.nome}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl p-8 shadow-soft dark:shadow-none mb-6">
        <div className="text-center mb-8">
          <div className="text-sm font-semibold text-primary-500 dark:text-ink-300 uppercase tracking-wider mb-2">
            Seu orçamento diário por pessoa
          </div>
          <div className="font-display font-extrabold text-6xl text-accent-500 mb-1">
            {formatarEUR(orcamentoDiario)}
          </div>
          <div className="text-primary-700/60 dark:text-ink-200">≈ {formatarBRL(orcamentoDiario)} por dia</div>
        </div>
        <Slider
          valor={orcamentoDiario}
          onChange={setOrcamento}
          min={30}
          max={500}
          step={10}
        />
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-500 dark:text-ink-300">
          <TrendingUp className="w-4 h-4" />
          Inclui hospedagem, alimentação, transporte e atrações
        </div>

        <div className="mt-8 pt-6 border-t border-cream-200 dark:border-ink-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 dark:bg-ink-800 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary-500 dark:text-accent-400" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-primary-900 dark:text-ink-50">Quantos viajantes?</div>
                <div className="text-xs text-primary-500 dark:text-ink-300">Multiplica alimentação e orçamento</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setViajantes(viajantes - 1)}
                disabled={viajantes <= 1}
                className="w-10 h-10 rounded-full bg-cream-200 hover:bg-cream-300 dark:bg-ink-800 dark:hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed text-primary-700 dark:text-ink-100 flex items-center justify-center transition"
                aria-label="Menos viajantes"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-12 text-center">
                <div className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50 leading-none">
                  {viajantes}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViajantes(viajantes + 1)}
                disabled={viajantes >= 10}
                className="w-10 h-10 rounded-full bg-accent-500 hover:bg-accent-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                aria-label="Mais viajantes"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {sugestoes.map((s) => (
          <button
            key={s.valor}
            onClick={() => {
              setOrcamento(s.valor)
              setEstilo(s.estilo)
            }}
            className={`text-left p-5 rounded-2xl border-2 transition-all ${
              orcamentoDiario === s.valor
                ? 'border-accent-500 bg-accent-500/5 dark:bg-accent-500/15 shadow-glow'
                : 'border-cream-300 bg-white hover:border-primary-300 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ink-500 hover:-translate-y-0.5'
            }`}
          >
            {orcamentoDiario === s.valor && (
              <Sparkles className="w-4 h-4 text-accent-500 float-right" />
            )}
            <div className="font-display font-bold text-primary-900 dark:text-ink-50 text-lg">{s.titulo}</div>
            <div className="text-accent-500 font-bold text-sm mb-1">{formatarEUR(s.valor)}/dia</div>
            <div className="text-xs text-primary-700/70 dark:text-ink-200">{s.desc}</div>
          </button>
        ))}
      </div>

      <ModalSurpresa aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </div>
  )
}
