import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, BedDouble, ArrowRight } from 'lucide-react'
import { buscarCidade } from '../data/cidades.js'
import { useViagem } from '../context/ViagemContext.jsx'
import CidadeHero from '../components/cidade/CidadeHero.jsx'
import AtracaoCard from '../components/cidade/AtracaoCard.jsx'
import HospedagemCard from '../components/cidade/HospedagemCard.jsx'
import MelhorEpoca from '../components/cidade/MelhorEpoca.jsx'
import FiltroChips from '../components/ui/FiltroChips.jsx'
import { useFavoritos } from '../hooks/useFavoritos.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'
import { useEffect, useMemo, useState } from 'react'

const ORDENACOES_HOSPEDAGEM = {
  Relevância: null,
  'Menor preço': (a, b) => a.precoNoite - b.precoNoite,
  'Maior avaliação': (a, b) => b.avaliacao - a.avaliacao
}

export default function PaginaCidade() {
  const { slug } = useParams()
  const cidade = buscarCidade(slug)
  const { toggleCidade, cidadeEstaSelecionada } = useViagem()
  const { ehFavorito } = useFavoritos()

  useTituloPagina(
    cidade ? `${cidade.nome}, ${cidade.pais}` : null,
    cidade ? `${cidade.nome}: ${cidade.atracoes.length} atrações e ${cidade.hospedagens.length} hospedagens com preços reais para o seu roteiro.` : null
  )

  const [categoriaAtracao, setCategoriaAtracao] = useState('Todas')
  const [tipoHospedagem, setTipoHospedagem] = useState('Todos')
  const [ordemHospedagem, setOrdemHospedagem] = useState('Relevância')

  useEffect(() => {
    window.scrollTo(0, 0)
    setCategoriaAtracao('Todas')
    setTipoHospedagem('Todos')
    setOrdemHospedagem('Relevância')
  }, [slug])

  const temAtracaoFavorita = cidade?.atracoes.some((a) => ehFavorito('atracoes', a.id))
  const temHospedagemFavorita = cidade?.hospedagens.some((h) => ehFavorito('hospedagens', h.id))

  const categoriasAtracao = useMemo(() => {
    if (!cidade) return []
    const base = ['Todas', ...new Set(cidade.atracoes.map((a) => a.categoria))]
    if (temAtracaoFavorita) base.push('♥ Favoritas')
    return base
  }, [cidade, temAtracaoFavorita])

  const tiposHospedagem = useMemo(() => {
    if (!cidade) return []
    const base = ['Todos', ...new Set(cidade.hospedagens.map((h) => h.tipo))]
    if (temHospedagemFavorita) base.push('♥ Favoritas')
    return base
  }, [cidade, temHospedagemFavorita])

  const atracoesVisiveis = useMemo(() => {
    if (!cidade) return []
    if (categoriaAtracao === 'Todas') return cidade.atracoes
    if (categoriaAtracao === '♥ Favoritas') {
      return cidade.atracoes.filter((a) => ehFavorito('atracoes', a.id))
    }
    return cidade.atracoes.filter((a) => a.categoria === categoriaAtracao)
  }, [cidade, categoriaAtracao, ehFavorito])

  const hospedagensVisiveis = useMemo(() => {
    if (!cidade) return []
    let lista
    if (tipoHospedagem === 'Todos') lista = [...cidade.hospedagens]
    else if (tipoHospedagem === '♥ Favoritas') {
      lista = cidade.hospedagens.filter((h) => ehFavorito('hospedagens', h.id))
    } else lista = cidade.hospedagens.filter((h) => h.tipo === tipoHospedagem)
    const comparador = ORDENACOES_HOSPEDAGEM[ordemHospedagem]
    if (comparador) lista.sort(comparador)
    return lista
  }, [cidade, tipoHospedagem, ordemHospedagem, ehFavorito])

  if (!cidade) return <Navigate to="/404" replace />

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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center">
            <Camera className="w-6 h-6 text-accent-500" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-3xl text-primary-900 dark:text-ink-50">
              Atrações em destaque
            </h2>
            <p className="text-primary-700/70 dark:text-ink-200">
              {atracoesVisiveis.length === cidade.atracoes.length
                ? `${cidade.atracoes.length} experiências imperdíveis`
                : `${atracoesVisiveis.length} de ${cidade.atracoes.length} experiências`}
            </p>
          </div>
        </div>
        {categoriasAtracao.length > 2 && (
          <div className="mb-8">
            <FiltroChips
              rotulo="Filtrar atrações por categoria"
              opcoes={categoriasAtracao}
              valor={categoriaAtracao}
              aoMudar={setCategoriaAtracao}
            />
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {atracoesVisiveis.map((a, i) => (
            <motion.div
              key={a.id}
              layout
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 dark:bg-accent-500/10 flex items-center justify-center">
              <BedDouble className="w-6 h-6 text-primary-500 dark:text-accent-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-3xl text-primary-900 dark:text-ink-50">
                Onde se hospedar
              </h2>
              <p className="text-primary-700/70 dark:text-ink-200">
                {hospedagensVisiveis.length === cidade.hospedagens.length
                  ? `${cidade.hospedagens.length} opções para todos os bolsos`
                  : `${hospedagensVisiveis.length} de ${cidade.hospedagens.length} opções`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {tiposHospedagem.length > 2 && (
              <FiltroChips
                rotulo="Filtrar hospedagens por tipo"
                opcoes={tiposHospedagem}
                valor={tipoHospedagem}
                aoMudar={setTipoHospedagem}
              />
            )}
            <label className="flex items-center gap-2 text-sm text-primary-700 dark:text-ink-200 font-semibold">
              Ordenar por
              <select
                value={ordemHospedagem}
                onChange={(e) => setOrdemHospedagem(e.target.value)}
                className="input-base py-1.5 px-3 text-sm w-auto"
              >
                {Object.keys(ORDENACOES_HOSPEDAGEM).map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hospedagensVisiveis.map((h, i) => (
              <motion.div
                key={h.id}
                layout
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
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
