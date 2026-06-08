import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bookmark, Eye, Pencil, Trash2, Plus, CalendarDays, MapPin, Wallet, ArrowRight
} from 'lucide-react'
import Imagem from '../components/ui/Imagem.jsx'
import { useViagem } from '../context/ViagemContext.jsx'
import { listarRoteiros, excluirRoteiro } from '../utils/roteirosSalvos.js'
import { formatarEUR } from '../utils/formatadores.js'
import { formatarTempoRelativo } from '../utils/saveTracker.js'

export default function PaginaMeusRoteiros() {
  const { carregarRoteiroSalvo } = useViagem()
  const navigate = useNavigate()
  const [roteiros, setRoteiros] = useState(() => listarRoteiros())
  const [confirmarExcluir, setConfirmarExcluir] = useState(null)

  useEffect(() => {
    const recarregar = () => setRoteiros(listarRoteiros())
    window.addEventListener('focus', recarregar)
    window.addEventListener('storage', recarregar)
    return () => {
      window.removeEventListener('focus', recarregar)
      window.removeEventListener('storage', recarregar)
    }
  }, [])

  const visualizar = (roteiro) => {
    carregarRoteiroSalvo(roteiro.estado)
    navigate('/roteiro')
  }
  const editar = (roteiro) => {
    carregarRoteiroSalvo(roteiro.estado)
    navigate('/planejador')
  }
  const excluir = (id) => {
    excluirRoteiro(id)
    setRoteiros(listarRoteiros())
    setConfirmarExcluir(null)
  }

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-cream-100 dark:bg-ink-950 min-h-screen">
      <div className="container-app">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center shrink-0">
              <Bookmark className="w-7 h-7 text-accent-500" />
            </div>
            <div>
              <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider mb-1">
                Sua biblioteca
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-900 dark:text-ink-50 leading-tight">
                Meus roteiros
              </h1>
              <p className="text-sm text-primary-700/70 dark:text-ink-200 mt-1">
                {roteiros.length === 0
                  ? 'Nenhum roteiro salvo ainda.'
                  : `${roteiros.length} ${roteiros.length === 1 ? 'roteiro salvo' : 'roteiros salvos'}.`}
              </p>
            </div>
          </div>
          <Link
            to="/planejador"
            className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-5 py-3 text-sm shadow-soft self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Novo roteiro
          </Link>
        </header>

        {roteiros.length === 0 ? (
          <RoteirosVazio />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roteiros.map((r) => (
              <CardRoteiro
                key={r.id}
                roteiro={r}
                confirmando={confirmarExcluir === r.id}
                onVisualizar={() => visualizar(r)}
                onEditar={() => editar(r)}
                onSolicitarExcluir={() => setConfirmarExcluir(r.id)}
                onCancelarExcluir={() => setConfirmarExcluir(null)}
                onConfirmarExcluir={() => excluir(r.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CardRoteiro({
  roteiro, confirmando,
  onVisualizar, onEditar, onSolicitarExcluir, onCancelarExcluir, onConfirmarExcluir
}) {
  const { nome, resumo, atualizadoEm } = roteiro
  const datas = formatarDatas(resumo?.dataIda, resumo?.dataVolta)
  const bandeiras = (resumo?.bandeiras || []).join(' ')
  const cidades = resumo?.nomesCidades || []

  return (
    <article className="card-base overflow-hidden flex flex-col group transition-all hover:-translate-y-0.5 hover:shadow-hover">
      <div className="relative h-44">
        <Imagem
          src={resumo?.imagemCapa}
          alt={nome}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 dark:bg-ink-900/90 backdrop-blur rounded-full px-3 py-1 text-[11px] font-bold text-primary-700 dark:text-ink-100 uppercase tracking-wider">
          <Bookmark className="w-3 h-3" /> Salvo
        </div>
        <div className="absolute top-3 right-3 bg-accent-500 rounded-xl px-3 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5 shadow-lg">
          <Wallet className="w-3.5 h-3.5" />
          {formatarEUR(resumo?.custoTotal || 0)}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h2 className="font-display font-extrabold text-xl drop-shadow leading-tight truncate">
            {nome}
          </h2>
          {bandeiras && (
            <div className="text-base mt-0.5 leading-none" aria-hidden="true">{bandeiras}</div>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <InfoTile
            icone={MapPin}
            destaque={`${resumo?.totalCidades || 0}`}
            rotulo={resumo?.totalCidades === 1 ? 'cidade' : 'cidades'}
          />
          <InfoTile
            icone={CalendarDays}
            destaque={`${resumo?.totalDias || 0}`}
            rotulo={resumo?.totalDias === 1 ? 'dia' : 'dias'}
          />
        </div>

        {cidades.length > 0 && (
          <p className="text-xs text-primary-700/75 dark:text-ink-200 line-clamp-2">
            {cidades.join(' · ')}
          </p>
        )}
        {datas && (
          <p className="text-xs text-primary-500 dark:text-ink-300 inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> {datas}
          </p>
        )}
        <p className="text-[11px] text-primary-500/70 dark:text-ink-300 mt-auto">
          Atualizado {formatarTempoRelativo(atualizadoEm) || 'agora mesmo'}
        </p>

        {confirmando ? (
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-3 flex flex-col gap-2 mt-1">
            <p className="text-xs text-danger font-semibold">
              Excluir esse roteiro? Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onConfirmarExcluir}
                className="flex-1 btn-base bg-danger hover:bg-danger/90 text-white px-3 py-2 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
              <button
                type="button"
                onClick={onCancelarExcluir}
                className="flex-1 btn-base bg-cream-200 hover:bg-cream-300 text-primary-700 dark:bg-ink-800 dark:hover:bg-ink-700 dark:text-ink-100 px-3 py-2 text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onVisualizar}
              className="flex-1 btn-base bg-accent-500 hover:bg-accent-600 text-white px-3 py-2.5 text-xs shadow-soft"
              aria-label="Visualizar roteiro"
            >
              <Eye className="w-3.5 h-3.5" /> Ver
            </button>
            <button
              type="button"
              onClick={onEditar}
              className="flex-1 btn-base bg-white hover:bg-cream-200 text-primary-700 dark:bg-ink-900 dark:hover:bg-ink-800 dark:text-ink-100 dark:ring-1 dark:ring-ink-700 px-3 py-2.5 text-xs shadow-soft"
              aria-label="Editar roteiro"
            >
              <Pencil className="w-3.5 h-3.5" /> Editar
            </button>
            <button
              type="button"
              onClick={onSolicitarExcluir}
              className="btn-base bg-cream-100 hover:bg-danger/10 text-primary-700 hover:text-danger dark:bg-ink-800 dark:hover:bg-danger/15 dark:text-ink-100 px-3 py-2.5 text-xs"
              aria-label="Excluir roteiro"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

function InfoTile({ icone: Icone, destaque, rotulo }) {
  return (
    <div className="rounded-xl bg-cream-100 dark:bg-ink-800/60 border border-cream-200 dark:border-ink-700 p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-accent-500/10 flex items-center justify-center shrink-0">
        <Icone className="w-4 h-4 text-accent-500" />
      </div>
      <div className="leading-tight">
        <div className="font-display font-extrabold text-lg text-primary-900 dark:text-ink-50">
          {destaque}
        </div>
        <div className="text-[10px] uppercase tracking-wider font-semibold text-primary-500 dark:text-ink-300">
          {rotulo}
        </div>
      </div>
    </div>
  )
}

function RoteirosVazio() {
  return (
    <div className="card-base p-10 sm:p-14 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-accent-500/10 flex items-center justify-center mx-auto mb-5">
        <Bookmark className="w-10 h-10 text-accent-500" />
      </div>
      <h2 className="font-display font-extrabold text-2xl text-primary-900 dark:text-ink-50 mb-3">
        Nenhum roteiro salvo
      </h2>
      <p className="text-primary-700/80 dark:text-ink-200 mb-6 leading-relaxed">
        Monte sua viagem no planejador e clique em <strong>Salvar roteiro</strong> no final.
        Você pode guardar quantos roteiros quiser e abrir cada um quando quiser.
      </p>
      <Link
        to="/planejador"
        className="btn-base bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 inline-flex"
      >
        Começar a planejar <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  )
}

function formatarDatas(idaIso, voltaIso) {
  if (!idaIso) return ''
  const ida = parseIso(idaIso)
  const volta = parseIso(voltaIso)
  if (!ida) return ''
  const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  if (!volta) return fmt.format(ida)
  return `${fmt.format(ida)} → ${fmt.format(volta)}`
}

function parseIso(iso) {
  if (!iso) return null
  const [a, m, d] = iso.split('-').map(Number)
  if (!a || !m || !d) return null
  return new Date(a, m - 1, d)
}
