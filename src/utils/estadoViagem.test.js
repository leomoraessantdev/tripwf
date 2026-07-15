import { describe, it, expect } from 'vitest'
import { ESTADO_INICIAL, normalizarEstado } from './estadoViagem.js'

describe('normalizarEstado', () => {
  it('entrada nula/inválida vira estado inicial', () => {
    expect(normalizarEstado(null)).toEqual(ESTADO_INICIAL)
    expect(normalizarEstado(undefined)).toEqual(ESTADO_INICIAL)
    expect(normalizarEstado('lixo')).toEqual(ESTADO_INICIAL)
    expect(normalizarEstado([1, 2])).toEqual(ESTADO_INICIAL)
  })

  it('objeto vazio recebe todos os defaults', () => {
    expect(normalizarEstado({})).toEqual(ESTADO_INICIAL)
  })

  it('não retorna a mesma referência de ESTADO_INICIAL', () => {
    expect(normalizarEstado(null)).not.toBe(ESTADO_INICIAL)
  })

  it('migra estado salvo por versão antiga (sem checklistConcluidos)', () => {
    const antigo = {
      orcamentoDiario: 150,
      viajantes: 2,
      cidadesSelecionadas: [
        { slug: 'paris', dias: 4, atracoesEscolhidas: ['a1'], hospedagemEscolhida: 'h1' }
      ]
      // sem origem, dataIda, dataVolta, estilo, checklistConcluidos
    }
    const norm = normalizarEstado(antigo)
    expect(norm.orcamentoDiario).toBe(150)
    expect(norm.viajantes).toBe(2)
    expect(norm.checklistConcluidos).toEqual([])
    expect(norm.origem).toBe('')
    expect(norm.estilo).toBe('conforto')
    expect(norm.cidadesSelecionadas).toEqual(antigo.cidadesSelecionadas)
  })

  it('aplica clamps em viajantes e dias', () => {
    const norm = normalizarEstado({
      viajantes: 99,
      cidadesSelecionadas: [{ slug: 'roma', dias: 99 }, { slug: 'paris', dias: 0 }]
    })
    expect(norm.viajantes).toBe(10)
    expect(norm.cidadesSelecionadas[0].dias).toBe(30)
    // 0 é falsy → cai no default 3 (mesma regra de decodificarRoteiro)
    expect(norm.cidadesSelecionadas[1].dias).toBe(3)
  })

  it('descarta cidades sem slug e saneia campos internos', () => {
    const norm = normalizarEstado({
      cidadesSelecionadas: [
        null,
        { dias: 3 },
        { slug: 'roma', atracoesEscolhidas: 'não-é-array', hospedagemEscolhida: 42 }
      ]
    })
    expect(norm.cidadesSelecionadas).toHaveLength(1)
    expect(norm.cidadesSelecionadas[0]).toEqual({
      slug: 'roma',
      dias: 3,
      atracoesEscolhidas: [],
      hospedagemEscolhida: null
    })
  })

  it('rejeita estilo e datas inválidos', () => {
    const norm = normalizarEstado({ estilo: 'mochilao', dataIda: '2026-6-1', dataVolta: 'abc' })
    expect(norm.estilo).toBe('conforto')
    expect(norm.dataIda).toBe('')
    expect(norm.dataVolta).toBe('')
  })

  it('aceita estilo e datas válidos', () => {
    const norm = normalizarEstado({ estilo: 'luxo', dataIda: '2026-06-01', dataVolta: '2026-06-10' })
    expect(norm.estilo).toBe('luxo')
    expect(norm.dataIda).toBe('2026-06-01')
    expect(norm.dataVolta).toBe('2026-06-10')
  })

  it('trunca origem em 80 caracteres', () => {
    const norm = normalizarEstado({ origem: 'x'.repeat(200) })
    expect(norm.origem).toHaveLength(80)
  })

  it('orçamento inválido cai no default', () => {
    expect(normalizarEstado({ orcamentoDiario: -5 }).orcamentoDiario).toBe(100)
    expect(normalizarEstado({ orcamentoDiario: 'abc' }).orcamentoDiario).toBe(100)
  })

  it('filtra ids não-string do checklist', () => {
    const norm = normalizarEstado({ checklistConcluidos: ['ok', 42, null, 'outro'] })
    expect(norm.checklistConcluidos).toEqual(['ok', 'outro'])
  })
})
