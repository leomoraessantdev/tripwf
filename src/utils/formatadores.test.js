import { describe, it, expect } from 'vitest'
import { formatarEUR, formatarBRL, formatarDuracao, formatarPreco } from './formatadores.js'

// Intl insere espaços não separáveis — normaliza pra comparar só o conteúdo.
const semEspacos = (s) => s.replace(/\s/g, '')

describe('formatadores', () => {
  it('formatarEUR sem centavos', () => {
    expect(semEspacos(formatarEUR(100))).toBe('€100')
    expect(semEspacos(formatarEUR(1234))).toBe('€1.234')
  })

  it('formatarBRL converte pelo câmbio fixo (5.8)', () => {
    expect(semEspacos(formatarBRL(100))).toBe('R$580')
  })

  it('formatarDuracao singular/plural', () => {
    expect(formatarDuracao(1)).toBe('1 dia')
    expect(formatarDuracao(5)).toBe('5 dias')
  })

  it('formatarPreco: zero é Gratuito', () => {
    expect(formatarPreco(0)).toBe('Gratuito')
    expect(formatarPreco(null)).toBe('Gratuito')
    expect(semEspacos(formatarPreco(25))).toBe('€25')
  })
})
