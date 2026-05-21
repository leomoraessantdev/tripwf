// =============================================================
// Modo Surpresa — gera roteiro completo a partir do perfil do
// usuário (orçamento + datas + estilo + viajantes).
// =============================================================
//
// 100% determinístico-mas-com-twist: mesma entrada + mesma semente
// produz o mesmo plano. Trocar a semente ("Gerar novamente") faz
// variar a seleção dentro do top elegível, sem nunca cair fora dele.
//
// Não inventa dados — só compõe sobre o que já existe em:
//   - src/data/cidades.js          (custos, atrações, hospedagens, coords)
//   - src/data/scoreCidades.js     (cultural/gastronomia/segurança/clima)
//   - src/utils/sugestoes.js       (atrações + hospedagem por cidade)

import { cidades } from '../data/cidades.js'
import { SCORE_CIDADE, SCORE_PADRAO } from '../data/scoreCidades.js'
import { sugerirEscolhas } from './sugestoes.js'

// PRNG determinístico (mulberry32). Mesma semente → mesma sequência.
function mulberry32(seed) {
  let s = (seed | 0) || 1
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Parse manual YYYY-MM-DD sem cair em UTC (utils/datas.js segue o mesmo padrão).
function parseDataLocal(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function computarTotalDias(dataIda, dataVolta) {
  const a = parseDataLocal(dataIda)
  const b = parseDataLocal(dataVolta)
  if (!a || !b) return 7
  const diff = Math.round((b - a) / 86400000)
  return Math.max(1, Math.min(30, diff || 7))
}

// Categoriza o orçamento (para a justificativa textual e regras de pool).
export function categorizarOrcamento(orcamentoDiario) {
  if (orcamentoDiario < 70) return 'baixo'
  if (orcamentoDiario < 180) return 'medio'
  return 'alto'
}

// Score 0..1 por cidade combinando atributos do scoreCidades + custoFit.
function scoreCidade(cidade, estilo, orcamentoDiario) {
  const s = SCORE_CIDADE[cidade.slug] || SCORE_PADRAO
  const custo = cidade.custoMedioDia || 60
  const custoFit = orcamentoDiario >= custo
    ? 1
    : Math.max(0.2, orcamentoDiario / custo)

  if (estilo === 'economico') {
    const atrativos = (s.cultural + s.seguranca) / 10
    return atrativos * 0.4 + custoFit * 0.6
  }
  if (estilo === 'luxo') {
    const atrativos = (s.cultural + s.gastronomia + s.seguranca) / 15
    return atrativos * 0.7 + custoFit * 0.3
  }
  // conforto: equilíbrio cultural + gastronomia + segurança + clima
  const atrativos = (s.cultural + s.gastronomia + s.seguranca + s.clima) / 20
  return atrativos * 0.55 + custoFit * 0.45
}

// Ordena por longitude — evita ziguezague entre cidades muito separadas
// (Lisboa → Istambul → Paris seria ruim). Não é caixeiro-viajante de verdade,
// mas para a Europa Ocidental funciona razoavelmente.
function ordenarGeograficamente(lista) {
  return [...lista].sort((a, b) => {
    const la = a.cidade.lng ?? 0
    const lb = b.cidade.lng ?? 0
    return la - lb
  })
}

function distribuirDias(nCidades, totalDias) {
  const base = Math.floor(totalDias / nCidades)
  const sobra = totalDias - base * nCidades
  // Pelo menos 1 dia por cidade. Sobras vão pras primeiras (cidades
  // melhor pontuadas, antes da reordenação geográfica).
  return Array.from({ length: nCidades }, (_, i) => Math.max(1, base + (i < sobra ? 1 : 0)))
}

export function gerarRoteiroSurpresa(perfil) {
  const {
    orcamentoDiario = 100,
    dataIda = '',
    dataVolta = '',
    estilo = 'conforto',
    semente = 1
  } = perfil || {}

  const totalDias = computarTotalDias(dataIda, dataVolta)
  // ~3 dias por cidade em média. Mínimo 1, máximo 6 (16 cidades no banco).
  const nCidades = Math.max(1, Math.min(6, Math.round(totalDias / 3)))

  // 1) Score todas as cidades
  const pontuadas = cidades.map((c) => ({
    cidade: c,
    score: scoreCidade(c, estilo, orcamentoDiario)
  }))

  // 2) Top elegíveis = top (nCidades * 2) — pool maior pra dar variação
  const ordemPorScore = [...pontuadas].sort((a, b) => b.score - a.score)
  const tamanhoPool = Math.min(ordemPorScore.length, Math.max(nCidades + 2, nCidades * 2))
  const pool = ordemPorScore.slice(0, tamanhoPool)

  // 3) Aplica jitter por semente — reordena pool com pequeno ruído, mantém
  // as melhores no topo mas embaralha entre vizinhas. Mesma semente repete.
  const rnd = mulberry32(semente)
  const comJitter = pool
    .map((p) => ({ ...p, peso: p.score + (rnd() - 0.5) * 0.12 }))
    .sort((a, b) => b.peso - a.peso)
    .slice(0, nCidades)

  // 4) Distribui dias (cidades melhor pontuadas ganham as sobras)
  const dias = distribuirDias(nCidades, totalDias)
  const comDias = comJitter.map((p, i) => ({ ...p, dias: dias[i] }))

  // 5) Reordena geograficamente (Oeste → Leste). Mantém os dias atribuídos.
  const ordemFinal = ordenarGeograficamente(comDias)

  // 6) Para cada cidade, aplica sugestão automática (atrações + hospedagem)
  const cidadesSelecionadas = ordemFinal.map(({ cidade, dias: d }) => {
    const { atracoesIds, hospedagemId } = sugerirEscolhas(cidade, d, estilo, orcamentoDiario)
    return {
      slug: cidade.slug,
      dias: d,
      atracoesEscolhidas: atracoesIds,
      hospedagemEscolhida: hospedagemId
    }
  })

  // 7) Justificativa
  const orcamentoCategoria = categorizarOrcamento(orcamentoDiario)
  const justificativa = construirJustificativa({
    estilo, orcamentoCategoria, totalDias, nCidades,
    cidadesNomes: ordemFinal.map((p) => p.cidade.nome)
  })

  return {
    cidadesSelecionadas,
    justificativa,
    totalDias,
    nCidades,
    estilo,
    orcamentoCategoria
  }
}

const LABEL_ESTILO = {
  economico: 'economia',
  conforto: 'conforto',
  luxo: 'experiências premium'
}

const LABEL_ORCAMENTO = {
  baixo: 'um orçamento enxuto',
  medio: 'um orçamento equilibrado',
  alto: 'um orçamento confortável'
}

const DESCRICAO_ESTILO = {
  economico: 'hostels e apartamentos, atrações gratuitas priorizadas e cidades com melhor custo-benefício',
  conforto: 'hotéis médios bem avaliados, mix das atrações principais e cidades com forte cena cultural',
  luxo: 'hotéis premium, restaurantes e experiências exclusivas, valorizando cidades de alto patrimônio'
}

function construirJustificativa({ estilo, orcamentoCategoria, totalDias, nCidades, cidadesNomes }) {
  const cidadesTxt = cidadesNomes.length === 1
    ? cidadesNomes[0]
    : `${cidadesNomes.slice(0, -1).join(', ')} e ${cidadesNomes[cidadesNomes.length - 1]}`

  return {
    resumo:
      `Escolhemos este roteiro porque você prefere ${LABEL_ESTILO[estilo]}, ` +
      `tem ${LABEL_ORCAMENTO[orcamentoCategoria]} e ${totalDias} ${totalDias === 1 ? 'dia' : 'dias'} de viagem.`,
    detalhe:
      `Em ${nCidades} ${nCidades === 1 ? 'cidade' : 'cidades'} (${cidadesTxt}) ` +
      `priorizamos ${DESCRICAO_ESTILO[estilo]}. ` +
      `A ordem segue a geografia (Oeste → Leste) para minimizar tempo entre trechos.`
  }
}
