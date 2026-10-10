import { describe, it, expect } from 'vitest'
import { calcularTrechos, opcaoSelecionada, custoOpcao, custoTransporte, chaveTrecho } from './trechos.js'
import { computarDatasCidades } from './datas.js'
import { buscarCidade } from '../data/cidades.js'
import { linkOmioComData, OMIO_ID } from './transportes.js'
import { linkHotelAccor } from './links.js'
import { unidadesHospedagem } from './hospedagem.js'
import { normalizarEstado } from './estadoViagem.js'

// Ida 22/05/2027: Lisboa 1 dia, Porto 4 dias, Madri 3 dias.
function roteiroExemplo() {
  const { cidadesComDatas } = computarDatasCidades('2027-05-22', [
    { slug: 'lisboa', dias: 1 },
    { slug: 'porto', dias: 4 },
    { slug: 'madri', dias: 3 }
  ])
  return cidadesComDatas.map((c) => ({ ...c, cidade: buscarCidade(c.slug) }))
}

describe('trechos do roteiro', () => {
  const trechos = calcularTrechos(roteiroExemplo(), 2)

  it('data de cada trecho = dia seguinte ao último dia na cidade anterior', () => {
    expect(trechos.map((t) => t.chave)).toEqual(['lisboa>porto', 'porto>madri'])
    expect(trechos[0].data.getDate()).toBe(23)
    expect(trechos[1].data.getDate()).toBe(27)
  })

  it('links de trem/ônibus abrem a Omio já na data do trecho e com 2 passageiros', () => {
    const trem = trechos[0].opcoes.find((o) => o.tipo === 'trem')
    expect(trem.links[0].url).toContain('departure_date=23%2F05%2F2027')
    expect(trem.links[0].url).toContain(`departure_fk=${OMIO_ID.lisboa}`)
    expect(trem.links[0].url).toContain(`arrival_fk=${OMIO_ID.porto}`)
    expect(trem.links[0].url.match(/passengerages/g)).toHaveLength(2)
    const aviao = trechos[1].opcoes.find((o) => o.tipo === 'aviao')
    expect(aviao.links[0].url).toContain(encodeURIComponent('on 2027-05-27'))
  })

  it('usa a rota real: Porto → Madri não tem trem direto', () => {
    const tipos = trechos[1].opcoes.map((o) => o.tipo)
    expect(tipos).not.toContain('trem')
    expect(tipos).toContain('onibus')
    expect(trechos[1].opcoes.every((o) => o.dadoReal)).toBe(true)
  })

  it('sem escolha usa o recomendado; a escolha do usuário muda o custo', () => {
    const t = trechos[0]
    expect(opcaoSelecionada(t, {}).recomendado).toBe(true)
    const onibus = opcaoSelecionada(t, { [chaveTrecho('lisboa', 'porto')]: 'onibus' })
    expect(onibus.tipo).toBe('onibus')
    const padrao = custoTransporte(trechos, {}, 2)
    const comOnibus = custoTransporte(trechos, { 'lisboa>porto': 'onibus' }, 2)
    expect(comOnibus).toBeLessThan(padrao)
  })

  it('transporte público cobra por pessoa; carro por veículo', () => {
    const t = trechos[0]
    const trem = t.opcoes.find((o) => o.tipo === 'trem')
    const carro = t.opcoes.find((o) => o.tipo === 'carro')
    expect(custoOpcao(trem, 3)).toBe(trem.precoEstimado * 3)
    expect(custoOpcao(carro, 3)).toBe(carro.precoEstimado)
  })
})

describe('Omio com data', () => {
  it('sem ID ou sem data devolve null (cai na página de rota)', () => {
    expect(linkOmioComData(null, 1, '2027-05-23')).toBeNull()
    expect(linkOmioComData(1, 2, '')).toBeNull()
  })
})

describe('reserva Accor por hotel', () => {
  it('com datas abre a reserva do hotel com check-in, noites e hóspedes', () => {
    const url = linkHotelAccor('A7J9', { dataInicio: '2027-05-23', dataFim: '2027-05-27', viajantes: 2 })
    expect(url).toBe('https://all.accor.com/booking/pt-br/accor/hotel/A7J9?dateIn=2027-05-23&nights=4&compositions=2')
  })

  it('sem datas abre a página do hotel', () => {
    expect(linkHotelAccor('A7J9')).toBe('https://all.accor.com/hotel/A7J9/index.pt-br.shtml')
  })

  it('todo hotel Accor do catálogo tem código', () => {
    const { cidades } = { cidades: ['paris', 'lisboa', 'porto', 'madri', 'milao'].map(buscarCidade) }
    const semCodigo = cidades.flatMap((c) => c.hospedagens).filter((h) => h.rede === 'Accor' && !h.codigo)
    expect(semCodigo).toEqual([])
  })
})

describe('custo de hospedagem para o grupo', () => {
  it('quarto de hotel para 2, apartamento para 4, hostel por cama', () => {
    expect(unidadesHospedagem('Hotel', 2)).toBe(1)
    expect(unidadesHospedagem('Hotel', 3)).toBe(2)
    expect(unidadesHospedagem('Apartamento', 4)).toBe(1)
    expect(unidadesHospedagem('Hostel', 3)).toBe(3)
  })
})

describe('estado salvo', () => {
  it('guarda só escolhas de transporte válidas', () => {
    const norm = normalizarEstado({
      transportesEscolhidos: { 'lisboa>porto': 'trem', 'x>y': 'foguete', lixo: 'trem' }
    })
    expect(norm.transportesEscolhidos).toEqual({ 'lisboa>porto': 'trem' })
  })
})
