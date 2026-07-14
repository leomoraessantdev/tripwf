// =============================================================
// Cálculo de "Quanto você economizou planejando".
// =============================================================
//
// Compara o custo REAL do roteiro com um BASELINE "turista sem planejamento"
// — hotel mais caro da cidade × multiplicador de alta temporada (1.20),
// transporte assumindo voo regional médio (€120/trecho), atrações pagando
// os ingressos mais caros disponíveis (não os escolhidos), e custo de
// alimentação inalterado (usuário não controla esse eixo).
//
// Função pura, sem rede. Roda toda vez que `dadosViagem` muda.
//
// Multiplicadores e baselines vêm de médias agregadas Booking/Skyscanner/
// Trainline 2023-2024 (mesmas usadas em utils/temporadas.js).

import { detectarTemporada } from './temporadas.js'

const TRANSPORTE_BASELINE_TRECHO = 120  // EUR — voo regional barato médio
const TRANSPORTE_REAL_TRECHO = 80       // EUR — mesma constante do ViagemContext
const MULT_HOTEL_ALTA = 1.20            // baseline assume sempre alta temporada
const ECONOMIA_MIN_RELEVANTE = 15       // ignora ganhos menores que isso

// Pacote de agência: baseline + taxa de serviço média de operadoras (10-20%
// sobre o pacote, fonte: práticas de mercado ABAV/consolidadores 2024).
const MULT_AGENCIA = 1.15

// Tempo de pesquisa manual estimado (survey Expedia/Skyscanner: viajante
// médio gasta 10h+ pesquisando). Heurística por tamanho do roteiro:
const HORAS_BASE_PESQUISA = 2          // comparar destinos, montar planilha
const HORAS_POR_CIDADE = 1.5           // hotéis + o que fazer em cada cidade
const HORAS_POR_ATRACAO = 0.2          // achar ingresso, horário, preço
const HORAS_POR_TRECHO = 0.5           // comparar voo/trem/ônibus por trecho
const MINUTOS_TRIPWF = 15              // fluxo completo dos 4 passos

// Indicador visual a partir do ratio (economia/baseline):
// >= 12%  → excelente (verde)
// 4-12%   → moderado (amarelo)
// < 4%    → alto custo (vermelho)
const THRESHOLD_EXCELENTE = 0.12
const THRESHOLD_MODERADO = 0.04

