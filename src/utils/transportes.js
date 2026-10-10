// Sugestões de transporte entre duas cidades + URLs de plataformas reais.
//
// HISTÓRICO DE BUGS RESOLVIDOS:
// - Skyscanner exige códigos IATA na URL → 404 com nome de cidade. Removido.
// - Kayak.com.br filtra para rotas brasileiras → não mostra voos europeus. Removido.
// - Omio search-frontend (busca com parâmetros) → página em branco.
//
// SOLUÇÃO ATUAL (verificada em out/2026):
// - Omio com data: GET em /growth/search-trigger/search (o mesmo endpoint do
//   formulário das páginas de rota) com o ID de posição Omio de cada cidade +
//   departure_date DD/MM/AAAA + idade de cada passageiro → redireciona para os
//   resultados já filtrados no dia do trecho. Exige `user_id` (qualquer valor).
// - Sem data ou sem ID: página de rota /trains|buses/<a>/<b> (sem data).
// - Google Flights aceita a data em linguagem natural no q=.
// - Rome2Rio é o coringa universal (sempre carrega, sem data).

const enc = (s) => encodeURIComponent(String(s || '').trim())
const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos (Florença → florenca)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

// Google Flights — natural language no q=, funciona em qualquer idioma/região
function linkGoogleFlights(a, b, ida, volta) {
  let q = `Flights from ${a} to ${b}`
  if (ida) q += ` on ${ida}`
  if (volta) q += ` returning ${volta}`
  return `https://www.google.com/travel/flights?hl=pt-BR&q=${enc(q)}`
}

// Rome2Rio — multi-modal, aceita nome de cidade direto na rota.
function linkRome2Rio(a, b) {
  return `https://www.rome2rio.com/map/${enc(a)}/${enc(b)}`
}

// Google Maps directions — sempre funciona pra carro
function linkGoogleMaps(a, b) {
  return `https://www.google.com/maps/dir/${enc(a)}/${enc(b)}`
}

// Omio identifica cidades pelo nome em inglês nas páginas de rota.
const NOME_OMIO = {
  Roma: 'rome',
  Praga: 'prague',
  Lisboa: 'lisbon',
  Viena: 'vienna',
  Londres: 'london',
  Berlim: 'berlin',
  Madri: 'madrid',
  Atenas: 'athens',
  Istambul: 'istanbul',
  Budapeste: 'budapest',
  'Florença': 'florence',
  Edimburgo: 'edinburgh',
  Copenhague: 'copenhagen',
  'Milão': 'milan'
}

const slugOmio = (nome) => NOME_OMIO[String(nome || '').trim()] || slug(nome)

// ID de posição Omio de cada cidade (campo departure_fk das páginas de rota).
export const OMIO_ID = {
  paris: 379727,
  roma: 388498,
  barcelona: 378468,
  amsterdam: 393153,
  praga: 375859,
  lisboa: 398773,
  viena: 368571,
  londres: 380553,
  berlim: 376217,
  madri: 378655,
  atenas: 381320,
  istambul: 407183,
  budapeste: 383168,
  florenca: 388058,
  edimburgo: 380324,
  copenhague: 377541,
  milao: 388252,
  porto: 398868,
  // destinos de bate e volta
  toledo: 378823,
  lugano: 16888942,
  tirano: 388686
}

// Omio — página de rota (trem ou ônibus), sem data.
export function linkOmio(a, b, modal = 'trem') {
  const tipo = modal === 'onibus' ? 'buses' : 'trains'
  return `https://www.omio.com/${tipo}/${slugOmio(a)}/${slugOmio(b)}`
}

const MODO_OMIO = { trem: 'train', onibus: 'bus', aviao: 'flight' }

function isoParaOmio(iso) {
  const [a, m, d] = String(iso).split('-')
  return `${d}/${m}/${a}`
}

