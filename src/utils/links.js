// Helpers para gerar URLs de busca em plataformas reais.
// Usamos URLs de busca (não páginas específicas) para garantir que o link
// nunca quebre — a página de resultados sempre carrega.
//
// Quando o usuário já informou datas/viajantes na viagem, esses parâmetros
// são propagados pra que o destino já abra com checkin/checkout/data pré-
// preenchidos. GetYourGuide aceita date_from/date_to; Booking aceita
// checkin/checkout/group_adults; Google Flights aceita data via query natural.

const enc = (s) => encodeURIComponent(s).replace(/%20/g, '+')

function paraIso(d) {
  if (!d) return ''
  if (typeof d === 'string') return d
  if (d instanceof Date) {
    const a = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dia = String(d.getDate()).padStart(2, '0')
    return `${a}-${m}-${dia}`
  }
  return ''
}

export function linkIngresso(nome, cidade, opts = {}) {
  const q = enc(`${nome} ${cidade}`)
  let url = `https://www.getyourguide.com/s/?q=${q}`
  const inicio = paraIso(opts.dataInicio)
  const fim = paraIso(opts.dataFim)
  if (inicio) url += `&date_from=${inicio}`
  if (fim) url += `&date_to=${fim}`
  return url
}

function diasEntre(inicioIso, fimIso) {
  const [a1, m1, d1] = inicioIso.split('-').map(Number)
  const [a2, m2, d2] = fimIso.split('-').map(Number)
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000)
}

// Parâmetros de estadia da ALL Accor: dateIn, nights e compositions (adultos
// no quarto). Grupos maiores que 3 abrem com 2 adultos — o número de quartos
// se ajusta no próprio site (o custo do TripWF já conta todos os quartos).
function paramsAccor(opts) {
  const checkin = paraIso(opts.dataInicio)
  const checkout = paraIso(opts.dataFim)
  const params = []
  if (checkin) {
    params.push(`dateIn=${checkin}`)
    const noites = checkout ? diasEntre(checkin, checkout) : 0
    if (noites > 0) params.push(`nights=${noites}`)
  }
  if (opts.viajantes) {
    const v = Math.max(1, Number(opts.viajantes) || 1)
    params.push(`compositions=${v <= 3 ? v : 2}`)
  }
  return params.length ? `?${params.join('&')}` : ''
}

// ALL Accor — página de reserva DO HOTEL (código de 4 caracteres). Com datas,
// abre direto nas tarifas da estadia; sem datas, abre a página do hotel.
// Reservar direto na Accor costuma sair mais barato que em agências: tarifa
// de membro ALL (gratuita) + garantia de melhor preço.
export function linkHotelAccor(codigo, opts = {}) {
  const params = paramsAccor(opts)
  if (!params.includes('dateIn')) return `https://all.accor.com/hotel/${codigo}/index.pt-br.shtml`
  return `https://all.accor.com/booking/pt-br/accor/hotel/${codigo}${params}`
}

// ALL Accor — busca por destino ("madrid-spain"), fallback sem código de hotel.
export function linkReservaAccor(destino, opts = {}) {
  return `https://all.accor.com/booking/pt-br/accor/hotels/${destino}${paramsAccor(opts)}`
}

export function linkReserva(nome, cidade, opts = {}) {
  const q = enc(`${nome}, ${cidade}`)
  let url = `https://www.booking.com/searchresults.html?ss=${q}`
  const checkin = paraIso(opts.dataInicio)
  const checkout = paraIso(opts.dataFim)
  if (checkin) url += `&checkin=${checkin}`
  if (checkout) url += `&checkout=${checkout}`
  if (opts.viajantes) {
    const n = Math.max(1, Math.min(30, Number(opts.viajantes) || 1))
    url += `&group_adults=${n}`
  }
  return url
}

// Booking — todos os hotéis da cidade nas datas, do mais barato ao mais caro.
export function linkBuscaBooking(cidade, pais, opts = {}) {
  let url = `https://www.booking.com/searchresults.html?ss=${enc(`${cidade}, ${pais}`)}`
  const checkin = paraIso(opts.dataInicio)
  const checkout = paraIso(opts.dataFim)
  if (checkin) url += `&checkin=${checkin}`
  if (checkout) url += `&checkout=${checkout}`
  if (opts.viajantes) {
    const n = Math.max(1, Math.min(30, Number(opts.viajantes) || 1))
    url += `&group_adults=${n}&no_rooms=${Math.ceil(n / 2)}`
  }
  return `${url}&order=price`
}
