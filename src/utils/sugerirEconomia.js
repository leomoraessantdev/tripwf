// =============================================================
// Sistema inteligente de sugestões de economia.
// =============================================================
//
// Compara `custoTotal` com `orcamentoTotal` e gera sugestões reais
// para economizar — sempre privilegiando as alternativas de MENOR
// impacto na experiência (hotel → transporte → troca de atração →
// remover atração premium → reduzir dia, em ordem).
//
// Sem rede. Funções puras. Roda novamente toda vez que o estado da
// viagem muda (chamada dentro de componentes React).
//
// CUSTO_TRANSPORTE_TRECHO_BASE = €80 → mesmo valor de ViagemContext.
// Hardcoded para não criar import circular; manter sincronizado.

import { haversine } from './distancia.js'
import { sugestoesTransporte } from './transportes.js'

const CUSTO_TRANSPORTE_TRECHO_BASE = 80
const PROXIMO_THRESHOLD = 0.9 // 90% do orçamento já dispara "próximo do limite"
const FOLGA_DESEJADA_ACIMA = 0.05 // 5% de folga após cobrir excedente
const FOLGA_DESEJADA_PROXIMO = 0.15 // baixar de 100% para 85%
const ECONOMIA_MIN_RELEVANTE = 15 // ignora sugestões com economia < €15

