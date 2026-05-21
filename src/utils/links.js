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

export function linkVoo(cidade) {
  const q = enc(cidade)
  return `https://www.google.com/travel/flights?q=${q}`
}
