// Cálculo de datas por cidade a partir da data de ida do roteiro.
// Ex.: dataIda=2026-06-01, [Paris 4d, Roma 3d] →
//   Paris  01/06 → 04/06
//   Roma   05/06 → 07/06
//   Volta  08/06

function paraData(iso) {
  if (!iso) return null
  // Parse manual para evitar fuso (YYYY-MM-DD virar UTC à meia-noite local)
  const [a, m, d] = iso.split('-').map(Number)
  if (!a || !m || !d) return null
  return new Date(a, m - 1, d)
}

function somarDias(data, n) {
  const d = new Date(data)
  d.setDate(d.getDate() + n)
  return d
}

export function computarDatasCidades(dataIda, cidadesSelecionadas) {
  const inicio = paraData(dataIda)
  if (!inicio) {
    return {
      cidadesComDatas: cidadesSelecionadas.map((c) => ({ ...c, dataInicio: null, dataFim: null })),
      dataVolta: null,
      duracaoTotal: 0
    }
  }
  let cursor = new Date(inicio)
  const cidadesComDatas = cidadesSelecionadas.map((c) => {
    const dataInicio = new Date(cursor)
    const dataFim = somarDias(cursor, Math.max(1, c.dias) - 1)
    cursor = somarDias(dataFim, 1)
    return { ...c, dataInicio, dataFim }
  })
  return {
    cidadesComDatas,
    dataVolta: cursor, // dia em que pousa em casa (após a última cidade)
    duracaoTotal: cidadesSelecionadas.reduce((acc, c) => acc + c.dias, 0)
  }
}

const fmtData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })
const fmtDataLonga = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtDataDiaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })

export function formatarData(data) {
  return data ? fmtData.format(data) : ''
}
export function formatarDataLonga(data) {
  return data ? fmtDataLonga.format(data) : ''
}
export function formatarDataDiaSemana(data) {
  return data ? fmtDataDiaSemana.format(data) : ''
}

// Formata range "01/06 → 04/06" ou "01 jun → 04 jun"
export function formatarRange(dataInicio, dataFim, longo = false) {
  if (!dataInicio || !dataFim) return ''
  const fmt = longo ? fmtDataDiaSemana : fmtData
  return `${fmt.format(dataInicio)} → ${fmt.format(dataFim)}`
}
