import { useCallback, useEffect, useState } from 'react'

// =============================================================
// Sistema de favoritos — persistido em localStorage.
// =============================================================
// Guarda ids de atrações e hospedagens marcadas com coração.
// Sincroniza entre componentes montados via CustomEvent (mesmo padrão
// do saveTracker) — sem precisar de contexto global.

const CHAVE = 'tripwf-favoritos'
const EVENTO = 'tripwf:favoritos'

function lerFavoritos() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    const dados = bruto ? JSON.parse(bruto) : null
    return {
      atracoes: Array.isArray(dados?.atracoes) ? dados.atracoes : [],
      hospedagens: Array.isArray(dados?.hospedagens) ? dados.hospedagens : []
    }
  } catch {
    return { atracoes: [], hospedagens: [] }
  }
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(lerFavoritos)

  useEffect(() => {
    const atualizar = () => setFavoritos(lerFavoritos())
    window.addEventListener(EVENTO, atualizar)
    window.addEventListener('storage', atualizar)
    return () => {
      window.removeEventListener(EVENTO, atualizar)
      window.removeEventListener('storage', atualizar)
    }
  }, [])

  const ehFavorito = useCallback(
    (tipo, id) => favoritos[tipo]?.includes(id) ?? false,
    [favoritos]
  )

  const toggleFavorito = useCallback((tipo, id) => {
    const atual = lerFavoritos()
    const lista = atual[tipo] ?? []
    atual[tipo] = lista.includes(id)
      ? lista.filter((x) => x !== id)
      : [...lista, id]
    localStorage.setItem(CHAVE, JSON.stringify(atual))
    window.dispatchEvent(new CustomEvent(EVENTO))
  }, [])

  return { favoritos, ehFavorito, toggleFavorito }
}
