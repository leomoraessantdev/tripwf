import { useEffect } from 'react'

const SUFIXO = 'TripWF — Planejador de viagens pela Europa'

// SEO básico em SPA: título e meta description por rota.
export function useTituloPagina(titulo, descricao) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · TripWF` : SUFIXO
    if (descricao) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', descricao)
    }
    return () => {
      document.title = SUFIXO
    }
  }, [titulo, descricao])
}
