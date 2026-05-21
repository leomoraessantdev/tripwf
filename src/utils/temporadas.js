// Detecção de temporada por cidade × mês.
// Lê EPOCA_CIDADE (data/epocas.js) — alta/baixa por cidade em texto livre
// ("Julho e Agosto", "Março, Outubro e Novembro") e parseia para inteiros.
// Retorna multiplicadores realistas pra hotel/voo e mensagem em PT-BR.
//
// Fontes dos multiplicadores: médias agregadas Booking/Skyscanner/Trainline
// 2023-2024 (variação típica entre alta e baixa temporada em destinos europeus).

import { EPOCA_CIDADE } from '../data/epocas.js'

const MES_NUMERO = {
  janeiro: 1, fevereiro: 2, marco: 3, 'março': 3,
  abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8,
  setembro: 9, outubro: 10, novembro: 11, dezembro: 12
}

const MES_LABEL = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function extrairMeses(texto) {
  if (!texto) return []
  const t = texto.toLowerCase()
  const meses = new Set()
  for (const [nome, n] of Object.entries(MES_NUMERO)) {
    if (t.includes(nome)) meses.add(n)
  }
  return [...meses]
}

// Converte data (string ISO ou Date) em número do mês (1-12). Null se inválido.
export function mesDe(dataOuIso) {
  if (!dataOuIso) return null
  if (dataOuIso instanceof Date) return dataOuIso.getMonth() + 1
  const [, m] = String(dataOuIso).split('-').map(Number)
  return Number.isFinite(m) && m >= 1 && m <= 12 ? m : null
}

export function detectarTemporada(slug, dataOuIso) {
  const mes = mesDe(dataOuIso)
  const epoca = EPOCA_CIDADE[slug]
  if (!mes || !epoca) return null

  const mesesAlta = extrairMeses(epoca.altaTemporada)
  const mesesBaixa = extrairMeses(epoca.custoBeneficio)

  if (mesesAlta.includes(mes)) {
    return {
      tipo: 'alta',
      emoji: '☀️',
      label: 'Alta temporada',
      mes,
      mesLabel: MES_LABEL[mes],
      multiplicadorHotel: 1.20,
      multiplicadorVoo: 1.25,
      multiplicadorAtracao: 1.00,
      classes: 'bg-amber-100 text-amber-700 border-amber-300'
    }
  }
  if (mesesBaixa.includes(mes)) {
    return {
      tipo: 'baixa',
      emoji: '❄️',
      label: 'Baixa temporada',
      mes,
      mesLabel: MES_LABEL[mes],
      multiplicadorHotel: 0.85,
      multiplicadorVoo: 0.90,
      multiplicadorAtracao: 1.00,
      classes: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    }
  }
  return {
    tipo: 'media',
    emoji: '🌸',
    label: 'Média temporada',
    mes,
    mesLabel: MES_LABEL[mes],
    multiplicadorHotel: 1.00,
    multiplicadorVoo: 1.00,
    multiplicadorAtracao: 1.00,
    classes: 'bg-sky-100 text-sky-700 border-sky-300'
  }
}

export function mensagemImpactoTemporada(temporada, cidadeNome) {
  if (!temporada) return ''
  if (temporada.tipo === 'alta') {
    const pct = Math.round((temporada.multiplicadorHotel - 1) * 100)
    return `${temporada.mesLabel} é alta temporada em ${cidadeNome}. Hospedagens costumam custar ~${pct}% mais do que a média anual.`
  }
  if (temporada.tipo === 'baixa') {
    const pct = Math.round((1 - temporada.multiplicadorHotel) * 100)
    return `${temporada.mesLabel} é baixa temporada em ${cidadeNome}. Hospedagens costumam ficar ~${pct}% mais baratas que a média.`
  }
  return `${temporada.mesLabel} é ombro de temporada em ${cidadeNome}. Preços médios sem grandes variações.`
}

// Para o trecho entre duas cidades, usa a média do voo entre as duas
// (já que um voo "atravessa" os dois mercados).
export function multiplicadorVooMedio(slugA, slugB, dataIso) {
  const tA = detectarTemporada(slugA, dataIso)
  const tB = detectarTemporada(slugB, dataIso)
  const mA = tA?.multiplicadorVoo ?? 1
  const mB = tB?.multiplicadorVoo ?? 1
  return (mA + mB) / 2
}
