import { useState, useEffect, useMemo } from 'react'
import {
  Check, ChevronDown, ChevronUp, Camera, BedDouble,
  Sparkles, Sunrise, Sun, Sunset, Moon, Clock
} from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import { buscarCidade } from '../../data/cidades.js'
import Imagem from '../ui/Imagem.jsx'
import Avaliacao from '../ui/Avaliacao.jsx'
import { formatarEUR, formatarPreco, formatarBRL } from '../../utils/formatadores.js'
import { sugerirOrdemDia } from '../../utils/sugestoes.js'

const ICONES_PERIODO = {
  'Manhã': Sunrise,
  'Tarde': Sun,
  'Fim de tarde': Sunset,
  'Noite': Moon
}

export default function PassoEscolhas() {
  const { cidadesSelecionadas, aplicarSugestao } = useViagem()
  const [aberta, setAberta] = useState(cidadesSelecionadas[0]?.slug)
  // Set de slugs que receberam sugestão automática nesta sessão.
  // Usa update funcional para não recriar a cada render do useEffect.
  const [autoSugeridas, setAutoSugeridas] = useState(() => new Set())

  // Auto-fill ao entrar no passo: cidades sem nenhuma escolha (atrações vazias
  // E sem hospedagem) recebem sugestão. Não sobrescreve quem já personalizou.
  useEffect(() => {
    setAutoSugeridas((prev) => {
      let mudou = false
      const next = new Set(prev)
      cidadesSelecionadas.forEach((cs) => {
        if (next.has(cs.slug)) return
        const semEscolhas =
          cs.atracoesEscolhidas.length === 0 && !cs.hospedagemEscolhida
        if (semEscolhas) {
          aplicarSugestao(cs.slug)
          next.add(cs.slug)
          mudou = true
        }
      })
      return mudou ? next : prev
    })
  }, [cidadesSelecionadas, aplicarSugestao])

  if (cidadesSelecionadas.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-primary-700/70 dark:text-ink-200">Volte e selecione cidades primeiro.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-3 text-balance">
          Personalize cada destino
        </h2>
        <p className="text-primary-700/75 dark:text-ink-200 text-lg">
          Escolha as atrações e a hospedagem para cada cidade da sua viagem.
        </p>
      </div>

      <div className="space-y-3">
        {cidadesSelecionadas.map((cs) => {
          const cidade = buscarCidade(cs.slug)
          if (!cidade) return null
          const expandida = aberta === cs.slug
          return (
            <CidadeAccordion
              key={cs.slug}
              cidade={cidade}
              cs={cs}
              expandida={expandida}
              autoSugerida={autoSugeridas.has(cs.slug)}
              onToggle={() => setAberta(expandida ? null : cs.slug)}
            />
          )
        })}
      </div>
    </div>
  )
}