// Omio — busca já filtrada no dia, com 1 passageiro adulto por viajante.
// Retorna null quando falta ID ou data (quem chama cai no linkOmio sem data).
export function linkOmioComData(idOrigem, idDestino, dataIso, { modal = 'trem', viajantes = 1 } = {}) {
  if (!idOrigem || !idDestino || !/^\d{4}-\d{2}-\d{2}$/.test(dataIso || '')) return null
  const n = Math.max(1, Math.min(9, Number(viajantes) || 1))
  const modo = MODO_OMIO[modal] || 'train'
  const params = [
    `departure_fk=${idOrigem}`,
    `arrival_fk=${idDestino}`,
    `departure_date=${enc(isoParaOmio(dataIso))}`,
    ...Array.from({ length: n }, (_, i) => `passengerages%5B${i}%5D=26%3A57%3A`),
    'user_id=0.tripwf',
    'user_currency=EUR',
    'user_domain=com',
    'user_locale=en',
    `travel_mode=${modo}`,
    `default_tab=${modo}`,
    'srpQueryParams=origin_domain%3Dcom'
  ]
  return `https://www.omio.com/growth/search-trigger/search?${params.join('&')}`
}

function formatarDuracaoMin(minutos) {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

// Rotas com dados reais (out/2026) — a fórmula por km erra feio onde não
// existe trem direto (Porto/Lisboa ↔ Madri desde 2020) ou onde há alta
// velocidade barata (Madri–Barcelona, Milão–Roma). `null` = modal inexistente.
// [duração em minutos, preço mínimo €, preço máximo €] por pessoa (carro: por carro).
const ROTAS_CONHECIDAS = {
  'lisboa|porto': { trem: [170, 22, 35], onibus: [210, 8, 20], aviao: [55, 40, 110], carro: [180, 45, 70] },
  'madri|porto': { trem: null, onibus: [510, 30, 55], aviao: [75, 35, 120], carro: [330, 90, 130] },
  'lisboa|madri': { trem: null, onibus: [480, 30, 50], aviao: [75, 35, 120], carro: [370, 100, 140] },
  'barcelona|madri': { trem: [170, 20, 80], onibus: [450, 20, 35], aviao: [75, 40, 110], carro: [360, 90, 130] },
  'barcelona|paris': { trem: [400, 40, 150], onibus: [900, 45, 90], aviao: [110, 40, 130] },
  'madri|paris': { trem: null, aviao: [120, 45, 140] },
  'londres|paris': { trem: [140, 50, 200], onibus: [480, 30, 60], aviao: [75, 50, 150] },
  'amsterdam|paris': { trem: [200, 40, 150], onibus: [450, 25, 50] },
  'florenca|milao': { trem: [115, 20, 60], onibus: [240, 10, 22] },
  'milao|roma': { trem: [180, 25, 90], onibus: [420, 15, 35], aviao: [70, 30, 100] },
  'florenca|roma': { trem: [95, 20, 50], onibus: [210, 8, 20] },
  'milao|paris': { trem: [430, 40, 150], aviao: [90, 40, 120] },
  'barcelona|milao': { trem: null, onibus: [720, 45, 80], aviao: [100, 30, 110] },
  'madri|milao': { trem: null, aviao: [130, 40, 120] },
  'barcelona|lisboa': { trem: null, aviao: [110, 40, 120] },
  'barcelona|porto': { trem: null, aviao: [110, 40, 120] }
}

const chaveRota = (a, b) => [a, b].sort().join('|')

const NOME_MODAL = { aviao: 'Avião', trem: 'Trem', onibus: 'Ônibus', carro: 'Carro' }

// Fórmula por km (fallback para rotas sem dado real).
function estimarPorKm(tipo, km) {
  switch (tipo) {
    case 'aviao':
      return km >= 400 ? [Math.round((km / 750 + 1.5) * 60), Math.max(40, Math.round(km * 0.07)), Math.max(120, Math.round(km * 0.22))] : null
    case 'trem':
      return km < 1800 ? [Math.round((km / 130) * 60), Math.max(20, Math.round(km * 0.10)), Math.max(50, Math.round(km * 0.28))] : null
    case 'onibus':
      return km < 1500 ? [Math.round((km / 70) * 60), Math.max(10, Math.round(km * 0.04)), Math.max(25, Math.round(km * 0.10))] : null
    case 'carro':
      return km < 2500 ? [Math.round((km / 90) * 60), Math.round(km * 0.10), Math.round(km * 0.20)] : null
    default:
      return null
  }
}

// ============================================================
// API principal
// ============================================================
//
// km        — distância em linha reta (Haversine)
// origem    — nome da cidade de partida (ex.: "Paris")
// destino   — nome da cidade de chegada (ex.: "Roma")
// dataIda   — ISO YYYY-MM-DD do dia do trecho (links já abrem nessa data)
// dataVolta — ISO YYYY-MM-DD (opcional; só faz sentido pra round-trip)
// extra     — { slugOrigem, slugDestino, viajantes } para rotas conhecidas e Omio com data
//
// Cada opção traz `precoEstimado` (ponto médio da faixa) — é o valor que entra
// no custo total da viagem quando o modal é escolhido.
export function sugestoesTransporte(km, origem, destino, dataIda, dataVolta, multiplicadorTemporada = 1, extra = {}) {
  const { slugOrigem, slugDestino, viajantes = 1 } = extra
  const ajuste = (v) => Math.round(v * multiplicadorTemporada)
  const conhecida = slugOrigem && slugDestino ? ROTAS_CONHECIDAS[chaveRota(slugOrigem, slugDestino)] : null
  const idA = OMIO_ID[slugOrigem]
  const idB = OMIO_ID[slugDestino]

  const linksDe = (tipo) => {
    const omioData = linkOmioComData(idA, idB, dataIda, { modal: tipo, viajantes })
    if (tipo === 'aviao') {
      return [
        { label: 'Google Flights', url: linkGoogleFlights(origem, destino, dataIda, dataVolta) },
        ...(omioData ? [{ label: 'Omio (voos)', url: omioData }] : [{ label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }])
      ]
    }
    if (tipo === 'carro') {
      return [
        { label: 'Google Maps', url: linkGoogleMaps(origem, destino) },
        { label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }
      ]
    }
    return [
      { label: tipo === 'trem' ? 'Omio (trem)' : 'Omio (ônibus)', url: omioData || linkOmio(origem, destino, tipo) },
      { label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }
    ]
  }

  const opcoes = []
  for (const tipo of ['aviao', 'trem', 'onibus', 'carro']) {
    const dado = conhecida && tipo in conhecida ? conhecida[tipo] : estimarPorKm(tipo, km)
    if (!dado) continue
    const [minutos, min, max] = dado
    const precoMin = ajuste(min)
    const precoMax = ajuste(max)
    opcoes.push({
      tipo,
      nome: NOME_MODAL[tipo],
      duracaoMin: minutos,
      duracaoTexto: formatarDuracaoMin(minutos),
      precoMin,
      precoMax,
      precoEstimado: Math.round((precoMin + precoMax) / 2),
      porCarro: tipo === 'carro',
      dadoReal: Boolean(conhecida && tipo in conhecida),
      recomendado: false,
      links: linksDe(tipo)
    })
  }

  if (opcoes.length > 0) {
    // Recomendado: trem até ~5h (centro a centro, sem aeroporto); senão avião
    // em trajetos longos; senão ônibus.
    const trem = opcoes.find((o) => o.tipo === 'trem')
    const aviao = opcoes.find((o) => o.tipo === 'aviao')
    const onibus = opcoes.find((o) => o.tipo === 'onibus')
    const recomendado =
      (trem && trem.duracaoMin <= 300 && trem) ||
      (aviao && km >= 500 && aviao) ||
      onibus || trem || aviao || opcoes[0]
    recomendado.recomendado = true

    const maisRapida = opcoes.reduce((m, o) => (o.duracaoMin < m.duracaoMin ? o : m), opcoes[0])
    const maisBarata = opcoes
      .filter((o) => !o.porCarro)
      .reduce((m, o) => (o.precoMin < m.precoMin ? o : m), opcoes.find((o) => !o.porCarro) || opcoes[0])
    maisRapida.maisRapida = true
    maisBarata.maisBarata = true
  }

  return opcoes
}