export function gerarSugestoesEconomia({ dadosViagem, totais, orcamentoTotal, dataIda }) {
  if (!dadosViagem || dadosViagem.length === 0) {
    return { estado: 'dentro', ratio: 0, deficit: 0, alvo: 0, sugestoes: [], totalEconomia: 0 }
  }
  if (!orcamentoTotal || orcamentoTotal <= 0) {
    return { estado: 'dentro', ratio: 0, deficit: 0, alvo: 0, sugestoes: [], totalEconomia: 0 }
  }

  const custoTotal = totais.custoTotal
  const ratio = custoTotal / orcamentoTotal

  let estado
  if (custoTotal > orcamentoTotal) estado = 'acima'
  else if (ratio >= PROXIMO_THRESHOLD) estado = 'proximo'
  else estado = 'dentro'

  const deficit = Math.max(0, custoTotal - orcamentoTotal)
  const alvo = estado === 'acima'
    ? deficit + orcamentoTotal * FOLGA_DESEJADA_ACIMA
    : estado === 'proximo'
      ? custoTotal - orcamentoTotal * (1 - FOLGA_DESEJADA_PROXIMO)
      : 0

  if (estado === 'dentro') {
    return { estado, ratio, deficit: 0, alvo: 0, sugestoes: [], totalEconomia: 0 }
  }

  // === Coletar candidatas por tier (do mais sutil ao mais agressivo) ===
  const tierHotel = []
  const tierTransporte = []
  const tierTrocaAtracao = []
  const tierRemoverAtracao = []
  const tierDia = []

  // --- Tier 1: troca de hotel pela opção mais barata da mesma cidade ---
  dadosViagem.forEach((d) => {
    if (!d.hospedagem) return
    const alternativas = (d.cidade.hospedagens || []).filter((h) => h.id !== d.hospedagem.id)
    if (alternativas.length === 0) return
    const maisBarata = alternativas.reduce(
      (m, h) => (h.precoNoite < m.precoNoite ? h : m),
      alternativas[0]
    )
    if (maisBarata.precoNoite >= d.hospedagem.precoNoite) return
    const economia = Math.round((d.hospedagem.precoNoite - maisBarata.precoNoite) * d.dias)
    if (economia < ECONOMIA_MIN_RELEVANTE) return
    tierHotel.push({
      tipo: 'hotel',
      emoji: '🏨',
      cidade: d.cidade.nome,
      titulo: `Troque hotel em ${d.cidade.nome}`,
      detalhe: `${d.hospedagem.nome} → ${maisBarata.nome} (${maisBarata.tipo || 'alternativa'})`,
      economia
    })
  })

  // --- Tier 2: transporte mais barato entre cidades ---
  if (dadosViagem.length >= 2) {
    const trechosCount = dadosViagem.length - 1
    const baselineTotal = trechosCount * CUSTO_TRANSPORTE_TRECHO_BASE
    let cheapestTotal = 0
    const modaisMaisBaratos = new Set()

    for (let i = 0; i < trechosCount; i++) {
      const a = dadosViagem[i].cidade
      const b = dadosViagem[i + 1].cidade
      if (a.lat == null || b.lat == null) {
        cheapestTotal += CUSTO_TRANSPORTE_TRECHO_BASE
        continue
      }
      const km = haversine(a.lat, a.lng, b.lat, b.lng)
      const opcoes = sugestoesTransporte(km, a.nome, b.nome, dataIda)
      if (opcoes.length === 0) {
        cheapestTotal += CUSTO_TRANSPORTE_TRECHO_BASE
        continue
      }
      const maisBarato = opcoes.reduce(
        (m, o) => (o.precoMin < m.precoMin ? o : m),
        opcoes[0]
      )
      cheapestTotal += maisBarato.precoMin
      modaisMaisBaratos.add(maisBarato.nome)
    }

    const economia = Math.round(baselineTotal - cheapestTotal)
    if (economia >= ECONOMIA_MIN_RELEVANTE) {
      const modais = Array.from(modaisMaisBaratos).join('/')
      tierTransporte.push({
        tipo: 'transporte',
        emoji: '🚄',
        titulo: 'Use modais mais econômicos entre cidades',
        detalhe: `Prefira ${modais || 'trem ou ônibus'} no lugar do voo quando a distância permitir.`,
        economia
      })
    }
  }

  // --- Tier 3: trocar atração paga por gratuita ---
  dadosViagem.forEach((d) => {
    const escolhidasPagas = d.atracoes
      .filter((a) => a.preco > 0)
      .sort((a, b) => b.preco - a.preco)
    if (escolhidasPagas.length === 0) return
    const mais = escolhidasPagas[0]
    if (mais.preco < ECONOMIA_MIN_RELEVANTE) return
    const gratuitas = (d.cidade.atracoes || []).filter(
      (a) => a.preco === 0 && !d.atracoesEscolhidas.includes(a.id)
    )
    if (gratuitas.length === 0) return
    tierTrocaAtracao.push({
      tipo: 'troca_atracao',
      emoji: '🎟️',
      cidade: d.cidade.nome,
      titulo: `Troque atração em ${d.cidade.nome}`,
      detalhe: `${mais.nome} → ${gratuitas[0].nome} (gratuita)`,
      economia: Math.round(mais.preco)
    })
  })

  // --- Tier 4: remover atração premium sem substituir ---
  dadosViagem.forEach((d) => {
    const escolhidasPagas = d.atracoes
      .filter((a) => a.preco > 0)
      .sort((a, b) => b.preco - a.preco)
    if (escolhidasPagas.length < 2) return
    const mais = escolhidasPagas[0]
    if (mais.preco < 20) return
    // Evita duplicidade com troca_atracao
    const jaTrocada = tierTrocaAtracao.some((s) => s.cidade === d.cidade.nome)
    if (jaTrocada) return
    tierRemoverAtracao.push({
      tipo: 'remover_atracao',
      emoji: '✂️',
      cidade: d.cidade.nome,
      titulo: `Reduza 1 atração premium em ${d.cidade.nome}`,
      detalhe: `Remova "${mais.nome}" — é o ingresso mais caro do roteiro nesta cidade.`,
      economia: Math.round(mais.preco)
    })
  })

  // --- Tier 5: reduzir 1 dia na cidade mais cara/dia (último recurso) ---
  const cidadesComMargem = dadosViagem.filter((d) => d.dias > 2)
  if (cidadesComMargem.length > 0) {
    const maisCara = cidadesComMargem.reduce((m, d) => {
      const cpd = d.custoTotal / d.dias
      return cpd > m.custoTotal / m.dias ? d : m
    }, cidadesComMargem[0])
    const custoPorDia = Math.round(maisCara.custoTotal / maisCara.dias)
    if (custoPorDia >= ECONOMIA_MIN_RELEVANTE) {
      tierDia.push({
        tipo: 'reduzir_dia',
        emoji: '📅',
        cidade: maisCara.cidade.nome,
        titulo: `Reduza 1 dia em ${maisCara.cidade.nome}`,
        detalhe: 'Última opção — economiza 1 noite + alimentação + parcela das atrações.',
        economia: custoPorDia
      })
    }
  }

  // === Selecionar sugestões em ordem de "gentileza" até atingir alvo ===
  const escolhidas = []
  let acumulado = 0
  const ordem = [tierHotel, tierTransporte, tierTrocaAtracao, tierRemoverAtracao, tierDia]

  for (const tier of ordem) {
    tier.sort((a, b) => b.economia - a.economia)
    for (const s of tier) {
      escolhidas.push(s)
      acumulado += s.economia
      if (escolhidas.length >= 5) break
      if (acumulado >= alvo) break
    }
    if (escolhidas.length >= 5) break
    if (acumulado >= alvo) break
  }

  return {
    estado,
    ratio,
    deficit,
    alvo,
    sugestoes: escolhidas,
    totalEconomia: acumulado
  }
}
