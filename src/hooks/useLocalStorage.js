import { useEffect, useState } from 'react'

export function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const armazenado = window.localStorage.getItem(chave)
      return armazenado ? JSON.parse(armazenado) : valorInicial
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
