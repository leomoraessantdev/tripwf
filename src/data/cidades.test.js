import { describe, it, expect } from 'vitest'
import { cidades, buscarCidade, opcaoMaisBarata } from './cidades.js'
import { sugerirEscolhas } from '../utils/sugestoes.js'

describe('catálogo de cidades', () => {
  it('inclui Milão e Porto com coordenadas, época e imagem de capa', () => {
    for (const slug of ['milao', 'porto']) {
      const c = buscarCidade(slug)
      expect(c).toBeTruthy()
      expect(c.lat).not.toBeNull()
      expect(c.epoca).not.toBeNull()
      expect(c.atracoes.length).toBeGreaterThan(5)
    }
  })

  it('toda cidade tem hotéis Accor com link de reserva na Accor', () => {
    for (const c of cidades) {
      const accor = c.hospedagens.filter((h) => h.rede === 'Accor')
      expect(accor.length, c.slug).toBeGreaterThan(0)
      for (const h of accor) {
        expect(h.linkReserva).toMatch(/^https:\/\/all\.accor\.com\/hotel\/[A-Z0-9]{4}\//)
        expect(h.linkComparar).toMatch(/booking\.com/)
      }
    }
  })

  it('ids de atrações e hospedagens são únicos', () => {
    const ids = cidades.flatMap((c) => [...c.atracoes, ...c.hospedagens].map((x) => x.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('bate e volta', () => {
  const batesVolta = cidades.flatMap((c) => c.atracoes.filter((a) => a.bateVolta))

  it('existem Madri → Toledo e Milão → Suíça', () => {
    expect(buscarCidade('madri').atracoes.some((a) => a.id === 'madri-toledo')).toBe(true)
    const suica = buscarCidade('milao').atracoes.filter((a) => a.bateVolta?.moeda === 'CHF')
    expect(suica.length).toBeGreaterThan(0)
  })

  it('preço = opção mais barata ida e volta + entrada principal', () => {
    for (const a of batesVolta) {
      const entrada = a.bateVolta.entradaPrincipal?.preco ?? 0
      expect(a.preco, a.id).toBe(opcaoMaisBarata(a.bateVolta).precoIdaVolta + entrada)
    }
  })

  it('link de compra padrão é o da opção mais barata', () => {
    for (const a of batesVolta) {
      expect(a.linkIngresso).toBe(opcaoMaisBarata(a.bateVolta).links[0].url)
    }
  })

  it('não entra na sugestão automática de atrações', () => {
    for (const estilo of ['economico', 'conforto', 'luxo']) {
      const { atracoesIds } = sugerirEscolhas(buscarCidade('milao'), 10, estilo, 500)
      expect(atracoesIds.some((id) => id === 'milao-lugano' || id === 'milao-bernina')).toBe(false)
    }
  })
})
