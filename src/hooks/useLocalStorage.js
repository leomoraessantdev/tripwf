import { useEffect, useState } from 'react'

// `normalizar` (opcional): função aplicada ao valor lido do storage antes
// de virar estado — usada para migrar/sanear dados salvos por versões
// antigas do app (campos faltando, tipos errados). Deve ser pura.
export function useLocalStorage(chave, valorInicial, normalizar) {
  const [valor, setValor] = useState(() => {
    try {
      const armazenado = window.localStorage.getItem(chave)
      const lido = armazenado ? JSON.parse(armazenado) : valorInicial
      return normalizar ? normalizar(lido) : lido
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      // ignora erros de quota / acesso negado
    }
  }, [chave, valor])

  return [valor, setValor]
}
