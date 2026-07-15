import { describe, it, expect } from 'vitest'
import { encodarRoteiro, decodificarRoteiro } from './compartilhar.js'

const ESTADO = {
  orcamentoDiario: 120,
  viajantes: 2,
  origem: 'São Paulo, Brasil',
  dataIda: '2026-06-01',
  dataVolta: '2026-06-10',
  estilo: 'economico',
  cidadesSelecionadas: [
    { slug: 'paris', dias: 4, atracoesEscolhidas: ['louvre', 'torre'], hospedagemEscolhida: 'h1' },
    { slug: 'roma', dias: 3, atracoesEscolhidas: [], hospedagemEscolhida: null }
  ]
}

describe('encodar/decodificar roteiro', () => {
  it('round-trip preserva todos os campos (incluindo UTF-8 na origem)', () => {
    const token = encodarRoteiro(ESTADO)
    const decodificado = decodificarRoteiro(token)
    expect(decodificado).toEqual(ESTADO)
  })

  it('token é URL-safe (sem +, / ou =)', () => {
    const token = encodarRoteiro(ESTADO)
    expect(token).not.toMatch(/[+/=]/)
  })

  it('token vazio ou lixo retorna null', () => {
    expect(decodificarRoteiro('')).toBeNull()
    expect(decodificarRoteiro(null)).toBeNull()
    expect(decodificarRoteiro('!!!não-é-base64!!!')).toBeNull()
    // base64 válido mas JSON sem o campo obrigatório `c`
    expect(decodificarRoteiro(btoa('{"o":1}'))).toBeNull()
  })

  it('aplica clamps e defaults em valores fora do range', () => {
    const token = encodarRoteiro({ ...ESTADO, viajantes: 50, estilo: 'mochilao' })
    const d = decodificarRoteiro(token)
    expect(d.viajantes).toBe(10)
    expect(d.estilo).toBe('conforto')
  })

  it('descarta cidades malformadas e saneia dias', () => {
    // Token construído na mão simulando payload adulterado
    const payload = {
      o: 100, v: 1, c: [
        { s: 'paris', d: 999 },
        { d: 3 },              // sem slug → descartada
        { s: 'roma', a: [1, 'ok'], h: 7 }
      ]
    }
    const token = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    const d = decodificarRoteiro(token)
    expect(d.cidadesSelecionadas).toHaveLength(2)
    expect(d.cidadesSelecionadas[0].dias).toBe(30)
    expect(d.cidadesSelecionadas[1].atracoesEscolhidas).toEqual(['ok'])
    expect(d.cidadesSelecionadas[1].hospedagemEscolhida).toBeNull()
  })
})