function CidadeAccordion({ cidade, cs, expandida, onToggle, autoSugerida }) {
  const { toggleAtracao, setHospedagem } = useViagem()
  const hospedagemEscolhida = cidade.hospedagens.find((h) => h.id === cs.hospedagemEscolhida)

  // Ordem sugerida do dia — recalcula sozinha quando o usuário marca/desmarca
  // atrações. Heurística pura em utils/sugestoes.js.
  const atracoesEscolhidasObj = useMemo(
    () => cidade.atracoes.filter((a) => cs.atracoesEscolhidas.includes(a.id)),
    [cidade.atracoes, cs.atracoesEscolhidas]
  )
  const ordemDia = useMemo(
    () => sugerirOrdemDia(atracoesEscolhidasObj),
    [atracoesEscolhidasObj]
  )

  return (
    <div className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-2xl shadow-soft dark:shadow-none overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-cream-100 dark:hover:bg-ink-800 transition text-left"
      >
        <Imagem
          src={cidade.imagem}
          alt={cidade.nome}
          className="w-16 h-16 rounded-xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-primary-500 dark:text-ink-300 flex items-center gap-1">
            <span>{cidade.bandeira}</span> {cidade.pais} · {cs.dias} dias
          </div>
          <h3 className="font-display font-bold text-lg text-primary-900 dark:text-ink-50 inline-flex items-center gap-1.5">
            {cidade.nome}
            {autoSugerida && (
              <Sparkles
                className="w-3.5 h-3.5 text-accent-500"
                title="Sugestão automática aplicada"
              />
            )}
          </h3>
          <div className="text-xs text-primary-500 dark:text-ink-300 mt-0.5">
            {cs.atracoesEscolhidas.length} atrações · {hospedagemEscolhida ? hospedagemEscolhida.nome : 'Sem hospedagem'}
          </div>
        </div>
        <div className="text-primary-500 dark:text-ink-300">
          {expandida ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expandida && (
        <div className="border-t border-cream-200 dark:border-ink-700 p-5 space-y-6">
          {autoSugerida && (
            <div className="flex items-start gap-2 bg-accent-500/10 border border-accent-500/20 rounded-xl px-3 py-2 text-xs text-accent-700 dark:text-accent-300">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Sugestão automática</strong> baseada no seu perfil de viagem.
                <span className="text-primary-700/80 dark:text-ink-200"> Ajuste o que quiser — é só um ponto de partida.</span>
              </div>
            </div>
          )}
          <div>
            <h4 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-accent-500" />
              Atrações
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {cidade.atracoes.map((a) => {
                const ativa = cs.atracoesEscolhidas.includes(a.id)
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAtracao(cs.slug, a.id)}
                    className={clsx(
                      'flex items-center gap-3 p-2 rounded-xl border-2 transition text-left',
                      ativa
                        ? 'border-accent-500 bg-accent-500/5 dark:bg-accent-500/10'
                        : 'border-cream-200 hover:border-primary-300 dark:border-ink-700 dark:hover:border-ink-500'
                    )}
                  >
                    <Imagem
                      src={a.imagem}
                      alt={a.nome}
                      className="w-14 h-14 rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-primary-900 dark:text-ink-50 truncate">{a.nome}</div>
                      <div className="text-xs text-accent-600 dark:text-accent-300 font-bold">
                        {formatarPreco(a.preco)}
                        {a.preco > 0 && (
                          <span className="text-primary-500 dark:text-ink-300 font-medium ml-1">· {formatarBRL(a.preco)}</span>
                        )}
                      </div>
                    </div>
                    <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', ativa ? 'bg-accent-500' : 'bg-cream-200 dark:bg-ink-700')}>
                      {ativa && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {ordemDia.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500 dark:text-ink-300" />
                Ordem sugerida para o dia
              </h4>
              <p className="text-xs text-primary-700/70 dark:text-ink-200 mb-3">
                Distribuímos as atrações pelos períodos do dia pra reduzir deslocamentos.
                Reorganiza sozinho quando você marca ou desmarca uma atração.
              </p>
              <ol className="space-y-2">
                {ordemDia.map((a, i) => {
                  const Icone = ICONES_PERIODO[a.periodo] || Clock
                  return (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 border border-cream-200 dark:bg-ink-800 dark:border-ink-700"
                    >
                      <div className="w-7 h-7 rounded-full bg-accent-500 text-white font-display font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-primary-900 dark:text-ink-50 truncate">
                          {a.nome}
                        </div>
                        <div className="text-xs text-primary-500 dark:text-ink-300">
                          {a.categoria} · {a.duracao}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-ink-100 flex-shrink-0 bg-white border border-cream-200 dark:bg-ink-900 dark:border-ink-600 rounded-full px-2.5 py-1">
                        <Icone className="w-3.5 h-3.5 text-accent-500" />
                        {a.periodo}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}

          <div>
            <h4 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-3 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary-500 dark:text-ink-300" />
              Hospedagem
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {cidade.hospedagens.map((h) => {
                const ativa = cs.hospedagemEscolhida === h.id
                return (
                  <button
                    key={h.id}
                    onClick={() => setHospedagem(cs.slug, ativa ? null : h.id)}
                    className={clsx(
                      'flex items-center gap-3 p-2 rounded-xl border-2 transition text-left',
                      ativa
                        ? 'border-primary-500 bg-primary-500/5 dark:border-accent-500 dark:bg-accent-500/10'
                        : 'border-cream-200 hover:border-primary-300 dark:border-ink-700 dark:hover:border-ink-500'
                    )}
                  >
                    <Imagem
                      src={h.imagem}
                      alt={h.nome}
                      className="w-14 h-14 rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-primary-900 dark:text-ink-50 truncate">{h.nome}</div>
                      <div className="text-xs text-primary-500 dark:text-ink-300 flex items-center gap-2">
                        <span>{h.tipo}</span>
                        <Avaliacao valor={h.avaliacao} tamanho={10} />
                      </div>
                      <div className="text-xs text-accent-600 dark:text-accent-300 font-bold">
                        {formatarEUR(h.precoNoite)}/noite
                        <span className="text-primary-500 dark:text-ink-300 font-medium ml-1">· {formatarBRL(h.precoNoite)}</span>
                      </div>
                    </div>
                    <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', ativa ? 'bg-primary-500 dark:bg-accent-500' : 'bg-cream-200 dark:bg-ink-700')}>
                      {ativa && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
