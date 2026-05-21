// Rastreador de salvamento — timestamp da última edição (chave separada do
// estado da viagem, persistente entre sessões) + event bus em CustomEvent
// para o toast global "Roteiro salvo automaticamente ✓".
//
// A persistência da viagem em si JÁ acontece via useLocalStorage('viagem-europa')
// no ViagemContext — todo setter passa por lá. Este módulo só anota
// "quando foi a última vez" e notifica a UI.

const CHAVE_TIMESTAMP = 'tripwf-ultima-edicao'
const EVENTO_SALVO = 'tripwf:salvo'

export function carimbarSalvamento() {
  try {
    localStorage.setItem(CHAVE_TIMESTAMP, String(Date.now()))
  } catch {
    // localStorage indisponível — segue sem carimbar
  }
}

export function lerUltimaEdicao() {
  try {
    const v = Number(localStorage.getItem(CHAVE_TIMESTAMP))
    return Number.isFinite(v) && v > 0 ? v : 0
  } catch {
    return 0
  }
}

export function emitirSalvamento(detalhe = {}) {
  carimbarSalvamento()
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_SALVO, { detail: detalhe }))
  } catch {
    // ambiente sem window (SSR) — ignora
  }
}

export function escutarSalvamento(callback) {
  const handler = (e) => callback(e.detail || {})
  window.addEventListener(EVENTO_SALVO, handler)
  return () => window.removeEventListener(EVENTO_SALVO, handler)
}

export function formatarTempoRelativo(timestamp) {
  if (!timestamp) return ''
  const diff = Date.now() - timestamp
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `há ${min} ${min === 1 ? 'minuto' : 'minutos'}`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} ${h === 1 ? 'hora' : 'horas'}`
  const d = Math.floor(h / 24)
  return `há ${d} ${d === 1 ? 'dia' : 'dias'}`
}
