import { describe, it, expect } from 'vitest'
import { linkReservaAccor, linkBuscaBooking } from './links.js'
import { linkOmio, sugestoesTransporte } from './transportes.js'

describe('linkReservaAccor', () => {
  it('sem datas abre a busca do destino', () => {
    expect(linkReservaAccor('madrid-spain')).toBe(
      'https://all.accor.com/booking/pt-br/accor/hotels/madrid-spain'
    )
  })

  it('converte checkin/checkout em dateIn + nights e viajantes em compositions', () => {
    const url = linkReservaAccor('porto-portugal', {
      dataInicio: '2027-05-10',
      dataFim: '2027-05-13',
      viajantes: 2
    })
    expect(url).toBe(
      'https://all.accor.com/booking/pt-br/accor/hotels/porto-portugal?dateIn=2027-05-10&nights=3&compositions=2'
    )
  })

  it('aceita Date e atravessa a virada de mês', () => {
    const url = linkReservaAccor('milan-italy', {
      dataInicio: new Date(2027, 4, 30),
      dataFim: new Date(2027, 5, 2)
    })
    expect(url).toContain('dateIn=2027-05-30&nights=3')
  })
})

describe('linkOmio', () => {
  it('usa o nome em inglês da cidade e o tipo de transporte', () => {
    expect(linkOmio('Milão', 'Roma', 'trem')).toBe('https://www.omio.com/trains/milan/rome')
    expect(linkOmio('Porto', 'Lisboa', 'onibus')).toBe('https://www.omio.com/buses/porto/lisbon')
  })

  it('trem e ônibus entre cidades apontam para a Omio', () => {
    const opcoes = sugestoesTransporte(300, 'Porto', 'Lisboa')
    const trem = opcoes.find((o) => o.tipo === 'trem')
    const onibus = opcoes.find((o) => o.tipo === 'onibus')
    expect(trem.links[0].url).toBe('https://www.omio.com/trains/porto/lisbon')
    expect(onibus.links[0].url).toBe('https://www.omio.com/buses/porto/lisbon')
  })
})

describe('linkBuscaBooking', () => {
  it('busca a cidade inteira nas datas, com quartos para o grupo e do mais barato', () => {
    const url = linkBuscaBooking('Porto', 'Portugal', {
      dataInicio: '2027-05-23',
      dataFim: '2027-05-27',
      viajantes: 3
    })
    expect(url).toBe(
      'https://www.booking.com/searchresults.html?ss=Porto%2C+Portugal&checkin=2027-05-23&checkout=2027-05-27&group_adults=3&no_rooms=2&order=price'
    )
  })
})
