import { describe, it, expect } from 'vitest'
import { calcularEconomia } from './economiaCalculada.js'

// Fixtures sintéticas com slug fora de EPOCA_CIDADE e sem datas →
// componente de temporada zera e o teste fica independente do banco real.
const HOSPEDAGENS = [
  { id: 'h-barato', nome: 'Hostel Central', precoNoite: 50 },
  { id: 'h-caro', nome: 'Grand Hotel', precoNoite: 150 }
]
const ATRACOES_BANCO = [
  { id: 'a-gratis', nome: 'Parque', preco: 0 },
  { id: 'a-media', nome: 'Museu', preco: 20 },
  { id: 'a-cara', nome: 'Palácio', preco: 30 }
]

function cidadeFixture() {
  return {
    slug: 'cidade-fake',
    nome: 'Cidade Fake',
    hospedagens: HOSPEDAGENS,
    atracoes: ATRACOES_BANCO
  }
}

// Espelha a montagem de dadosViagem no ViagemContext
function dadoViagem({ hospedagem, atracoes, dias, alimentacao }) {
  const custoHospedagem = hospedagem ? hospedagem.precoNoite * dias : 0
  const custoAtracoes = atracoes.reduce((s, a) => s + a.preco, 0)
  return {
    cidade: cidadeFixture(),
    dias,
    dataInicio: null,
    hospedagem,
    atracoes,
    custoHospedagem,
    custoAtracoes,
    custoAlimentacao: alimentacao
  }
}

function totaisDe(dados) {
  const accommodation = dados.reduce((s, d) => s + d.custoHospedagem, 0)
  const attractions = dados.reduce((s, d) => s + d.custoAtracoes, 0)
  const food = dados.reduce((s, d) => s + d.custoAlimentacao, 0)
  const transport = Math.max(0, dados.length - 1) * 80
  return { food, custoTotal: accommodation + attractions + food + transport }
}

describe('calcularEconomia', () => {
  it('roteiro vazio retorna null', () => {
    expect(calcularEconomia({ dadosViagem: [], totais: {}, dataIda: '' })).toBeNull()
    expect(calcularEconomia({ dadosViagem: null, totais: {}, dataIda: '' })).toBeNull()
  })

  it('calcula baseline e economia para roteiro de 1 cidade', () => {
    const dados = [dadoViagem({
      hospedagem: HOSPEDAGENS[0],           // barato: 50/noite
      atracoes: [ATRACOES_BANCO[0], ATRACOES_BANCO[1]], // gratis + 20
      dias: 2,
      alimentacao: 80
    })]
    const r = calcularEconomia({ dadosViagem: dados, totais: totaisDe(dados), dataIda: '' })

    // Hospedagem: baseline 150*2*1.2=360 vs real 100 → 260
    expect(r.breakdown.hospedagem).toBe(260)
    // Atrações: top-2 pagas (30+20)=50 vs real 20 → 30
    expect(r.breakdown.atracoes).toBe(30)
    // 1 cidade → sem trechos
    expect(r.breakdown.transporte).toBe(0)
    // Sem data → sem componente de temporada
    expect(r.breakdown.temporada).toBe(0)
    // Total: baseline (360+50+0+80=490) − atual (100+20+80=200) = 290
    expect(r.baselineTotal).toBe(490)
    expect(r.atualTotal).toBe(200)
    expect(r.economiaTotal).toBe(290)
    expect(r.indicador).toBe('excelente')
    // Agência = baseline × 1.15
    expect(r.agenciaTotal).toBe(Math.round(490 * 1.15))
  })

  it('conta trechos de transporte entre cidades (baseline 120 vs real 80)', () => {
    const base = { hospedagem: null, atracoes: [], dias: 2, alimentacao: 50 }
    const dados = [dadoViagem(base), dadoViagem(base), dadoViagem(base)]
    const r = calcularEconomia({ dadosViagem: dados, totais: totaisDe(dados), dataIda: '' })
    expect(r.breakdown.transporte).toBe(2 * (120 - 80))
  })

  it('sugere trocar hotel caro pelo mais barato', () => {
    const dados = [dadoViagem({
      hospedagem: HOSPEDAGENS[1],  // caro: 150/noite
      atracoes: [],
      dias: 2,
      alimentacao: 80
    })]
    const r = calcularEconomia({ dadosViagem: dados, totais: totaisDe(dados), dataIda: '' })
    expect(r.topSugestao).not.toBeNull()
    expect(r.topSugestao.economia).toBe((150 - 50) * 2)
    expect(r.topSugestao.hotelAlternativo).toBe('Hostel Central')
  })

  it('não sugere troca quando o usuário já está no hotel mais barato', () => {
    const dados = [dadoViagem({
      hospedagem: HOSPEDAGENS[0],
      atracoes: [],
      dias: 2,
      alimentacao: 80
    })]
    const r = calcularEconomia({ dadosViagem: dados, totais: totaisDe(dados), dataIda: '' })
    expect(r.topSugestao).toBeNull()
  })

  it('badge de atrações gratuitas conta certo', () => {
    const dados = [dadoViagem({
      hospedagem: null,
      atracoes: [ATRACOES_BANCO[0]],
      dias: 2,
      alimentacao: 50
    })]
    const r = calcularEconomia({ dadosViagem: dados, totais: totaisDe(dados), dataIda: '' })
    expect(r.badges).toContain('1 atração gratuita no roteiro')
  })
})
