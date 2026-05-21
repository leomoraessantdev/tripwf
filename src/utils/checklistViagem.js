// =============================================================
// Geração dinâmica do checklist de viagem.
// =============================================================
//
// Recebe os dados enriquecidos da viagem e devolve a lista de itens
// já adaptada ao roteiro. Sem rede, sem efeitos colaterais — função
// pura.
//
// Regras de adaptação:
//   - Todas as cidades do dataset estão na Europa → passaporte +
//     seguro viagem (Schengen exige) entram sempre.
//   - Hospedagens / Atrações entram só se houver algo a confirmar
//     (cidade com hospedagem escolhida / atrações com preço > 0).
//   - Transporte interno entra apenas com 2+ cidades.
//   - O item "Dinheiro local" adapta a descrição às moedas reais do
//     roteiro (uma cidade do Reino Unido força menção a GBP, etc.).

const MOEDA_CIDADE = {
  paris:      'EUR',
  roma:       'EUR',
  barcelona:  'EUR',
  amsterdam:  'EUR',
  praga:      'CZK',
  lisboa:     'EUR',
  viena:      'EUR',
  londres:    'GBP',
  berlim:     'EUR',
  madri:      'EUR',
  atenas:     'EUR',
  istambul:   'TRY',
  budapeste:  'HUF',
  florenca:   'EUR',
  edimburgo:  'GBP',
  copenhague: 'DKK'
}

const NOME_MOEDA = {
  EUR: 'euros',
  GBP: 'libras esterlinas',
  CZK: 'coroas tchecas',
  TRY: 'liras turcas',
  HUF: 'florins húngaros',
  DKK: 'coroas dinamarquesas'
}

function listaPtBr(itens) {
  if (itens.length === 0) return ''
  if (itens.length === 1) return itens[0]
  if (itens.length === 2) return `${itens[0]} e ${itens[1]}`
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

export function gerarChecklist({ dadosViagem }) {
  const itens = []

  // ---- Documentos (sempre — destino é Europa = voo internacional) ----
  itens.push({
    id: 'passaporte',
    emoji: '📄',
    titulo: 'Passaporte válido',
    descricao:
      'Schengen exige passaporte com pelo menos 6 meses de validade após o retorno.'
  })

  itens.push({
    id: 'seguro',
    emoji: '🛡',
    titulo: 'Seguro viagem',
    descricao:
      'Obrigatório para o Espaço Schengen: cobertura mínima de € 30.000 em saúde e repatriação.'
  })

  // ---- Reservas (condicionais) ----
  const cidadesComHospedagem = dadosViagem.filter((d) => d.hospedagem)
  if (cidadesComHospedagem.length > 0) {
    itens.push({
      id: 'hospedagens',
      emoji: '🏨',
      titulo: 'Hospedagens reservadas',
      descricao: `Confirme ${cidadesComHospedagem.length === 1 ? 'a reserva' : `as ${cidadesComHospedagem.length} reservas`} e leve os vouchers (PDF/print).`
    })
  }

  const temAtracoesPagas = dadosViagem.some((d) => d.custoAtracoes > 0)
  if (temAtracoesPagas) {
    itens.push({
      id: 'atracoes',
      emoji: '🎟',
      titulo: 'Atrações reservadas',
      descricao:
        'Compre ingressos com antecedência — Vaticano, Coliseu, Louvre e Sagrada Família esgotam semanas antes.'
    })
  }

  // ---- Dinheiro e conexão ----
  itens.push({
    id: 'cartao',
    emoji: '💳',
    titulo: 'Cartão internacional',
    descricao:
      'Avise o banco sobre as datas e leve um débito + um crédito (Wise, Nomad ou similar evitam IOF alto).'
  })

  itens.push({
    id: 'esim',
    emoji: '📱',
    titulo: 'Internet / eSIM',
    descricao:
      'Ative um eSIM (Airalo, Holafly) antes de embarcar — roaming da operadora local sai caro.'
  })

  // Dinheiro local — adapta texto às moedas reais do roteiro
  const moedas = [...new Set(
    dadosViagem.map((d) => MOEDA_CIDADE[d.slug]).filter(Boolean)
  )]
  let descDinheiro
  if (moedas.length === 0) {
    descDinheiro = 'Leve algum dinheiro em espécie para os primeiros gastos e gorjetas.'
  } else if (moedas.length === 1) {
    descDinheiro = `Tenha ${NOME_MOEDA[moedas[0]] || moedas[0]} em espécie para gorjetas e estabelecimentos sem máquina.`
  } else {
    const lista = listaPtBr(moedas.map((m) => NOME_MOEDA[m] || m))
    descDinheiro = `Seu roteiro passa por mais de uma moeda: ${lista}. Troque um pouco antes de cada trecho.`
  }
  itens.push({
    id: 'dinheiro',
    emoji: '💶',
    titulo: 'Dinheiro local',
    descricao: descDinheiro
  })

  // ---- Logística ----
  if (dadosViagem.length >= 2) {
    const nomes = dadosViagem.map((d) => d.cidade.nome)
    itens.push({
      id: 'transporte',
      emoji: '🚂',
      titulo: 'Transporte interno entre cidades',
      descricao: `Compre antecipado os trechos ${nomes.join(' → ')} (trem, voo curto ou ônibus) — os preços sobem na véspera.`
    })
  }

  itens.push({
    id: 'adaptador',
    emoji: '🔌',
    titulo: 'Adaptador de tomada',
    descricao:
      'A Europa usa tomadas tipo C/F; Reino Unido usa tipo G. Leve um adaptador universal.'
  })

  // ---- Bagagem ----
  itens.push({
    id: 'mala',
    emoji: '🎒',
    titulo: 'Mala organizada',
    descricao:
      'Confira limites de bagagem da companhia e separe documentos, remédios e carregador na mão.'
  })

  return itens
}
