import { useState } from 'react'
import { CalendarRange, Minus, Plus, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import clsx from 'clsx'
import { useViagem } from '../../context/ViagemContext.jsx'
import Imagem from '../ui/Imagem.jsx'
import { buscarCidade } from '../../data/cidades.js'

export default function PassoDias() {
  const { cidadesSelecionadas, setDias, totais, reordenarCidades } = useViagem()
  const [dragIndex, setDragIndex] = useState(null)
  const [dropIndex, setDropIndex] = useState(null)

  if (cidadesSelecionadas.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-primary-700/70 dark:text-ink-200">Volte ao passo anterior e selecione pelo menos uma cidade.</p>
      </div>
    )
  }

  // Move o item de from para to (clamp nas bordas).
  // É a única operação que escreve em cidadesSelecionadas.
  const mover = (from, to) => {
    if (from === to) return
    const t = Math.max(0, Math.min(cidadesSelecionadas.length - 1, to))
    const arr = [...cidadesSelecionadas]
    const [item] = arr.splice(from, 1)
    arr.splice(t, 0, item)
    reordenarCidades(arr)
  }

  const onDragStart = (e, i) => {
    setDragIndex(i)
    e.dataTransfer.effectAllowed = 'move'
    // Necessário para Firefox aceitar o drag
    e.dataTransfer.setData('text/plain', String(i))
  }
  const onDragOver = (e, i) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dropIndex !== i) setDropIndex(i)
  }
  const onDragLeave = () => setDropIndex(null)
  const onDrop = (e, i) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === i) return
    mover(dragIndex, i)
    setDragIndex(null)
    setDropIndex(null)
  }
  const onDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 mb-4">
          <CalendarRange className="w-8 h-8 text-accent-500" />
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 mb-3 text-balance">
          Quantos dias em cada cidade?
        </h2>
        <p className="text-primary-700/75 dark:text-ink-200 text-lg">
          Total atual: <strong className="text-accent-500">{totais.totalDias} dias</strong>
        </p>
      </div>

      <div className="bg-cream-100 border border-cream-300 dark:bg-ink-800 dark:border-ink-700 rounded-xl px-4 py-3 mb-5 text-xs text-primary-700 dark:text-ink-100 flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-accent-500 flex-shrink-0" />
        <span>
          <strong>Arraste</strong> os cards (ou use as setas <ArrowUp className="inline w-3 h-3" /><ArrowDown className="inline w-3 h-3" />) para definir a ordem da viagem. Essa ordem aparece no mapa final.
        </span>
      </div>

      <ol className="space-y-3">
        {cidadesSelecionadas.map((cs, i) => {
          const cidade = buscarCidade(cs.slug)
          if (!cidade) return null
          const arrastando = dragIndex === i
          const drop = dropIndex === i && dragIndex !== null && dragIndex !== i
          const total = cidadesSelecionadas.length
          return (
            <li
              key={cs.slug}
              draggable
              onDragStart={(e) => onDragStart(e, i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, i)}
              onDragEnd={onDragEnd}
              className={clsx(
                'bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-2xl shadow-soft dark:shadow-none p-3 sm:p-4 flex items-center gap-3 transition-all',
                arrastando && 'opacity-40 scale-[0.98]',
                drop && 'ring-2 ring-accent-500 -translate-y-0.5 shadow-hover'
              )}
            >
              {/* Drag handle + numerador da ordem */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  className="p-1 rounded text-primary-400 hover:text-primary-700 dark:text-ink-300 dark:hover:text-ink-100 cursor-grab active:cursor-grabbing"
                  aria-label="Arrastar para reordenar"
                  title="Arraste para reordenar"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                <div className="w-7 h-7 rounded-full bg-accent-500 text-white font-display font-extrabold text-sm flex items-center justify-center">
                  {i + 1}
                </div>
              </div>

              <Imagem
                src={cidade.imagem}
                alt={cidade.nome}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="text-xs text-primary-500 dark:text-ink-300 flex items-center gap-1">
                  <span>{cidade.bandeira}</span> {cidade.pais}
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-primary-900 dark:text-ink-50 truncate">
                  {cidade.nome}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[2, 3, 5, 7].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setDias(cs.slug, preset)}
                      className={`text-xs px-2 py-0.5 rounded font-semibold transition ${
                        cs.dias === preset
                          ? 'bg-accent-500 text-white'
                          : 'bg-cream-200 text-primary-700 hover:bg-cream-300 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700'
                      }`}
                    >
                      {preset}d
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setDias(cs.slug, cs.dias - 1)}
                  className="w-9 h-9 rounded-full bg-cream-200 hover:bg-cream-300 dark:bg-ink-800 dark:hover:bg-ink-700 text-primary-700 dark:text-ink-100 flex items-center justify-center transition"
                  aria-label="Diminuir dias"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 text-center">
                  <div className="font-display font-extrabold text-xl text-primary-900 dark:text-ink-50 leading-none">
                    {cs.dias}
                  </div>
                  <div className="text-[10px] text-primary-500 dark:text-ink-300">
                    {cs.dias === 1 ? 'dia' : 'dias'}
                  </div>
                </div>
                <button
                  onClick={() => setDias(cs.slug, cs.dias + 1)}
                  className="w-9 h-9 rounded-full bg-accent-500 hover:bg-accent-600 text-white flex items-center justify-center transition"
                  aria-label="Aumentar dias"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Setas de ordem (alternativa acessível ao drag) */}
              <div className="flex flex-col gap-0.5 flex-shrink-0 border-l border-cream-200 dark:border-ink-700 pl-2 ml-1">
                <button
                  type="button"
                  onClick={() => mover(i, i - 1)}
                  disabled={i === 0}
                  className="w-7 h-7 rounded text-primary-500 hover:bg-cream-200 dark:text-ink-300 dark:hover:bg-ink-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition"
                  aria-label="Mover para cima na ordem"
                  title="Mover para cima"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => mover(i, i + 1)}
                  disabled={i === total - 1}
                  className="w-7 h-7 rounded text-primary-500 hover:bg-cream-200 dark:text-ink-300 dark:hover:bg-ink-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition"
                  aria-label="Mover para baixo na ordem"
                  title="Mover para baixo"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
