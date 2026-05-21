// =============================================================
// Gera a narrativa visível no Hero do roteiro.
// =============================================================
//
// Texto puramente determinístico, derivado do estado da viagem:
//   - título fixo                  (sempre o mesmo, "voo" emocional)
//   - subtítulo                    (dias · cidades · custo total)
//   - mensagem de foco             (categorias dominantes das atrações)
//   - mensagem de "vibe"           (estilo + intensidade + orçamento)
//
// Sem rede, sem IA — só heurística sobre os dados já enriquecidos.

import { formatarEUR } from './formatadores.js'

const ESTILO_FRASE = {
  economico: 'um perfil mais econômico',
  conforto:  'conforto sem exagero',
  luxo:      'um padrão premium'
}

const FRASES_CATEGORIA = {
  'Histórico':   'patrimônio histórico',
  'Monumento':   'monumentos icônicos',
  'Museu':       'arte e museus',
  'Cultural':    'experiências culturais',
  'Bairro':      'bairros autênticos',
  'Parque':      'natureza urbana',
  'Gastronomia': 'gastronomia local',
  'Religioso':   'arquitetura religiosa',
  'Mercado':     'mercados e vida local',
  'Passeio':     'passeios marcantes',
  'Praia':       'orla e mar',
  'Vida noturna':'vida noturna'
}

function topCategorias(dadosViagem) {
  const contagem = {}
  dadosViagem.forEach((d) => {
    d.atracoes.forEach((a) => {
      const cat = a.categoria || 'Outros'
      contagem[cat] = (contagem[cat] || 0) + 1
    })
  })
  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([cat]) => cat)
}

function intensidadeFrase(intensidade) {
  if (intensidade === 'leve') return 'boa mobilidade'
  if (intensidade === 'moderado') return 'um ritmo equilibrado'
  if (intensidade === 'intenso') return 'um ritmo dinâmico'
  return 'boa mobilidade'
}

export function gerarNarrativa({ dadosViagem, totais, estilo, intensidade }) {
  if (!dadosViagem || dadosViagem.length === 0) {
    return {
      titulo: '✈️ Sua aventura europeia está pronta',
      subtitulo: '',
      mensagem: 'Selecione cidades no planejador para gerar seu roteiro.',
      mensagemEmocional: ''
    }
  }

  const ncid = dadosViagem.length
  const nat = dadosViagem.reduce((s, d) => s + d.atracoes.length, 0)

  const titulo = '✈️ Sua aventura europeia está pronta'
  const subtitulo = [
    `${totais.totalDias} ${totais.totalDias === 1 ? 'dia' : 'dias'}`,
    `${ncid} ${ncid === 1 ? 'cidade' : 'cidades'}`,
    formatarEUR(totais.custoTotal)
  ].join(' · ')

  // Mensagem de foco
  const cats = topCategorias(dadosViagem)
  let foco
  if (cats.length === 0) {
    foco = `${ncid} ${ncid === 1 ? 'destino europeu' : 'destinos europeus'}`
  } else if (cats.length === 1) {
    foco = FRASES_CATEGORIA[cats[0]] || cats[0].toLowerCase()
  } else {
    const [a, b] = cats.map((c) => FRASES_CATEGORIA[c] || c.toLowerCase())
    foco = `${a} e ${b}`
  }
  const mensagem = nat > 0
    ? `Você vai explorar ${foco} em ${ncid} ${ncid === 1 ? 'cidade' : 'cidades'}, com ${nat} ${nat === 1 ? 'experiência' : 'experiências'} cuidadosamente selecionadas.`
    : `Você vai explorar ${ncid} ${ncid === 1 ? 'cidade europeia' : 'cidades europeias'} no seu próprio ritmo.`

  // Mensagem emocional
  const dentro = totais.dentroDoOrcamento
  const eFr = ESTILO_FRASE[estilo] || ESTILO_FRASE.conforto
  const iFr = intensidadeFrase(intensidade)
  let mensagemEmocional
  if (estilo === 'luxo') {
    mensagemEmocional = dentro
      ? `Uma jornada com ${eFr} e ${iFr}, mantendo-se dentro do orçamento planejado.`
      : `Uma jornada com ${eFr} e ${iFr} — vale revisar o orçamento se quiser apertar o controle financeiro.`
  } else if (estilo === 'economico') {
    mensagemEmocional = dentro
      ? `Seu roteiro segue ${eFr}, com ${iFr} e excelente custo-benefício.`
      : `Seu roteiro segue ${eFr} com ${iFr}, mas o total ficou acima do orçamento — vale ajustar antes de comprar.`
  } else {
    mensagemEmocional = dentro
      ? `Seu roteiro equilibra ${eFr}, ${iFr} e um bom custo-benefício.`
      : `Seu roteiro equilibra ${eFr} e ${iFr}, mas estourou o orçamento — ajustes pontuais resolvem.`
  }

  return { titulo, subtitulo, mensagem, mensagemEmocional }
}
