// Câmbio fixo apenas para exibição (1 EUR ≈ R$ 5,80).
const CAMBIO_BRL = 5.8

export const formatarEUR = (valor) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(valor)

export const formatarBRL = (valorEUR) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(valorEUR * CAMBIO_BRL)

export const formatarDuracao = (dias) => {
  if (dias === 1) return '1 dia'
  return `${dias} dias`
}

export const formatarPreco = (valor) => {
  if (!valor || valor === 0) return 'Gratuito'
  return formatarEUR(valor)
}
