import { useEffect, useState } from 'react'
import { buscarResumoWiki } from '../utils/wikiImagem.js'

// Hook que retorna o resumo Wikipedia (imagem, extract, descricao, urlArtigo).
// Usa flag local de cancelamento — compatível com React 18 Strict Mode.
// Compartilha cache global com Imagem.jsx, não dispara fetch duplicado.
export function useWikiResumo(wiki) {
  const [resumo, setResumo] = useState(null)

  useEffect(() => {
    if (!wiki) {
      setResumo(null)
      return
    }
    let cancelled = false
    buscarResumoWiki(wiki).then((r) => {
      if (!cancelled) setResumo(r)
    })
    return () => { cancelled = true }
  }, [wiki])

  return resumo
}
