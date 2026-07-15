// Forma canônica do estado da viagem + normalização de dados vindos de fora
// (localStorage, link compartilhado, snapshot salvo). O schema evolui entre
// versões do app — campos novos como checklistConcluidos podem não existir
// no estado salvo — então TODA carga externa passa por normalizarEstado
// antes de entrar no ViagemContext.

export const ESTADO_INICIAL = {
  orcamentoDiario: 100,
  viajantes: 1,
  origem: '',           // cidade/país de origem (ex.: "São Paulo, Brasil")
  dataIda: '',          // ISO date YYYY-MM-DD; vazio = sem datas calculadas
  dataVolta: '',        // ISO date; vazio = auto-calculada (dataIda + total dias)
  estilo: 'conforto',   // 'economico' | 'conforto' | 'luxo'
  cidadesSelecionadas: [],
  checklistConcluidos: []  // ids dos itens do checklist marcados como prontos
}

const ESTILOS_VALIDOS = ['economico', 'conforto', 'luxo']

const validarDataISO = (v) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''

function normalizarCidade(c) {
  if (!c || typeof c.slug !== 'string' || !c.slug) return null
  return {
    slug: c.slug,
    dias: Math.max(1, Math.min(30, Number(c.dias) || 3)),
    atracoesEscolhidas: Array.isArray(c.atracoesEscolhidas)
      ? c.atracoesEscolhidas.filter((x) => typeof x === 'string')
      : [],
    hospedagemEscolhida: typeof c.hospedagemEscolhida === 'string'
      ? c.hospedagemEscolhida
      : null
  }
}

// Recebe qualquer coisa e devolve um estado completo e com tipos garantidos.
// Campo ausente/ inválido cai no default de ESTADO_INICIAL — nunca lança.
export function normalizarEstado(bruto) {
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) {
    return { ...ESTADO_INICIAL }
  }
  return {
    orcamentoDiario: Number(bruto.orcamentoDiario) > 0
      ? Number(bruto.orcamentoDiario)
      : ESTADO_INICIAL.orcamentoDiario,
    viajantes: Math.max(1, Math.min(10, Number(bruto.viajantes) || 1)),
    origem: typeof bruto.origem === 'string' ? bruto.origem.slice(0, 80) : '',
    dataIda: validarDataISO(bruto.dataIda),
    dataVolta: validarDataISO(bruto.dataVolta),
    estilo: ESTILOS_VALIDOS.includes(bruto.estilo) ? bruto.estilo : ESTADO_INICIAL.estilo,
    cidadesSelecionadas: Array.isArray(bruto.cidadesSelecionadas)
      ? bruto.cidadesSelecionadas.map(normalizarCidade).filter(Boolean)
      : [],
    checklistConcluidos: Array.isArray(bruto.checklistConcluidos)
      ? bruto.checklistConcluidos.filter((x) => typeof x === 'string')
      : []
  }
}
