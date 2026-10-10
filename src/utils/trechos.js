// Trechos entre cidades do roteiro + custo do transporte escolhido.
//
// Fonte única usada pelo ViagemContext (total da viagem) e pela seção
// "Transportes entre cidades" do roteiro. Função pura, sem rede.
//
// Data do trecho = dataInicio da cidade de destino (dia em que se deixa a
// cidade anterior). Ex.: ida 22/05, Lisboa 1 dia (22/05) → trecho
// Lisboa → Porto em 23/05; Porto 4 dias (23–26/05) → Porto → Madri em 27/05.

import { haversine } from './distancia.js'
import { sugestoesTransporte } from './transportes.js'
import { multiplicadorVooMedio, detectarTemporada } from './temporadas.js'

export const TIPOS_TRANSPORTE = ['aviao', 'trem', 'onibus', 'carro']

export const chaveTrecho = (slugA, slugB) => `${slugA}>${slugB}`

export function dataParaIso(d) {
  if (!d) return ''
  const a = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${a}-${m}-${dia}`
}

export function calcularTrechos(dadosViagem, viajantes = 1) {
  const trechos = []
  for (let i = 0; i < dadosViagem.length - 1; i++) {
    const a = dadosViagem[i]?.cidade
    const b = dadosViagem[i + 1]?.cidade
    if (!a || !b || a.lat == null || b.lat == null) continue
    const km = haversine(a.lat, a.lng, b.lat, b.lng)
    const data = dadosViagem[i + 1]?.dataInicio || null
    const dataIso = dataParaIso(data)
    // Alta temporada encarece todo o sistema de transporte, não só voos.
    const multiplicador = multiplicadorVooMedio(a.slug, b.slug, dataIso)
    trechos.push({
      chave: chaveTrecho(a.slug, b.slug),
      origem: a,
      destino: b,
      km,
      data,
      multiplicador,
      temporadaDestino: detectarTemporada(b.slug, dataIso),
      opcoes: sugestoesTransporte(km, a.nome, b.nome, dataIso, '', multiplicador, {
        slugOrigem: a.slug,
        slugDestino: b.slug,
        viajantes
      })
    })
  }
  return trechos
}

export function opcaoPadrao(opcoes) {
  return opcoes.find((o) => o.recomendado) || opcoes.find((o) => o.maisBarata) || opcoes[0] || null
}

// Escolha do usuário para o trecho; sem escolha (ou modal que deixou de
// existir na rota) cai no recomendado.
export function opcaoSelecionada(trecho, escolhas) {
  const tipo = escolhas?.[trecho.chave]
  return trecho.opcoes.find((o) => o.tipo === tipo) || opcaoPadrao(trecho.opcoes)
}

// Avião/trem/ônibus cobram por pessoa; carro é por veículo (combustível + pedágio).
export function custoOpcao(opcao, viajantes = 1) {
  if (!opcao) return 0
  return opcao.porCarro ? opcao.precoEstimado : opcao.precoEstimado * Math.max(1, viajantes)
}

export function custoTransporte(trechos, escolhas, viajantes = 1) {
  return trechos.reduce((acc, t) => acc + custoOpcao(opcaoSelecionada(t, escolhas), viajantes), 0)
}
