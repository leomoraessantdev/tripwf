// =============================================================
// Estimativa heurística do deslocamento da viagem.
// =============================================================
//
// Sem APIs externas, sem coordenadas por atração (não existem no
// dataset). Determinístico: mesma entrada → mesma saída.
//
// Modelo:
//   1. Cada cidade tem um PERFIL com:
//      - compacidade   (compacta | media | metropolitana)  → distância média entre atrações
//      - modal         (caminhavel | misto | metro)        → proporção metrô vs caminhada
//   2. Nº de transições = max(0, atracoes - 1) dentro da cidade
//      (visita linear: atração 1 → 2 → ... → N).
//   3. Cada transição vira metrô ou caminhada conforme `propMetro`.
//   4. Caminhada base/dia (perambulação + hotel ↔ pontos) = 2.5 km.
//   5. Caminhada extra por atração (rondar a região) = 0.5 km.
//   6. Baseline diário de metrô em cidades metropolitanas/mistas:
//      mesmo sem transições suficientes, o turista usa metrô para ir
//      do hotel a um ponto turístico e voltar (ida + volta = 2 trechos
//      por dia em metropolitana com atração). Sem esse piso, Paris
//      com 3 atrações em 3 dias retornava 0 trechos — fora da realidade.
//
// Veja sanity-checks em comentários ao final do arquivo.

const CONFIG = {
  velocidadeCaminhada: 4.5,        // km/h
  velocidadeMetro: 18,             // km/h efetiva (inclui espera + transferência)
  tempoFixoTrechoMetro: 8,         // min por trecho (acesso + espera + saída da estação)
  caminhadaBaseDia: 2.5,           // km/dia ambiente (hotel ↔ ponto, café, perambular)
  caminhadaPorAtracao: 0.5         // km extras ao redor de cada atração visitada
}

const COMPACIDADE = {
  compacta:       1.2,   // km — cidade caminhável, atrações concentradas
  media:          2.5,   // km — cidade média, mix entre caminhada e transporte
  metropolitana:  3.5    // km — cidade grande, atrações espalhadas
}

const PROP_METRO = {
  caminhavel: 0.10,
  misto:      0.40,
  metro:      0.70
}

// Piso diário de trechos de metrô quando há ao menos 1 atração no dia.
// Modela ida/volta hotel↔região turística que o modelo linear ignora.
const TRECHOS_METRO_MIN_POR_DIA = {
  caminhavel: 0,   // cidade compacta a pé — sem piso
  misto:      1,   // 1 trecho/dia (ida OU volta no transporte público)
  metro:      2    // ida + volta de metrô como padrão urbano
}

// Perfil por slug. Classificação baseada no diâmetro real do centro
// turístico e no uso típico de transporte público do destino.
const PERFIL_CIDADE = {
  florenca:   { compacidade: 'compacta',      modal: 'caminhavel' },
  edimburgo:  { compacidade: 'compacta',      modal: 'caminhavel' },
  praga:      { compacidade: 'compacta',      modal: 'caminhavel' },
  lisboa:     { compacidade: 'compacta',      modal: 'caminhavel' },
  atenas:     { compacidade: 'compacta',      modal: 'caminhavel' },
  copenhague: { compacidade: 'compacta',      modal: 'caminhavel' },
  amsterdam:  { compacidade: 'media',         modal: 'misto' },
  viena:      { compacidade: 'media',         modal: 'misto' },
  barcelona:  { compacidade: 'media',         modal: 'misto' },
  budapeste:  { compacidade: 'media',         modal: 'misto' },
  roma:       { compacidade: 'media',         modal: 'misto' },
  paris:      { compacidade: 'metropolitana', modal: 'metro' },
  londres:    { compacidade: 'metropolitana', modal: 'metro' },
  berlim:     { compacidade: 'metropolitana', modal: 'metro' },
  madri:      { compacidade: 'metropolitana', modal: 'metro' },
  istambul:   { compacidade: 'metropolitana', modal: 'metro' }
}

const PERFIL_PADRAO = { compacidade: 'media', modal: 'misto' }

