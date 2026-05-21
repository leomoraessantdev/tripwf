// =============================================================
// Comparador inteligente de cidades — função pura.
// =============================================================
//
// Combina scores estáticos (data/scoreCidades.js) com cálculo
// dinâmico de custo a partir de hospedagem + alimentação + atrações
// do dataset real. Sem rede, sem APIs externas.
//
// Retorna:
//   - 8 dimensões com valores numéricos, vencedora e rótulo de vitória
//   - cidade recomendada (composto ponderado pelo estilo do usuário)
//   - texto motivacional para o card final

import { buscarCidade } from '../data/cidades.js'
import { SCORE_CIDADE, SCORE_PADRAO } from '../data/scoreCidades.js'
import { formatarEUR } from './formatadores.js'

// Custo médio diário estimado por cidade, considerando o estilo da
// viagem do usuário (afeta a escolha da hospedagem-base).
function estimarCustoDiario(cidade, estilo) {
  const hosps = cidade.hospedagens || []
  const precos = hosps.map((h) => h.precoNoite).sort((a, b) => a - b)

  let hospedagem
  if (precos.length === 0) {
    hospedagem = 100
  } else if (estilo === 'economico') {
    hospedagem = precos[0]
  } else if (estilo === 'luxo') {
    hospedagem = precos[precos.length - 1]
  } else {
    // conforto = mediana
    hospedagem = precos[Math.floor(precos.length / 2)]
  }

  const alimentacao = cidade.custoAlimentacaoDia || 40

  // Atrações: média dos 3 ingressos mais caros (perfil "vou nos imperdíveis")
  const ingressos = (cidade.atracoes || [])
    .map((a) => a.preco || 0)
    .sort((a, b) => b - a)
    .slice(0, 3)
  const atracoes = ingressos.length > 0
    ? ingressos.reduce((s, p) => s + p, 0) / ingressos.length
    : 0

  return hospedagem + alimentacao + atracoes
}

const PESOS_ESTILO = {
  economico: { qualidade: 0.35, custo: 0.65 },
  conforto:  { qualidade: 0.55, custo: 0.45 },
  luxo:      { qualidade: 0.80, custo: 0.20 }
}

function fraseEstilo(estilo) {
  if (estilo === 'economico') return 'priorizando custo baixo'
  if (estilo === 'luxo')      return 'sem abrir mão de qualidade'
  return 'buscando equilíbrio entre custo e experiência'
}

