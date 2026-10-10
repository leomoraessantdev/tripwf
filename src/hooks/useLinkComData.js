// Hook que enriquece links de ingresso/reserva com as datas reais da viagem
// (e nº de viajantes pro Booking) QUANDO a cidade do item está no roteiro
// atual. Se não estiver, cai no link pré-computado em data/cidades.js — que
// segue funcionando sem datas como um link de busca genérico.

import { useViagem } from '../context/ViagemContext.jsx'
import { linkIngresso, linkReserva, linkReservaAccor, linkHotelAccor } from '../utils/links.js'

function somarUmDia(data) {
  if (!data) return null
  const d = new Date(data)
  d.setDate(d.getDate() + 1)
  return d
}

export function useLinkIngressoComData(atracao) {
  const { dadosViagem } = useViagem()
  if (!atracao) return ''
  // Bate e volta aponta para a operadora mais barata — sem parâmetro de data.
  if (atracao.bateVolta) return atracao.linkIngresso
  const noRoteiro = dadosViagem.find((d) => d.cidade?.nome === atracao.cidade)
  if (!noRoteiro?.dataInicio) return atracao.linkIngresso
  return linkIngresso(atracao.nome, atracao.cidade, {
    dataInicio: noRoteiro.dataInicio,
    dataFim: noRoteiro.dataFim
  })
}

export function useLinkReservaComData(hospedagem) {
  const { dadosViagem, viajantes } = useViagem()
  if (!hospedagem) return ''
  const noRoteiro = dadosViagem.find((d) => d.cidade?.nome === hospedagem.cidade)
  if (!noRoteiro?.dataInicio) return hospedagem.linkReserva
  // Checkout = dia seguinte ao último dia na cidade (sai pela manhã).
  const opts = {
    dataInicio: noRoteiro.dataInicio,
    dataFim: somarUmDia(noRoteiro.dataFim),
    viajantes
  }
  if (hospedagem.rede === 'Accor') {
    return hospedagem.codigo
      ? linkHotelAccor(hospedagem.codigo, opts)
      : linkReservaAccor(noRoteiro.cidade.accorDestino, opts)
  }
  return linkReserva(hospedagem.nome, hospedagem.cidade, opts)
}
