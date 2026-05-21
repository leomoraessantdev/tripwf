import { useViagem } from '../context/ViagemContext.jsx'

// Hook conveniente que expõe o breakdown de custo da viagem em tempo real.
// O cálculo já é memoizado dentro do ViagemContext (em totais).
//
// Retorna:
//   accommodation  — soma de hospedagem (€/noite × dias)
//   attractions    — soma dos ingressos das atrações escolhidas
//   food           — €40 × dias × viajantes (estimativa)
//   transport      — €80 × (cidades - 1) (estimativa de trem regional)
//   total          — accommodation + attractions + food + transport
//   perPerson      — total / viajantes
//   perDay         — total / dias totais
//   totalDays, travelers, citiesCount — auxiliares
export function useTripCost() {
  const { totais, viajantes, cidadesSelecionadas } = useViagem()
  return {
    accommodation: totais.accommodation,
    attractions: totais.attractions,
    food: totais.food,
    transport: totais.transport,
    total: totais.custoTotal,
    perPerson: totais.perPerson,
    perDay: totais.custoMedioPorDia,
    totalDays: totais.totalDias,
    travelers: viajantes,
    citiesCount: cidadesSelecionadas.length
  }
}
