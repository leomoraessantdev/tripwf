import { useState, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'

// =============================================================
// Componente <Imagem> — 100% local, sem rede, sem SVG ilustrado.
// =============================================================
//
// Cascata:
//   1. `src` (string ou array de paths LOCAIS em /public/images)
//      → primeiro path que carregar ganha.
//   2. Se nada carregar → bloco neutro cream-200 (sem placeholder
//      desenhado, sem gradiente, sem texto fake).
//
// Sem Wikipedia, sem fetch, sem rede. Card com imagem real ou bloco
// neutro indicando que o arquivo está faltando — sem fingir conteúdo.

export default function Imagem({ src, alt, className, ...props }) {
  // `nomeFallback` é aceito por compat com chamadas existentes mas ignorado.
  const { nomeFallback, ...imgProps } = props

  // Normaliza src para array (suporta cascata de paths)
  const lista = useMemo(() => {
    if (Array.isArray(src)) return src.filter(Boolean)
    if (src) return [src]
    return []
  }, [src])

  const listaKey = lista.join('|')
  const [indice, setIndice] = useState(0)
  const [carregada, setCarregada] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    setIndice(0)
    setCarregada(false)
  }, [listaKey])

  // Imagem servida do cache do browser pode completar ANTES do React anexar
  // onLoad/onError (comum em refresh) — os eventos se perdem e a <img> ficaria
  // presa em opacity-0 (ou o skeleton preso, no caso de erro). Confere o
  // estado real do elemento a cada render: complete + naturalWidth>0 = ok;
  // complete + naturalWidth 0 = falhou, avança a cascata.
  useEffect(() => {
    const el = imgRef.current
    if (!el || !el.complete) return
    if (el.naturalWidth > 0) {
      setCarregada(true)
    } else {
      setIndice((i) => i + 1)
    }
  }, [listaKey, indice, carregada])

  const semImagem = lista.length === 0 || indice >= lista.length

  // Sem imagem: bloco neutro — cream-200 no claro, ink-800 no escuro.
  if (semImagem) {
    return <div className={clsx('bg-cream-200 dark:bg-ink-800', className)} aria-label={alt} />
  }

  return (
    <div className={clsx('overflow-hidden bg-cream-200 dark:bg-ink-800', className)}>
      <div className="relative w-full h-full">
        {!carregada && (
          // Skeleton: pulso sutil enquanto o arquivo local carrega
          <div className="absolute inset-0 bg-cream-200 dark:bg-ink-800 animate-pulse" />
        )}
        <img
          ref={imgRef}
          src={lista[indice]}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setCarregada(true)}
          onError={() => {
            // Tenta próximo path da cascata; se acabar, vira "sem imagem".
            setIndice((i) => i + 1)
          }}
          className={clsx(
            'w-full h-full object-cover object-center transition-opacity duration-300',
            carregada ? 'opacity-100' : 'opacity-0'
          )}
          style={{ imageRendering: 'auto' }}
          {...imgProps}
        />
      </div>
    </div>
  )
}
