import { Link, NavLink, useLocation } from 'react-router-dom'
import { Compass, MapPin, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { useScrollHeader } from '../../hooks/useScrollHeader.js'
import { useViagem } from '../../context/ViagemContext.jsx'

export default function Header() {
  const comScroll = useScrollHeader(40)
  const [menuAberto, setMenuAberto] = useState(false)
  const { cidadesSelecionadas } = useViagem()
  const location = useLocation()
  const transparente = location.pathname === '/' && !comScroll

  const links = [
    { to: '/', label: 'Início' },
    { to: '/planejador', label: 'Planejador' },
    { to: '/roteiro', label: 'Meu Roteiro' },
    { to: '/sobre', label: 'Sobre o TripWF' }
  ]

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparente ? 'bg-transparent' : 'glass shadow-soft'
      )}
    >
      <div className="container-app flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              transparente ? 'bg-white/20 backdrop-blur' : 'bg-primary-500'
            )}
          >
            <Compass
              className={clsx(
                'w-5 h-5 transition-transform group-hover:rotate-90',
                transparente ? 'text-white' : 'text-accent-500'
              )}
            />
          </div>
          <div className="leading-tight">
            <div className={clsx('font-display font-extrabold text-lg', transparente ? 'text-white' : 'text-primary-900')}>
              TripWF
            </div>
            <div className={clsx('text-xs font-medium', transparente ? 'text-white/80' : 'text-primary-400')}>
              Planejador inteligente
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  isActive
                    ? transparente
                      ? 'bg-white text-primary-700'
                      : 'bg-primary-500 text-white'
                    : transparente
                    ? 'text-white hover:bg-white/15'
                    : 'text-primary-700 hover:bg-cream-200'
                )
              }
            >
              {l.label}
              {l.to === '/roteiro' && cidadesSelecionadas.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-500 text-white text-xs">
                  {cidadesSelecionadas.length}
                </span>
              )}
            </NavLink>
          ))}
          <Link
            to="/planejador"
            className="ml-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-all shadow-soft hover:shadow-hover"
          >
            <Sparkles className="w-4 h-4" />
            Planejar viagem
          </Link>
        </nav>

        <button
          className={clsx(
            'md:hidden p-2 rounded-lg',
            transparente ? 'text-white' : 'text-primary-700'
          )}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuAberto && (
        <div className="md:hidden glass border-t border-white/30">
          <div className="container-app py-4 flex flex-col gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  clsx(
                    'px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2',
                    isActive ? 'bg-primary-500 text-white' : 'text-primary-700 hover:bg-cream-200'
                  )
                }
              >
                <MapPin className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