export function compararCidades(slugA, slugB, { estilo, orcamentoDiario } = {}) {
  const cidadeA = buscarCidade(slugA)
  const cidadeB = buscarCidade(slugB)
  if (!cidadeA || !cidadeB) return null

  const scoresA = SCORE_CIDADE[slugA] || SCORE_PADRAO
  const scoresB = SCORE_CIDADE[slugB] || SCORE_PADRAO
  const custoA = estimarCustoDiario(cidadeA, estilo)
  const custoB = estimarCustoDiario(cidadeB, estilo)

  // Qualidade composta (média dos 5 atributos "positivos")
  const qualidadeA = (scoresA.cultural + scoresA.noturna + scoresA.gastronomia + scoresA.seguranca + scoresA.clima) / 5
  const qualidadeB = (scoresB.cultural + scoresB.noturna + scoresB.gastronomia + scoresB.seguranca + scoresB.clima) / 5

  // Custo-benefício: qualidade por euro/dia
  const cbA = qualidadeA / (custoA / 100)
  const cbB = qualidadeB / (custoB / 100)

  // Dimensões para a tabela visual.
  //   tipo: 'maior' → vence quem tem o valor mais alto
  //   tipo: 'menor' → vence quem tem o valor mais baixo (custo, caminhada, intensidade)
  const dimensoes = [
    { id: 'custo',          emoji: '💰', rotulo: 'Custo médio/dia',     tipo: 'menor', valorA: custoA, valorB: custoB, rotuloVitoria: 'Mais econômica' },
    { id: 'cultural',       emoji: '🏛', rotulo: 'Nível cultural',      tipo: 'maior', valorA: scoresA.cultural, valorB: scoresB.cultural, rotuloVitoria: 'Mais cultural' },
    { id: 'noturna',        emoji: '🌙', rotulo: 'Vida noturna',        tipo: 'maior', valorA: scoresA.noturna, valorB: scoresB.noturna, rotuloVitoria: 'Melhor vida noturna' },
    { id: 'gastronomia',    emoji: '🍝', rotulo: 'Gastronomia',         tipo: 'maior', valorA: scoresA.gastronomia, valorB: scoresB.gastronomia, rotuloVitoria: 'Melhor gastronomia' },
    { id: 'seguranca',      emoji: '🛡', rotulo: 'Segurança',           tipo: 'maior', valorA: scoresA.seguranca, valorB: scoresB.seguranca, rotuloVitoria: 'Mais segura' },
    { id: 'clima',          emoji: '☀',  rotulo: 'Conforto climático',  tipo: 'maior', valorA: scoresA.clima, valorB: scoresB.clima, rotuloVitoria: 'Melhor clima' },
    { id: 'caminhada',      emoji: '🚶', rotulo: 'Caminhada exigida',   tipo: 'menor', valorA: scoresA.caminhada, valorB: scoresB.caminhada, rotuloVitoria: 'Menos caminhada' },
    { id: 'intensidade',    emoji: '🌀', rotulo: 'Intensidade turística', tipo: 'menor', valorA: scoresA.intensidade, valorB: scoresB.intensidade, rotuloVitoria: 'Menos turística' },
    { id: 'custoBeneficio', emoji: '⭐', rotulo: 'Custo-benefício',     tipo: 'maior', valorA: cbA, valorB: cbB, rotuloVitoria: 'Melhor custo-benefício' }
  ]

  dimensoes.forEach((d) => {
    if (d.valorA === d.valorB) {
      d.vencedora = null
    } else if (d.tipo === 'maior') {
      d.vencedora = d.valorA > d.valorB ? slugA : slugB
    } else {
      d.vencedora = d.valorA < d.valorB ? slugA : slugB
    }
  })

  // Score composto da recomendação. Normaliza qualidade (0-5 → 0-1) e
  // custo (min-max invertido: mais barato = 1, mais caro = 0).
  const peso = PESOS_ESTILO[estilo] || PESOS_ESTILO.conforto
  const qualNormA = qualidadeA / 5
  const qualNormB = qualidadeB / 5
  const custoMin = Math.min(custoA, custoB)
  const custoMax = Math.max(custoA, custoB)
  const custoNormA = custoMax === custoMin ? 0.5 : 1 - (custoA - custoMin) / (custoMax - custoMin)
  const custoNormB = custoMax === custoMin ? 0.5 : 1 - (custoB - custoMin) / (custoMax - custoMin)

  const scoreA = qualNormA * peso.qualidade + custoNormA * peso.custo
  const scoreB = qualNormB * peso.qualidade + custoNormB * peso.custo

  let recomendada = null
  if (scoreA > scoreB) recomendada = slugA
  else if (scoreB > scoreA) recomendada = slugB

  // Bônus: se orçamento for menor que o custo estimado, deixa explícito
  // no texto da recomendação que a outra pode ser inviável.
  let alertaOrcamento = null
  if (orcamentoDiario && orcamentoDiario > 0) {
    if (custoA > orcamentoDiario && custoB > orcamentoDiario) {
      alertaOrcamento = 'Atenção: ambas estão acima do seu orçamento diário.'
    } else if (custoA > orcamentoDiario) {
      alertaOrcamento = `${cidadeA.nome} está acima do seu orçamento diário.`
    } else if (custoB > orcamentoDiario) {
      alertaOrcamento = `${cidadeB.nome} está acima do seu orçamento diário.`
    }
  }

  let motivoRecomendacao
  if (!recomendada) {
    motivoRecomendacao = 'As duas cidades estão tecnicamente empatadas para o seu perfil — escolha pela vibe que mais combina com você.'
  } else {
    const venceA = recomendada === slugA
    const cidadeRec = venceA ? cidadeA : cidadeB
    const custoRec = venceA ? custoA : custoB
    const estiloLegivel = estilo || 'conforto'
    motivoRecomendacao = `Com base no seu estilo ${estiloLegivel} (${fraseEstilo(estilo)}) e nas notas de qualidade × custo, ${cidadeRec.nome} entrega a melhor combinação — em torno de ${formatarEUR(custoRec)} por dia.`
  }

  return {
    cidadeA,
    cidadeB,
    custoA,
    custoB,
    qualidadeA,
    qualidadeB,
    dimensoes,
    recomendada,
    motivoRecomendacao,
    alertaOrcamento
  }
}
