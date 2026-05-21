// Compartilhamento de roteiro via URL (?v=<base64url>).
// Codifica orçamento, viajantes e cidades selecionadas em base64 URL-safe.
// Ex: tripwf.com/?v=eyJvIjoxMDAsInYiOjIsImMiOlt7InMiOiJwYXJpcyIsImQiOjN9XX0

function paraBase64Url(str) {
  // btoa precisa de string ASCII; UTF-8 → bytes → base64 → URL-safe
  const b64 = btoa(unescape(encodeURIComponent(str)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function deBase64Url(token) {
  const padded = token.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (token.length % 4)) % 4)
  return decodeURIComponent(escape(atob(padded)))
}

// Compactação propositalmente curta — chaves de 1 letra para deixar a URL menor.
export function encodarRoteiro({
  orcamentoDiario, viajantes, origem, dataIda, dataVolta, estilo, cidadesSelecionadas
}) {
  const compact = {
    o: orcamentoDiario,
    v: viajantes,
    g: origem || '',
    i: dataIda || '',
    r: dataVolta || '',    // r = return
    e: estilo || '',
    c: (cidadesSelecionadas || []).map((c) => ({
      s: c.slug,
      d: c.dias,
      a: c.atracoesEscolhidas || [],
      h: c.hospedagemEscolhida || null
    }))
  }
  return paraBase64Url(JSON.stringify(compact))
}

export function decodificarRoteiro(token) {
  if (!token) return null
  try {
    const data = JSON.parse(deBase64Url(token))
    if (!data || !Array.isArray(data.c)) return null
    const estilosValidos = ['economico', 'conforto', 'luxo']
    const validarData = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '')
    return {
      orcamentoDiario: Number(data.o) || 100,
      viajantes: Math.max(1, Math.min(10, Number(data.v) || 1)),
      origem: typeof data.g === 'string' ? data.g.slice(0, 80) : '',
      dataIda: validarData(data.i),
      dataVolta: validarData(data.r),
      estilo: estilosValidos.includes(data.e) ? data.e : 'conforto',
      cidadesSelecionadas: data.c
        .filter((c) => c && typeof c.s === 'string')
        .map((c) => ({
          slug: c.s,
          dias: Math.max(1, Math.min(30, Number(c.d) || 3)),
          atracoesEscolhidas: Array.isArray(c.a) ? c.a.filter((x) => typeof x === 'string') : [],
          hospedagemEscolhida: typeof c.h === 'string' ? c.h : null
        }))
    }
  } catch {
    return null
  }
}

export function gerarLinkCompartilhamento(estado) {
  const token = encodarRoteiro(estado)
  const url = new URL(window.location.href)
  url.search = `?v=${token}`
  url.hash = ''
  return url.toString()
}

export async function compartilharLink(url, titulo = 'Meu roteiro TripWF') {
  // Web Share API (mobile/Safari) com fallback para clipboard
  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, url })
      return 'compartilhado'
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelado'
      // Cai para clipboard se Web Share falhar por outra razão
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copiado'
  } catch {
    return 'erro'
  }
}
