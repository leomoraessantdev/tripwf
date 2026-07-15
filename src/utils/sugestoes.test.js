import { describe, it, expect } from 'vitest'
import { sugerirEscolhas, sugerirOrdemDia } from './sugestoes.js'

const CIDADE = {
  slug: 'teste',
  hospedagens: [
    { id: 'hostel', tipo: 'Hostel', precoNoite: 30 },
    { id: 'apto', tipo: 'Apartamento', precoNoite: 70 },
    { id: 'hotel-medio', tipo: 'Hotel', precoNoite: 120 },
    { id: 'hotel-luxo', tipo: 'Hotel', precoNoite: 250 }
  ],
  atracoes: [
    { id: 'gratis-1', nome: 'Parque', categoria: 'Parque', preco: 0 },
    { id: 'gratis-2', nome: 'Bairro', categoria: 'Bairro', preco: 0 },
    { id: 'museu', nome: 'Museu', categoria: 'Museu', preco: 20 },
    { id: 'monumento', nome: 'Monumento', categoria: 'Monumento', preco: 25 },
    { id: 'premium', nome: 'Palácio', categoria: 'Histórico', preco: 60 }
  ]
}

describe('sugerirEscolhas — hospedagem', () => {
  it('econômico prefere hostel', () => {
    expect(sugerirEscolhas(CIDADE, 3, 'economico', 100).hospedagemId).toBe('hostel')
  })

  it('luxo prefere o hotel mais caro', () => {
    expect(sugerirEscolhas(CIDADE, 3, 'luxo', 100).hospedagemId).toBe('hotel-luxo')
  })

  it('conforto prefere apartamento', () => {
    expect(sugerirEscolhas(CIDADE, 3, 'conforto', 100).hospedagemId).toBe('apto')
  })

  it('cidade sem hospedagens retorna null', () => {
    expect(sugerirEscolhas({ ...CIDADE, hospedagens: [] }, 3, 'conforto', 100).hospedagemId).toBeNull()
  })
})

describe('sugerirEscolhas — atrações', () => {
  it('econômico prioriza gratuitas e respeita teto de 25% do orçamento', () => {
    const { atracoesIds } = sugerirEscolhas(CIDADE, 2, 'economico', 40)
    // teto = 40 * 2 * 0.25 = €20 → gratuitas + museu (20) cabem; monumento/premium não
    expect(atracoesIds).toContain('gratis-1')
    expect(atracoesIds).toContain('gratis-2')
    expect(atracoesIds).not.toContain('premium')
    const custo = atracoesIds
      .map((id) => CIDADE.atracoes.find((a) => a.id === id).preco)
      .reduce((s, p) => s + p, 0)
    expect(custo).toBeLessThanOrEqual(20)
  })

  it('luxo prioriza as mais caras', () => {
    const { atracoesIds } = sugerirEscolhas(CIDADE, 2, 'luxo', 100)
    expect(atracoesIds[0]).toBe('premium')
  })

  it('quantidade cresce com dias (~1.2/dia, mínimo 2)', () => {
    expect(sugerirEscolhas(CIDADE, 1, 'conforto', 100).atracoesIds.length).toBe(2)
    expect(sugerirEscolhas(CIDADE, 4, 'conforto', 100).atracoesIds.length).toBe(5)
  })

  it('é determinístico — mesma entrada, mesma saída', () => {
    const a = sugerirEscolhas(CIDADE, 3, 'conforto', 100)
    const b = sugerirEscolhas(CIDADE, 3, 'conforto', 100)
    expect(a).toEqual(b)
  })
})

describe('sugerirOrdemDia', () => {
  it('vazio para entrada vazia/inválida', () => {
    expect(sugerirOrdemDia([])).toEqual([])
    expect(sugerirOrdemDia(null)).toEqual([])
  })

  it('atribui períodos pela categoria (monumento manhã, gastronomia noite)', () => {
    const ordem = sugerirOrdemDia([
      { id: 'g', nome: 'Restaurante', categoria: 'Gastronomia' },
      { id: 'm', nome: 'Catedral', categoria: 'Monumento' }
    ])
    expect(ordem[0].periodo).toBe('Manhã')
    expect(ordem[1].periodo).toBe('Noite')
  })

  it('não empilha duas atrações no mesmo período quando há slot livre', () => {
    const ordem = sugerirOrdemDia([
      { id: 'm1', nome: 'A Catedral', categoria: 'Monumento' },
      { id: 'm2', nome: 'B Torre', categoria: 'Monumento' }
    ])
    expect(ordem[0].periodo).toBe('Manhã')
    expect(ordem[1].periodo).toBe('Tarde')
  })

  it('satura em Noite com mais de 4 atrações', () => {
    const ordem = sugerirOrdemDia(
      ['a', 'b', 'c', 'd', 'e'].map((n) => ({ id: n, nome: n, categoria: 'Museu' }))
    )
    expect(ordem[4].periodo).toBe('Noite')
  })
})
