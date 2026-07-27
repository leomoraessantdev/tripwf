import { Compass, Mail, Globe, Github, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary-900 dark:bg-ink-950 dark:border-t dark:border-ink-800 text-cream-100 mt-20">
      <div className="container-app py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg">TripWF</div>
              <div className="text-xs text-cream-100/60">Planejador inteligente</div>
            </div>
          </div>
          <p className="text-sm text-cream-100/70 max-w-sm">
            Monte sua viagem dos sonhos pela Europa em poucos cliques. Atrações, hospedagens e
            controle de orçamento em um só lugar.
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider">Navegação</h4>
          <ul className="space-y-2 text-sm text-cream-100/70">
            <li><Link to="/" className="hover:text-accent-500 transition">Início</Link></li>
            <li><Link to="/planejador" className="hover:text-accent-500 transition">Planejador</Link></li>
            <li><Link to="/roteiro" className="hover:text-accent-500 transition">Meu Roteiro</Link></li>
            <li><Link to="/meus-roteiros" className="hover:text-accent-500 transition">Meus Roteiros</Link></li>
            <li><Link to="/sobre" className="hover:text-accent-500 transition">Sobre o TripWF</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider">Contato</h4>
          <ul className="space-y-2 text-sm text-cream-100/70">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contato@tripwf.com</li>
            <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> www.tripwf.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-app py-5 flex items-center justify-center gap-4 text-xs text-cream-100/50 relative">
          <div>© 2026 TripWF</div>
          <div className="flex items-center gap-3 sm:absolute sm:right-0">
            <a
              href="https://github.com/leomoraessantdev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-accent-500 transition"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/leonardo-moraesdev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-accent-500 transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
