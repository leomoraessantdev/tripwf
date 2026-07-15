import { describe, it, expect } from 'vitest'
import { computarDatasCidades, formatarRange } from './datas.js'

const CIDADES = [
  { slug: 'paris', dias: 4 },
  { slug: 'roma', dias: 3 }
]

describe('computarDatasCidades', () => {
  it('sem dataIda: cidades sem datas, volta null, duração 0', () => {
    const r = computarDatasCidades('', CIDADES)
    expect(r.dataVolta).toBeNull()
    expect(r.duracaoTotal).toBe(0)
    expect(r.cidadesComDatas).toHaveLength(2)
    expect(r.cidadesComDatas[0].dataInicio).toBeNull()
    expect(r.cidadesComDatas[0].dataFim).toBeNull()
  })

  it('distribui datas sequenciais por cidade', () => {
    const r = computarDatasCidades('2026-06-01', CIDADES)
    const [paris, roma] = r.cidadesComDatas
    // Paris: 01/06 → 04/06 (4 dias)
    expect(paris.dataInicio).toEqual(new Date(2026, 5, 1))
    expect(paris.dataFim).toEqual(new Date(2026, 5, 4))
    // Roma: 05/06 → 07/06 (3 dias)
    expect(roma.dataInicio).toEqual(new Date(2026, 5, 5))
    expect(roma.dataFim).toEqual(new Date(2026, 5, 7))
    // Volta: dia seguinte ao fim da última cidade
    expect(r.dataVolta).toEqual(new Date(2026, 5, 8))
    expect(r.duracaoTotal).toBe(7)
  })

  it('vira o mês corretamente', () => {
    const r = computarDatasCidades('2026-06-29', [{ slug: 'paris', dias: 5 }])
    expect(r.cidadesComDatas[0].dataFim).toEqual(new Date(2026, 6, 3)) // 03/07
    expect(r.dataVolta).toEqual(new Date(2026, 6, 4))
  })

  it('cidade com dias < 1 conta como 1 dia no calendário', () => {
    const r = computarDatasCidades('2026-06-01', [{ slug: 'paris', dias: 0 }])
    expect(r.cidadesComDatas[0].dataInicio).toEqual(r.cidadesComDatas[0].dataFim)
  })

  it('data inválida tratada como ausente', () => {
    expect(computarDatasCidades('lixo', CIDADES).dataVolta).toBeNull()
  })
})

describe('formatarRange', () => {
  it('vazio quando falta uma das pontas', () => {
    expect(formatarRange(null, new Date())).toBe('')
    expect(formatarRange(new Date(), null)).toBe('')
  })

  it('formata dd/mm → dd/mm', () => {
    const r = formatarRange(new Date(2026, 5, 1), new Date(2026, 5, 4))
    expect(r).toBe('01/06 → 04/06')
  })
})
