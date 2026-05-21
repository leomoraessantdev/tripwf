// Sugestões de transporte entre duas cidades + URLs de plataformas reais.
//
// HISTÓRICO DE BUGS RESOLVIDOS:
// - Skyscanner exige códigos IATA na URL → 404 com nome de cidade. Removido.
// - Kayak.com.br filtra para rotas brasileiras → não mostra voos europeus. Removido.
// - Omio mudou estrutura de URL (search-frontend) → página em branco. Substituído.
//
// SOLUÇÃO ATUAL: usar URLs comprovadamente estáveis que aceitam nome de cidade
// e/ou pré-preenchem busca. Rome2Rio é o coringa universal (sempre funciona).

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
// Coringa universal: sempre carrega e mostra todas as opções (avião/trem/ônibus/carro).
function linkRome2Rio(a, b) {
  return `https://www.rome2rio.com/map/${enc(a)}/${enc(b)}`
}

// Trainline — formato slug-based (train-times/cidade-to-cidade) que sempre carrega
function linkTrainline(a, b) {
  return `https://www.thetrainline.com/train-times/${slug(a)}-to-${slug(b)}`
}

// FlixBus — formato slug-based (city-to-city/cidade-cidade) que sempre carrega
function linkFlixBus(a, b) {
  return `https://global.flixbus.com/bus/${slug(a)}-${slug(b)}`
}

// Google Maps directions — sempre funciona pra carro
function linkGoogleMaps(a, b) {
  return `https://www.google.com/maps/dir/${enc(a)}/${enc(b)}`
}

function formatarDuracaoMin(minutos) {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

// ============================================================
// API principal
// ============================================================
//
// km        — distância em linha reta (Haversine)
// origem    — nome da cidade de partida (ex.: "Paris")
// destino   — nome da cidade de chegada (ex.: "Roma")
// dataIda   — ISO YYYY-MM-DD (data específica daquele trecho ou data geral)
// dataVolta — ISO YYYY-MM-DD (opcional; só faz sentido pra round-trip)
//
export function sugestoesTransporte(km, origem, destino, dataIda, dataVolta, multiplicadorTemporada = 1) {
  const opcoes = []
  const ajuste = (v) => Math.round(v * multiplicadorTemporada)

  // Avião — viável a partir de ~400km
  if (km >= 400) {
    const minutos = Math.round((km / 750 + 1.5) * 60)
    const precoMin = ajuste(Math.max(40, Math.round(km * 0.07)))
    const precoMax = ajuste(Math.max(120, Math.round(km * 0.22)))
    opcoes.push({
      tipo: 'aviao',
      nome: 'Avião',
      duracaoMin: minutos,
      duracaoTexto: formatarDuracaoMin(minutos),
      precoMin,
      precoMax,
      recomendado: km >= 800,
      links: [
        { label: 'Google Flights', url: linkGoogleFlights(origem, destino, dataIda, dataVolta) },
        { label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }
      ]
    })
  }

  // Trem
  if (km < 1800) {
    const minutos = Math.round((km / 130) * 60)
    const precoMin = ajuste(Math.max(20, Math.round(km * 0.10)))
    const precoMax = ajuste(Math.max(50, Math.round(km * 0.28)))
    opcoes.push({
      tipo: 'trem',
      nome: 'Trem',
      duracaoMin: minutos,
      duracaoTexto: formatarDuracaoMin(minutos),
      precoMin,
      precoMax,
      recomendado: km >= 200 && km < 700,
      links: [
        { label: 'Trainline', url: linkTrainline(origem, destino) },
        { label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }
      ]
    })
  }

  // Ônibus
  if (km < 1500) {
    const minutos = Math.round((km / 70) * 60)
    const precoMin = ajuste(Math.max(10, Math.round(km * 0.04)))
    const precoMax = ajuste(Math.max(25, Math.round(km * 0.10)))
    opcoes.push({
      tipo: 'onibus',
      nome: 'Ônibus',
      duracaoMin: minutos,
      duracaoTexto: formatarDuracaoMin(minutos),
      precoMin,
      precoMax,
      recomendado: false,
      links: [
        { label: 'FlixBus', url: linkFlixBus(origem, destino) },
        { label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }
      ]
    })
  }

  // Carro
  if (km < 2500) {
    const minutos = Math.round((km / 90) * 60)
    const precoMin = ajuste(Math.round(km * 0.10))
    const precoMax = ajuste(Math.round(km * 0.20))
    opcoes.push({
      tipo: 'carro',
      nome: 'Carro',
      duracaoMin: minutos,
      duracaoTexto: formatarDuracaoMin(minutos),
      precoMin,
      precoMax,
      recomendado: false,
      links: [
        { label: 'Google Maps', url: linkGoogleMaps(origem, destino) },
        { label: 'Rome2Rio', url: linkRome2Rio(origem, destino) }
      ]
    })
  }

  if (opcoes.length > 0) {
    const maisRapida = opcoes.reduce((m, o) => (o.duracaoMin < m.duracaoMin ? o : m), opcoes[0])
    const maisBarata = opcoes.reduce((m, o) => (o.precoMin < m.precoMin ? o : m), opcoes[0])
    maisRapida.maisRapida = true
    maisBarata.maisBarata = true
  }

  return opcoes
}