// Recebe `dadosViagem` (já enriquecido pelo ViagemContext) e o total
// de dias do roteiro. Retorna `null` quando não há cidades ou dias.
export function estimarDeslocamento(dadosViagem, totalDias) {
  if (!dadosViagem || dadosViagem.length === 0 || !totalDias || totalDias <= 0) {
    return null
  }

  let kmCaminhadaTotal = 0
  let kmMetroTotal = 0
  let trechosMetroTotal = 0
  let minutosTotal = 0
  let atracoesTotal = 0

  dadosViagem.forEach((d) => {
    const perfil = PERFIL_CIDADE[d.slug] || PERFIL_PADRAO
    const dist = COMPACIDADE[perfil.compacidade]
    const propMetro = PROP_METRO[perfil.modal]

    const nAtracoes = d.atracoes.length
    const dias = Math.max(1, d.dias)
    atracoesTotal += nAtracoes

    // Transições por cidade: percurso linear entre atrações (1 → N).
    const transicoesCidade = Math.max(0, nAtracoes - 1)

    const trechosMetroLinear = Math.round(transicoesCidade * propMetro)
    const trechosCaminhadaCidade = transicoesCidade - trechosMetroLinear

    // Piso diário de metrô (apenas se há atrações no roteiro da cidade).
    // Garante que cidade com perfil metro/misto não retorne 0 quando o
    // usuário escolhe poucas atrações em muitos dias.
    const pisoMetroCidade = nAtracoes > 0
      ? TRECHOS_METRO_MIN_POR_DIA[perfil.modal] * dias
      : 0
    const trechosMetroCidade = Math.max(trechosMetroLinear, pisoMetroCidade)

    const kmMetroCidade = trechosMetroCidade * dist
    const kmCaminhadaCidade =
      trechosCaminhadaCidade * dist +
      CONFIG.caminhadaBaseDia * dias +
      nAtracoes * CONFIG.caminhadaPorAtracao

    const minMetroCidade =
      trechosMetroCidade * CONFIG.tempoFixoTrechoMetro +
      (kmMetroCidade / CONFIG.velocidadeMetro) * 60
    const minCaminhadaCidade =
      (kmCaminhadaCidade / CONFIG.velocidadeCaminhada) * 60

    kmCaminhadaTotal += kmCaminhadaCidade
    kmMetroTotal += kmMetroCidade
    trechosMetroTotal += trechosMetroCidade
    minutosTotal += minMetroCidade + minCaminhadaCidade
  })

  const kmCaminhadaDia = kmCaminhadaTotal / totalDias
  const kmMetroDia = kmMetroTotal / totalDias
  const trechosMetroDia = trechosMetroTotal / totalDias
  const minutosDia = minutosTotal / totalDias
  const atracoesPorDiaMedio = atracoesTotal / totalDias

  // Intensidade considera tempo de deslocamento E densidade de atrações.
  // Pega o "pior" dos dois critérios (a viagem é intensa se QUALQUER um for).
  let intensidade = 'leve'
  if (minutosDia > 135 || atracoesPorDiaMedio >= 5) {
    intensidade = 'intenso'
  } else if (minutosDia > 75 || atracoesPorDiaMedio >= 4) {
    intensidade = 'moderado'
  }

  return {
    kmCaminhadaDia,
    kmMetroDia,
    kmCaminhadaTotal,
    kmMetroTotal,
    trechosMetroDia,
    trechosMetroTotal,
    minutosDia,
    minutosTotal,
    atracoesPorDiaMedio,
    intensidade
  }
}

// Formata minutos em "1h20" / "45 min" / "2h".
export function formatarDuracao(minutos) {
  const total = Math.max(0, Math.round(minutos))
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  if (m === 0) return `${h}h`
  return `${h}h${String(m).padStart(2, '0')}`
}

// -------------------------------------------------------------
// Sanity-checks (mental — não exporta, serve só de referência):
//
//   Florença 5 atrações × 2 dias (compacta + caminhavel):
//     transições = 4 → metrô 0, caminhada 4
//     km cam     = 4*1.2 + 2.5*2 + 5*0.5  = 12.3 km
//     min cam    = (12.3/4.5)*60          ≈ 164 min
//     /2 dias    → 6.2 km/dia, 0 metrô/dia, ~82 min/dia → moderado
//
//   Paris 4 atrações × 3 dias (metropolitana + metro):
//     transições = 3 → metrô 2, caminhada 1
//     km metrô   = 2*3.5 = 7
//     km cam     = 1*3.5 + 2.5*3 + 4*0.5  = 13.5 km
//     min total  = 2*8 + (7/18)*60 + (13.5/4.5)*60 ≈ 213 min
//     /3 dias    → 4.5 km cam/dia, ~1 metrô/dia, ~71 min/dia → leve
// -------------------------------------------------------------
