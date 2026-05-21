import { useEffect, useState } from 'react'

export function useScrollHeader(limite = 40) {
  const [comScroll, setComScroll] = useState(false)

  useEffect(() => {
    const onScroll = () => setComScroll(window.scrollY > limite)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [limite])

  return comScroll
}
