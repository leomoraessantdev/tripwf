import { Component } from 'react'
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react'

const CHAVE_ESTADO = 'viagem-europa'

// Captura erros de render em qualquer página e mostra fallback amigável
// em vez de tela branca. Propositalmente sem framer-motion nem contexto:
// precisa funcionar mesmo quando o resto do app quebrou.
//
// A causa mais comum de crash aqui é estado corrompido no localStorage
// (versão antiga do app, edição manual) — por isso o botão "Limpar dados",
// que apaga só a chave do roteiro e recarrega.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { erro: null }
  }

  static getDerivedStateFromError(erro) {
    return { erro }
  }

  componentDidCatch(erro, info) {
    console.error('ErrorBoundary capturou:', erro, info)
  }

  tentarNovamente = () => {
    this.setState({ erro: null })
  }

  limparDados = () => {
    try {
      window.localStorage.removeItem(CHAVE_ESTADO)
    } catch {
      // sem acesso ao localStorage — recarregar já ajuda
    }
    window.location.assign('/')
  }

  render() {
    if (!this.state.erro) return this.props.children

    return (
      <div className="flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-accent-500" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50 mb-2">
            Algo deu errado
          </h1>
          <p className="text-sm text-primary-600 dark:text-ink-300 mb-6">
            Ocorreu um erro inesperado ao exibir esta página. Tente novamente —
            se o problema continuar, limpe os dados salvos do roteiro.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={this.tentarNovamente}
              className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-4 py-3 text-sm font-semibold shadow-soft"
            >
              <RotateCcw className="w-4 h-4" /> Tentar novamente
            </button>
            <button
              type="button"
              onClick={this.limparDados}
              className="btn-base bg-cream-200 hover:bg-cream-300 text-primary-700 dark:bg-ink-800 dark:hover:bg-ink-700 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-4 py-3 text-sm"
            >
              <Trash2 className="w-4 h-4" /> Limpar dados e recomeçar
            </button>
          </div>
        </div>
      </div>
    )
  }
}
