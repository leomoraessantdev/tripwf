import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { cidades, buscarCidade } from '../data/cidades.js'
import { computarDatasCidades } from '../utils/datas.js'
import { sugerirEscolhas } from '../utils/sugestoes.js'
import { carimbarSalvamento } from '../utils/saveTracker.js'
import { ESTADO_INICIAL, normalizarEstado } from '../utils/estadoViagem.js'

const ViagemContext = createContext(null)

// Constante para estimar transporte entre cidades. Alimentação é por cidade
// (cidade.custoAlimentacaoDia em src/data/cidades.js) e reflete diferenças
// reais de custo de vida — Istambul barata, Copenhague cara.
export const CUSTO_TRANSPORTE_TRECHO = 80 // EUR por trecho (trem regional médio)

export function ViagemProvider({ children }) {
  // normalizarEstado migra estado salvo por versões antigas do app
  // (campos ausentes, tipos errados) para o schema atual na carga.
  const [estado, setEstado] = useLocalStorage('viagem-europa', ESTADO_INICIAL, normalizarEstado)

  // Persistência real é automática via useLocalStorage. Aqui só carimbamos
  // o timestamp da última edição (silencioso, sem toast) — usado pelo
  // ModalRetomar para mostrar "Última edição há X minutos".
  // O toast "Roteiro salvo automaticamente ✓" é disparado em ações
  // explícitas: clicar "Próximo" no planejador ou botão Salvar no roteiro.
  const primeiraExecucaoRef = useRef(true)
  const debounceRef = useRef(null)
  useEffect(() => {
    if (primeiraExecucaoRef.current) {
      primeiraExecucaoRef.current = false
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => carimbarSalvamento(), 700)
    return () => clearTimeout(debounceRef.current)
  }, [
    estado.cidadesSelecionadas,
    estado.orcamentoDiario,
    estado.viajantes,
    estado.dataIda,
    estado.dataVolta,
    estado.estilo,
    estado.origem
  ])

  const setOrcamento = useCallback((valor) => {
    setEstado((s) => ({ ...s, orcamentoDiario: valor }))
  }, [setEstado])

  const setViajantes = useCallback((valor) => {
    setEstado((s) => ({ ...s, viajantes: Math.max(1, Math.min(10, valor)) }))
  }, [setEstado])

  const setOrigem = useCallback((valor) => {
    setEstado((s) => ({ ...s, origem: String(valor || '').slice(0, 80) }))
  }, [setEstado])

  const setDataIda = useCallback((valor) => {
    setEstado((s) => ({ ...s, dataIda: valor || '' }))
  }, [setEstado])

  const setDataVolta = useCallback((valor) => {
    setEstado((s) => ({ ...s, dataVolta: valor || '' }))
  }, [setEstado])

  const setEstilo = useCallback((valor) => {
    const validos = ['economico', 'conforto', 'luxo']
    setEstado((s) => ({ ...s, estilo: validos.includes(valor) ? valor : 'conforto' }))
  }, [setEstado])

  const toggleCidade = useCallback((slug) => {
    setEstado((s) => {
      const existe = s.cidadesSelecionadas.find((c) => c.slug === slug)
      if (existe) {
        return {
          ...s,
          cidadesSelecionadas: s.cidadesSelecionadas.filter((c) => c.slug !== slug)
        }
      }
      return {
        ...s,
        cidadesSelecionadas: [
          ...s.cidadesSelecionadas,
          { slug, dias: 3, atracoesEscolhidas: [], hospedagemEscolhida: null }
        ]
      }
    })
  }, [setEstado])

  const setDias = useCallback((slug, dias) => {
    setEstado((s) => ({
      ...s,
      cidadesSelecionadas: s.cidadesSelecionadas.map((c) =>
        c.slug === slug ? { ...c, dias: Math.max(1, Math.min(30, dias)) } : c
      )
    }))
  }, [setEstado])

  const toggleAtracao = useCallback((slug, atracaoId) => {
    setEstado((s) => ({
      ...s,
      cidadesSelecionadas: s.cidadesSelecionadas.map((c) => {
        if (c.slug !== slug) return c
        const tem = c.atracoesEscolhidas.includes(atracaoId)
        return {
          ...c,
          atracoesEscolhidas: tem
            ? c.atracoesEscolhidas.filter((id) => id !== atracaoId)
            : [...c.atracoesEscolhidas, atracaoId]
        }
      })
    }))
  }, [setEstado])

  const setHospedagem = useCallback((slug, hospedagemId) => {
    setEstado((s) => ({
      ...s,
      cidadesSelecionadas: s.cidadesSelecionadas.map((c) =>
        c.slug === slug ? { ...c, hospedagemEscolhida: hospedagemId } : c
      )
    }))
  }, [setEstado])

  const reordenarCidades = useCallback((novaOrdem) => {
    setEstado((s) => ({ ...s, cidadesSelecionadas: novaOrdem }))
  }, [setEstado])

  const toggleChecklistItem = useCallback((id) => {
    if (!id) return
    setEstado((s) => {
      const atuais = Array.isArray(s.checklistConcluidos) ? s.checklistConcluidos : []
      const marcado = atuais.includes(id)
      return {
        ...s,
        checklistConcluidos: marcado
          ? atuais.filter((x) => x !== id)
          : [...atuais, id]
      }
    })
  }, [setEstado])

  const resetarChecklist = useCallback(() => {
    setEstado((s) => ({ ...s, checklistConcluidos: [] }))
  }, [setEstado])

  const limparViagem = useCallback(() => {
    setEstado(ESTADO_INICIAL)
  }, [setEstado])

  // Aplica heurística de sugestão automática para uma cidade.
  // Usa estilo + orcamentoDiario + dias da cidade. Não sobrescreve outras cidades.
  // Retorna true se aplicou, false se cidade não existe.
  const aplicarSugestao = useCallback((slug) => {
    const cidade = buscarCidade(slug)
    if (!cidade) return false
    setEstado((s) => {
      const cs = s.cidadesSelecionadas.find((c) => c.slug === slug)
      if (!cs) return s
      const { atracoesIds, hospedagemId } = sugerirEscolhas(
        cidade, cs.dias, s.estilo, s.orcamentoDiario
      )
      return {
        ...s,
        cidadesSelecionadas: s.cidadesSelecionadas.map((c) =>
          c.slug === slug
            ? { ...c, atracoesEscolhidas: atracoesIds, hospedagemEscolhida: hospedagemId }
            : c
        )
      }
    })
    return true
  }, [setEstado])

  // Modo Surpresa: substitui a lista de cidades pelo plano gerado e
  // zera o checklist (é uma viagem nova, marcações antigas não fazem sentido).
  // Preserva orçamento/datas/viajantes/estilo — o plano JÁ usou esses valores
  // como input, não há razão pra mexer neles.
  const aplicarRoteiroSurpresa = useCallback((cidadesSelecionadas) => {
    if (!Array.isArray(cidadesSelecionadas) || cidadesSelecionadas.length === 0) return
    setEstado((s) => ({
      ...s,
      cidadesSelecionadas,
      checklistConcluidos: []
    }))
  }, [setEstado])

  const aplicarRoteiroCompartilhado = useCallback((novoEstado) => {
    if (!novoEstado) return
    setEstado((s) => ({
      ...s,
      orcamentoDiario: novoEstado.orcamentoDiario ?? s.orcamentoDiario,
      viajantes: novoEstado.viajantes ?? s.viajantes,
      origem: novoEstado.origem ?? s.origem,
      dataIda: novoEstado.dataIda ?? s.dataIda,
      dataVolta: novoEstado.dataVolta ?? s.dataVolta,
      estilo: novoEstado.estilo ?? s.estilo,
      cidadesSelecionadas: novoEstado.cidadesSelecionadas ?? s.cidadesSelecionadas,
      // Roteiro vindo de link compartilhado começa com checklist zerado:
      // a marcação é pessoal de quem planejou, não viaja na URL.
      checklistConcluidos: []
    }))
  }, [setEstado])

  // Carrega um roteiro salvo do próprio usuário. Diferente do link
  // compartilhado, preserva o checklistConcluidos salvo no snapshot.
  const carregarRoteiroSalvo = useCallback((novoEstado) => {
    if (!novoEstado) return
    setEstado((s) => ({
      ...s,
      orcamentoDiario: novoEstado.orcamentoDiario ?? s.orcamentoDiario,
      viajantes: novoEstado.viajantes ?? s.viajantes,
      origem: novoEstado.origem ?? s.origem,
      dataIda: novoEstado.dataIda ?? s.dataIda,
      dataVolta: novoEstado.dataVolta ?? s.dataVolta,
      estilo: novoEstado.estilo ?? s.estilo,
      cidadesSelecionadas: novoEstado.cidadesSelecionadas ?? s.cidadesSelecionadas,
      checklistConcluidos: Array.isArray(novoEstado.checklistConcluidos)
        ? novoEstado.checklistConcluidos
        : []
    }))
  }, [setEstado])

  const cidadeEstaSelecionada = useCallback(
    (slug) => estado.cidadesSelecionadas.some((c) => c.slug === slug),
    [estado.cidadesSelecionadas]
  )

  // Data de volta efetiva: override do usuário OU auto-calculada
  const dataVoltaEfetiva = useMemo(() => {
    if (estado.dataVolta) return estado.dataVolta
    const { dataVolta } = computarDatasCidades(estado.dataIda, estado.cidadesSelecionadas)
    if (!dataVolta) return ''
    // dataVolta é Date — converte pra YYYY-MM-DD local (sem fuso UTC)
    const a = dataVolta.getFullYear()
    const m = String(dataVolta.getMonth() + 1).padStart(2, '0')
    const d = String(dataVolta.getDate()).padStart(2, '0')
    return `${a}-${m}-${d}`
  }, [estado.dataVolta, estado.dataIda, estado.cidadesSelecionadas])

  const dadosViagem = useMemo(() => {
    const { cidadesComDatas } = computarDatasCidades(
      estado.dataIda,
      estado.cidadesSelecionadas
    )
    const viajantes = Math.max(1, estado.viajantes || 1)
    return cidadesComDatas.map((cs) => {
      const cidade = buscarCidade(cs.slug)
      if (!cidade) return null
      const hospedagem = cidade.hospedagens.find((h) => h.id === cs.hospedagemEscolhida)
      const atracoes = cidade.atracoes.filter((a) => cs.atracoesEscolhidas.includes(a.id))
      const custoAtracoes = atracoes.reduce((acc, a) => acc + a.preco, 0)
      const custoHospedagem = hospedagem ? hospedagem.precoNoite * cs.dias : 0
      // Alimentação por cidade — entra no total da cidade. Soma das cidades = food do trip
      const custoAlimentacao = (cidade.custoAlimentacaoDia || 40) * cs.dias * viajantes
      // Total da cidade = SOMA dos 3 tiles exibidos (hospedagem + atrações + alimentação).
      // Transporte é inter-cidade, fica no total geral, não aqui.
      const custoTotal = custoAtracoes + custoHospedagem + custoAlimentacao
      return {
        ...cs,
        cidade,
        hospedagem,
        atracoes,
        custoAtracoes,
        custoHospedagem,
        custoAlimentacao,
        custoTotal
      }
    }).filter(Boolean)
  }, [estado.cidadesSelecionadas, estado.dataIda, estado.viajantes])

  const totais = useMemo(() => {
    const viajantes = Math.max(1, estado.viajantes || 1)
    const totalDias = dadosViagem.reduce((acc, d) => acc + d.dias, 0)
    // 4 categorias explícitas — soma direta dos valores que JÁ existem em dadosViagem
    // (mesmas variáveis exibidas nos cards de cada cidade). Sem recálculo, sem
    // possibilidade de duplicação.
    const accommodation = dadosViagem.reduce((acc, d) => acc + d.custoHospedagem, 0)
    const attractions = dadosViagem.reduce((acc, d) => acc + d.custoAtracoes, 0)
    const food = dadosViagem.reduce((acc, d) => acc + d.custoAlimentacao, 0)
    const transport = Math.max(0, dadosViagem.length - 1) * CUSTO_TRANSPORTE_TRECHO
    const custoTotal = accommodation + attractions + food + transport
    const custoMedioPorDia = totalDias > 0 ? custoTotal / totalDias : 0
    const orcamentoTotal = estado.orcamentoDiario * totalDias * viajantes
    const dentroDoOrcamento = custoTotal <= orcamentoTotal
    return {
      totalDias,
      accommodation,
      attractions,
      food,
      transport,
      custoTotal,
      custoMedioPorDia,
      perPerson: custoTotal / viajantes,
      orcamentoTotal,
      dentroDoOrcamento,
      diferenca: orcamentoTotal - custoTotal
    }
  }, [dadosViagem, estado.orcamentoDiario, estado.viajantes])

  const valor = {
    orcamentoDiario: estado.orcamentoDiario,
    viajantes: estado.viajantes || 1,
    origem: estado.origem || '',
    dataIda: estado.dataIda || '',
    dataVolta: estado.dataVolta || '',
    dataVoltaEfetiva,
    estilo: estado.estilo || 'conforto',
    cidadesSelecionadas: estado.cidadesSelecionadas,
    checklistConcluidos: estado.checklistConcluidos || [],
    dadosViagem,
    totais,
    todasCidades: cidades,
    setOrcamento,
    setViajantes,
    setOrigem,
    setDataIda,
    setDataVolta,
    setEstilo,
    toggleCidade,
    setDias,
    toggleAtracao,
    setHospedagem,
    reordenarCidades,
    limparViagem,
    aplicarSugestao,
    aplicarRoteiroSurpresa,
    aplicarRoteiroCompartilhado,
    carregarRoteiroSalvo,
    cidadeEstaSelecionada,
    toggleChecklistItem,
    resetarChecklist
  }

  return <ViagemContext.Provider value={valor}>{children}</ViagemContext.Provider>
}

export function useViagem() {
  const ctx = useContext(ViagemContext)
  if (!ctx) throw new Error('useViagem precisa estar dentro de um ViagemProvider')
  return ctx
}
