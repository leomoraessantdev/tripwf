// Unidades de hospedagem para o grupo: quarto de hotel acomoda 2 pessoas,
// apartamento até 4, hostel cobra por cama. Usado no custo da viagem
// (ViagemContext) e nos rótulos "× N quartos" dos cards.
export function unidadesHospedagem(tipo, viajantes) {
  const v = Math.max(1, viajantes || 1)
  if (tipo === 'Hostel') return v
  if (tipo === 'Apartamento') return Math.ceil(v / 4)
  return Math.ceil(v / 2)
}

export function rotuloUnidade(tipo, n) {
  if (tipo === 'Hostel') return n === 1 ? 'cama' : 'camas'
  if (tipo === 'Apartamento') return n === 1 ? 'apartamento' : 'apartamentos'
  return n === 1 ? 'quarto' : 'quartos'
}
