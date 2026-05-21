// Cliente da Wikipedia REST API.
// Cache em memória + dedupe in-flight. CORS aberto, sem chave.
//
// O cache guarda o RESUMO COMPLETO ({imagem, extract, descricao, titulo, urlArtigo})
// em vez de só a URL — assim outros componentes podem reusar a mesma resposta
// para mostrar descrição, link do artigo, etc.

const cache = new Map()      // slug → resumo | null
const inflight = new Map()   // slug → Promise<resumo|null>

export async function buscarResumoWiki(wiki) {
  if (!wiki) return null
  if (cache.has(wiki)) return cache.get(wiki)
  if (inflight.has(wiki)) return inflight.get(wiki)

  const promise = (async () => {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki)}`
      const r = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!r.ok) {
        cache.set(wiki, null)
        return null
      }

      const data = await r.json()

      // Prefere thumbnail (~320px) sobre originalimage (full-res, lento e às
      // vezes gigantesco). Para os cards 4x3 ~300-600px, o thumbnail rende
      // perfeito e carrega muito mais rápido.
      const imagem = data?.thumbnail?.source || data?.originalimage?.source || null

      // Sem imagem E sem extract → vale o null (cair pro SVG)
      // Sem imagem mas com extract → guarda o resumo mesmo assim
      // Disambiguation com imagem → ACEITA (Wikipedia escolhe foto do topic principal)
      if (!imagem && !data?.extract) {
        cache.set(wiki, null)
        return null
      }

      const resumo = {
        imagem,
        extract: data?.extract || null,
        descricao: data?.description || null,
        titulo: data?.title || wiki.replace(/_/g, ' '),
        urlArtigo:
          data?.content_urls?.desktop?.page ||
          `https://en.wikipedia.org/wiki/${encodeURIComponent(wiki)}`
      }

      cache.set(wiki, resumo)
      return resumo
    } catch {
      cache.set(wiki, null)
      return null
    } finally {
      inflight.delete(wiki)
    }
  })()

  inflight.set(wiki, promise)
  return promise
}

// Retorna apenas a URL da thumbnail. Usada como FALLBACK do path local
// no componente Imagem — quando o JPG em /public/images/... não existe
// (404), o componente cai automaticamente nesta URL Wikimedia (CDN
// público, não expira). SVG colorido só aparece se ambos falharem.
export async function buscarImagemWiki(wiki) {
  const resumo = await buscarResumoWiki(wiki)
  return resumo?.imagem || null
}