export function calcularEconomia({ dadosViagem, totais, dataIda }) {
  if (!dadosViagem || dadosViagem.length === 0) return null

  // ---------- Baseline por categoria ----------

  // Hospedagem baseline: hotel mais caro da cidade × alta temporada × dias.
  // Real: o que o usuário já paga (custoHospedagem).
  // Só compara cidades COM hospedagem escolhida — sem hotel escolhido não há
  // economia real a reivindicar (o usuário ainda vai dormir em algum lugar).
  let hospedagemBaseline = 0
  let hospedagemReal = 0
  dadosViagem.forEach((d) => {
    if (!d.hospedagem) return
    const opcoes = d.cidade.hospedagens || []
    if (opcoes.length === 0) return
    const maisCara = opcoes.reduce((m, h) => (h.precoNoite > m.precoNoite ? h : m), opcoes[0])
    hospedagemBaseline += maisCara.precoNoite * d.dias * MULT_HOTEL_ALTA
    hospedagemReal += d.custoHospedagem
  })
  const economiaHospedagem = Math.max(0, hospedagemBaseline - hospedagemReal)

  // Atrações baseline: as N atrações mais caras da cidade (N = quantidade
  // escolhida pelo usuário). Se usuário escolheu 0, baseline também 0.
  // Real: custoAtracoes da cidade.
  let atracoesBaseline = 0
  let atracoesReal = 0
  let atracoesGratuitasEscolhidas = 0
  dadosViagem.forEach((d) => {
    const n = d.atracoes.length
    if (n === 0) return
    const pagas = (d.cidade.atracoes || [])
      .filter((a) => a.preco > 0)
      .sort((a, b) => b.preco - a.preco)
    const topN = pagas.slice(0, n)
    atracoesBaseline += topN.reduce((s, a) => s + a.preco, 0)
    atracoesReal += d.custoAtracoes
    atracoesGratuitasEscolhidas += d.atracoes.filter((a) => a.preco === 0).length
  })
  const economiaAtracoes = Math.max(0, atracoesBaseline - atracoesReal)

  // Transporte baseline: avião €120/trecho. Real: €80/trecho.
  const nTrechos = Math.max(0, dadosViagem.length - 1)
  const transporteBaseline = nTrechos * TRANSPORTE_BASELINE_TRECHO
  const transporteReal = nTrechos * TRANSPORTE_REAL_TRECHO
  const economiaTransporte = Math.max(0, transporteBaseline - transporteReal)

  // Temporada: para cada cidade, se está em baixa/média (vs alta assumida no
  // baseline), o usuário economiza o delta. Esse delta JÁ está parcialmente
  // contido em economiaHospedagem (baseline usa 1.20 sempre). Aqui calculamos
  // o componente atribuível à temporada pra exibir no breakdown — sem dupla
  // contagem no total (já está em hospedagemBaseline).
  let economiaTemporada = 0
  let cidadesForaDeAlta = 0
  dadosViagem.forEach((d) => {
    const t = detectarTemporada(d.cidade.slug, d.dataInicio || dataIda)
    if (!t) return
    if (t.tipo === 'baixa' || t.tipo === 'media') {
      cidadesForaDeAlta += 1
      // Diferença entre multiplicador real e o baseline (1.20).
      const delta = MULT_HOTEL_ALTA - t.multiplicadorHotel
      economiaTemporada += d.custoHospedagem * delta
    }
  })
  economiaTemporada = Math.max(0, economiaTemporada)

  // ---------- Total ----------
  // economiaTemporada NÃO entra no total pra não duplicar (já está incluída
  // dentro de economiaHospedagem via baseline com mult 1.20). Aparece só no
  // breakdown como atribuição parcial — para o usuário entender por que.
  const baselineTotal = hospedagemBaseline + atracoesBaseline + transporteBaseline + totais.food
  const atualTotal = totais.custoTotal
  const economiaTotal = Math.max(0, baselineTotal - atualTotal)
  const ratio = baselineTotal > 0 ? economiaTotal / baselineTotal : 0

  let indicador
  if (ratio >= THRESHOLD_EXCELENTE) indicador = 'excelente'
  else if (ratio >= THRESHOLD_MODERADO) indicador = 'moderado'
  else indicador = 'alto'

  // ---------- Badges qualitativos ----------
  const badges = []
  if (economiaHospedagem >= ECONOMIA_MIN_RELEVANTE) {
    badges.push('Hospedagens mais eficientes')
  }
  if (dadosViagem.length >= 2 && dadosViagem.length <= 5) {
    badges.push('Melhor distribuição do roteiro')
  }
  if (economiaTransporte >= ECONOMIA_MIN_RELEVANTE) {
    badges.push('Transporte otimizado')
  }
  if (cidadesForaDeAlta > 0) {
    badges.push(
      cidadesForaDeAlta === dadosViagem.length
        ? 'Menor impacto de alta temporada'
        : 'Datas evitam picos de alta temporada'
    )
  }
  if (atracoesGratuitasEscolhidas > 0) {
    badges.push(
      `${atracoesGratuitasEscolhidas} ${atracoesGratuitasEscolhidas === 1 ? 'atração gratuita' : 'atrações gratuitas'} no roteiro`
    )
  }

  // ---------- Top sugestão (para economizar AINDA mais) ----------
  // Olha cada cidade e calcula quanto o usuário pouparia trocando o hotel
  // atual pelo mais barato disponível. Escolhe a maior economia entre todas.
  let topSugestao = null
  dadosViagem.forEach((d) => {
    if (!d.hospedagem) return
    const alternativas = (d.cidade.hospedagens || []).filter((h) => h.id !== d.hospedagem.id)
    if (alternativas.length === 0) return
    const maisBarata = alternativas.reduce(
      (m, h) => (h.precoNoite < m.precoNoite ? h : m),
      alternativas[0]
    )
    if (maisBarata.precoNoite >= d.hospedagem.precoNoite) return
    const ganho = Math.round((d.hospedagem.precoNoite - maisBarata.precoNoite) * d.dias)
    if (ganho < ECONOMIA_MIN_RELEVANTE) return
    if (!topSugestao || ganho > topSugestao.economia) {
      topSugestao = {
        cidade: d.cidade.nome,
        economia: ganho,
        hotelAtual: d.hospedagem.nome,
        hotelAlternativo: maisBarata.nome,
        texto: `Você poderia economizar mais ${formatarValor(ganho)} trocando o hotel de ${d.cidade.nome}.`
      }
    }
  })

  // ---------- Cenários de comparação (gráfico) ----------
  // agencia: pacote fechado (baseline + taxa de serviço da operadora)
  // baseline: viajar por conta própria sem planejar/comparar
  // atual: o roteiro montado no TripWF
  const agenciaTotal = baselineTotal * MULT_AGENCIA

  // ---------- Tempo de planejamento economizado ----------
  const totalAtracoes = dadosViagem.reduce((s, d) => s + d.atracoes.length, 0)
  const horasManual =
    HORAS_BASE_PESQUISA +
    HORAS_POR_CIDADE * dadosViagem.length +
    HORAS_POR_ATRACAO * totalAtracoes +
    HORAS_POR_TRECHO * nTrechos
  const horasManualArred = Math.round(horasManual * 2) / 2
  const horasEconomizadas = Math.max(0, Math.round((horasManual - MINUTOS_TRIPWF / 60) * 2) / 2)

  return {
    baselineTotal: Math.round(baselineTotal),
    agenciaTotal: Math.round(agenciaTotal),
    atualTotal: Math.round(atualTotal),
    economiaTotal: Math.round(economiaTotal),
    economiaVsAgencia: Math.max(0, Math.round(agenciaTotal - atualTotal)),
    tempo: {
      horasManual: horasManualArred,
      minutosTripwf: MINUTOS_TRIPWF,
      horasEconomizadas
    },
    ratio,
    indicador,
    breakdown: {
      hospedagem: Math.round(economiaHospedagem),
      atracoes: Math.round(economiaAtracoes),
      transporte: Math.round(economiaTransporte),
      temporada: Math.round(economiaTemporada)
    },
    badges,
    topSugestao
  }
}

function formatarValor(n) {
  return `€${Math.round(n).toLocaleString('pt-BR')}`
}
