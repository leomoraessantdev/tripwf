// Heurística pura — gera sugestão automática de atrações + hospedagem
// para uma cidade baseada nos dados que JÁ existem em src/data/cidades.js
// e nas escolhas anteriores do usuário (estilo, orçamento, dias).
//
// Regras:
//  - Não inventa dados; só seleciona subconjuntos do que já está no banco
//  - Determinístico: mesma entrada → mesma saída
//  - Não obrigatório: o usuário pode trocar tudo depois

const PRIORIDADE_CATEGORIA = {
  Monumento: 1,
  Museu: 2,
  'Histórico': 3,
  Cultural: 4,
  Bairro: 5,
  Passeio: 6,
  Gastronomia: 7,
  Praia: 8,
  Parque: 9,
  'Bem-estar': 10,
  Natureza: 11
}

function sugerirHospedagem(cidade, estilo) {
  const lista = cidade?.hospedagens || []
  if (lista.length === 0) return null

  const ordenada = [...lista].sort((a, b) => a.precoNoite - b.precoNoite)

  if (estilo === 'economico') {
    // Mais barato, preferindo Hostel se existir
    return ordenada.find((h) => h.tipo === 'Hostel') ||
           ordenada.find((h) => h.tipo === 'Apartamento') ||
           ordenada[0]
  }

  if (estilo === 'luxo') {
    // Mais caro, preferindo Hotel
    const reverso = [...ordenada].reverse()
    return reverso.find((h) => h.tipo === 'Hotel') || reverso[0]
  }

  // Conforto: meio-termo. Apartamento ou Hotel mediano (nem o mais barato nem o mais caro)
  const apto = ordenada.find((h) => h.tipo === 'Apartamento')
  if (apto) return apto
  const hoteis = ordenada.filter((h) => h.tipo === 'Hotel')
  if (hoteis.length > 0) return hoteis[Math.floor(hoteis.length / 2)]
  return ordenada[Math.floor(ordenada.length / 2)]
}

function sugerirAtracoes(cidade, dias, estilo, orcamentoDiario) {
  const lista = cidade?.atracoes || []
  if (lista.length === 0) return []

  // ~1.2 atrações por dia, mínimo 2, máximo igual ao tamanho da lista
  const alvo = Math.min(lista.length, Math.max(2, Math.ceil(dias * 1.2)))

  let pool = [...lista]
  if (estilo === 'economico') {
    // Mais baratas primeiro (gratuitas tomam a frente)
    pool.sort((a, b) => a.preco - b.preco)
  } else if (estilo === 'luxo') {
    // Pagas premium primeiro (geralmente são as principais — Louvre, Versalhes)
    pool.sort((a, b) => b.preco - a.preco)
  } else {
    // Conforto: ordena por relevância da categoria (Monumento > Museu > Histórico…)
    pool.sort((a, b) => {
      const pa = PRIORIDADE_CATEGORIA[a.categoria] || 99
      const pb = PRIORIDADE_CATEGORIA[b.categoria] || 99
      if (pa !== pb) return pa - pb
      return a.preco - b.preco
    })
  }

  // Para econômico, respeita um teto: 25% do orçamento de atrações da estadia
  const teto = estilo === 'economico'
    ? orcamentoDiario * dias * 0.25
    : Infinity

  const selecionadas = []
  let custo = 0
  for (const a of pool) {
    if (selecionadas.length >= alvo) break
    if (custo + a.preco > teto && a.preco > 0) continue
    selecionadas.push(a)
    custo += a.preco
  }
  return selecionadas
}

export function sugerirEscolhas(cidade, dias, estilo, orcamentoDiario) {
  const hospedagem = sugerirHospedagem(cidade, estilo)
  const atracoes = sugerirAtracoes(cidade, dias, estilo, orcamentoDiario)
  return {
    atracoesIds: atracoes.map((a) => a.id),
    hospedagemId: hospedagem?.id ?? null
  }
}

// =============================================================
// Ordem sugerida do dia (manhã → tarde → fim de tarde → noite)
// =============================================================
//
// Distribui as atrações ESCOLHIDAS pela cidade nos quatro períodos
// do dia. Heurística pura, determinística — mesma entrada gera mesma
// saída — e não depende de coordenadas (atrações no banco não têm
// lat/lng individual; só as cidades têm).
//
// A "coerência por proximidade" vem do tipo de atração: monumentos
// e sítios históricos rendem mais cedo (luz boa, menos fila); museus
// caem bem depois do almoço; bairros, parques e passeios ao ar livre
// no fim de tarde (golden hour); gastronomia à noite.

const PERIODO_NATURAL = {
  Monumento:   0, // manhã
  'Histórico': 0, // manhã
  Museu:       1, // tarde
  Cultural:    1, // tarde
  Bairro:      2, // fim de tarde
  Passeio:     2,
  Parque:      2,
  Praia:       2,
  Natureza:    2,
  'Bem-estar': 2,
  Gastronomia: 3  // noite
}

const PERIODOS = ['Manhã', 'Tarde', 'Fim de tarde', 'Noite']

export function sugerirOrdemDia(atracoesSelecionadas) {
  if (!Array.isArray(atracoesSelecionadas) || atracoesSelecionadas.length === 0) {
    return []
  }

  // Ordena pelo período natural da categoria. Nome em PT-BR como
  // desempate estável → mesma seleção sempre produz a mesma ordem.
  const ordenadas = [...atracoesSelecionadas].sort((a, b) => {
    const pa = PERIODO_NATURAL[a.categoria] ?? 1
    const pb = PERIODO_NATURAL[b.categoria] ?? 1
    if (pa !== pb) return pa - pb
    return (a.nome || '').localeCompare(b.nome || '', 'pt-BR')
  })

  // Cursor avança a cada atração. Respeita o período natural mas nunca
  // empilha duas no mesmo slot sem precisar. Satura em "Noite" se houver
  // mais de 4 atrações no mesmo dia — sinal de que o usuário pode aumentar
  // os dias da cidade ou tirar alguma da lista.
  let cursor = -1
  return ordenadas.map((a) => {
    const natural = PERIODO_NATURAL[a.categoria] ?? 1
    const idx = Math.min(3, Math.max(natural, cursor + 1))
    cursor = idx
    return { ...a, periodo: PERIODOS[idx] }
  })
}
