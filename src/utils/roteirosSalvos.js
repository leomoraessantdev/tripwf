// CRUD de roteiros salvos pelo usuário. Persistência 100% local.
// Chave separada do estado atual (`viagem-europa`) — permite múltiplos
// roteiros conviverem com a viagem em edição.
//
// Schema de cada roteiro salvo:
// {
//   id: string                  // único (timestamp + random)
//   nome: string                // ex.: "Europa Julho 2026"
//   criadoEm: number            // Date.now() ms
//   atualizadoEm: number        // Date.now() ms
//   estado: {                   // snapshot completo restaurável
//     orcamentoDiario, viajantes, origem, dataIda, dataVolta, estilo,
//     cidadesSelecionadas, checklistConcluidos
//   }
//   resumo: {                   // dados pré-computados para a listagem
//     totalCidades, totalDias, custoTotal, slugs, bandeiras, imagemCapa
//   }
// }

const CHAVE = 'tripwf-roteiros'

const MES_LABEL = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function lerLista() {
  try {
    const raw = localStorage.getItem(CHAVE)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function gravarLista(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista))
    return true
  } catch {
    return false
  }
}

function gerarId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// Nome automático com base na 1ª cidade / Europa + mês/ano da ida.
// Ex.: "Europa Julho 2026", "Paris Março 2026", "Europa".
export function sugerirNomeRoteiro(estado, dadosViagem) {
  const cidades = dadosViagem || []
  const dataIda = estado?.dataIda || ''
  let base = 'Europa'
  if (cidades.length === 1) {
    base = cidades[0]?.cidade?.nome || 'Europa'
  }
  if (!dataIda) return base
  const [a, m] = dataIda.split('-').map(Number)
  if (!a || !m) return base
  return `${base} ${MES_LABEL[m]} ${a}`
}

export function listarRoteiros() {
  return lerLista().sort((a, b) => (b.atualizadoEm || 0) - (a.atualizadoEm || 0))
}

export function obterRoteiro(id) {
  return lerLista().find((r) => r.id === id) || null
}

// Salva um snapshot completo do estado da viagem. Retorna o roteiro salvo.
export function salvarRoteiro({ estado, dadosViagem, totais, nome }) {
  const lista = lerLista()
  const agora = Date.now()
  const nomeFinal = (nome && nome.trim()) || sugerirNomeRoteiro(estado, dadosViagem)

  const cidades = dadosViagem || []
  const resumo = {
    totalCidades: cidades.length,
    totalDias: totais?.totalDias || 0,
    custoTotal: totais?.custoTotal || 0,
    slugs: cidades.map((c) => c.cidade?.slug).filter(Boolean),
    nomesCidades: cidades.map((c) => c.cidade?.nome).filter(Boolean),
    bandeiras: cidades.map((c) => c.cidade?.bandeira).filter(Boolean),
    imagemCapa: cidades[0]?.cidade?.imagem || '',
    dataIda: estado?.dataIda || '',
    dataVolta: estado?.dataVolta || ''
  }

  const novo = {
    id: gerarId(),
    nome: nomeFinal,
    criadoEm: agora,
    atualizadoEm: agora,
    estado: {
      orcamentoDiario: estado.orcamentoDiario,
      viajantes: estado.viajantes,
      origem: estado.origem,
      dataIda: estado.dataIda,
      dataVolta: estado.dataVolta,
      estilo: estado.estilo,
      cidadesSelecionadas: estado.cidadesSelecionadas,
      checklistConcluidos: estado.checklistConcluidos || []
    },
    resumo
  }
  lista.push(novo)
  gravarLista(lista)
  return novo
}

export function excluirRoteiro(id) {
  const lista = lerLista().filter((r) => r.id !== id)
  return gravarLista(lista)
}

export function renomearRoteiro(id, nome) {
  const lista = lerLista()
  const idx = lista.findIndex((r) => r.id === id)
  if (idx === -1) return false
  lista[idx] = { ...lista[idx], nome: String(nome).slice(0, 80), atualizadoEm: Date.now() }
  return gravarLista(lista)
}
