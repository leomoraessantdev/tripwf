// Distância em linha reta entre duas coordenadas (km), via fórmula de Haversine.
// Raio médio da Terra = 6371 km.

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const toRad = (g) => (g * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export const formatarDistancia = (km) =>
  new Intl.NumberFormat('pt-BR').format(km) + ' km'
