import clsx from 'clsx'
import { MapPin, BedDouble, Camera, Wallet, CalendarDays, Thermometer } from 'lucide-react'
import Imagem from '../ui/Imagem.jsx'
import Avaliacao from '../ui/Avaliacao.jsx'
import { formatarEUR, formatarBRL, formatarPreco } from '../../utils/formatadores.js'
import { formatarRange } from '../../utils/datas.js'
import { detectarTemporada, mensagemImpactoTemporada } from '../../utils/temporadas.js'

export default function CidadeRoteiro({ dados, indice }) {
  const {
    cidade, dias, atracoes, hospedagem,
    custoTotal, custoAtracoes, custoHospedagem, custoAlimentacao,
    dataInicio, dataFim
  } = dados
  const rangeData = formatarRange(dataInicio, dataFim)
  const temporada = detectarTemporada(cidade.slug, dataInicio)
  const mensagemTemporada = mensagemImpactoTemporada(temporada, cidade.nome)

  return (
    <article className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-soft dark:shadow-none overflow-hidden">
      <div className="relative h-48 sm:h-56">
        <Imagem
          src={cidade.imagem}
          alt={cidade.nome}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-primary-900/10" />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="bg-white/95 dark:bg-ink-900/90 backdrop-blur rounded-xl px-3 py-2 text-xs font-bold text-primary-700 dark:text-ink-100">
              CIDADE {indice}
            </div>
            {rangeData && (
              <div className="bg-primary-500/95 backdrop-blur rounded-xl px-3 py-1.5 text-xs font-bold text-white inline-flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" />
                {rangeData}
              </div>
            )}
            {temporada && (
              <div className={clsx(
                'backdrop-blur rounded-xl px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 border',
                temporada.classes
              )}>
                <span>{temporada.emoji}</span>
                {temporada.label}
              </div>
            )}
          </div>
          <div className="bg-accent-500 rounded-xl px-3 py-2 text-xs font-bold text-white inline-flex items-center gap-1.5 shadow-lg">
            <Wallet className="w-3.5 h-3.5" />
            {formatarEUR(custoTotal)}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm flex items-center gap-1 opacity-90 mb-1">
                <span>{cidade.bandeira}</span> {cidade.pais}
              </div>
              <h3 className="font-display font-extrabold text-3xl drop-shadow leading-tight truncate">
                {cidade.nome}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-display font-extrabold text-3xl leading-none">{dias}</div>
              <div className="text-xs opacity-80 font-semibold uppercase tracking-wider">
                {dias === 1 ? 'dia' : 'dias'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {mensagemTemporada && (
        <div className="px-5 sm:px-6 pt-4 -mb-1">
          <div className={clsx(
            'rounded-xl border px-3 py-2 text-xs flex items-start gap-2',
            temporada.classes
          )}>
            <Thermometer className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="leading-snug">{mensagemTemporada}</span>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-5">
        <section>
          <h4 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-3 flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-primary-500" />
            Hospedagem
          </h4>
          {hospedagem ? (
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-cream-100 dark:bg-ink-800/60">
              <Imagem
                src={hospedagem.imagem}
                alt={hospedagem.nome}
                className="w-full sm:w-56 h-48 sm:h-44 rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="font-display font-bold text-xl sm:text-2xl text-primary-900 dark:text-ink-50 leading-tight">
                  {hospedagem.nome}
                </div>
                <div className="text-sm text-primary-500 dark:text-ink-300 flex items-center gap-3 mt-2">
                  <span className="font-semibold">{hospedagem.tipo}</span>
                  <Avaliacao valor={hospedagem.avaliacao} tamanho={14} />
                </div>
                <div className="text-sm text-primary-500 dark:text-ink-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4" /> {hospedagem.bairro}
                </div>
                <div className="mt-auto pt-3">
                  <div className="text-2xl font-display font-extrabold text-accent-600 dark:text-accent-300 leading-none">
                    {formatarEUR(custoHospedagem)}
                  </div>
                  <div className="text-xs text-primary-500 dark:text-ink-300 mt-1">
                    {formatarBRL(custoHospedagem)} · {formatarEUR(hospedagem.precoNoite)} × {dias} {dias === 1 ? 'noite' : 'noites'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-primary-500 dark:text-ink-300 italic p-4 rounded-2xl bg-cream-100 dark:bg-ink-800/60">
              Nenhuma hospedagem selecionada
            </div>
          )}
        </section>

        <section>
          <h4 className="font-display font-bold text-primary-900 dark:text-ink-50 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-accent-500" />
            Atrações ({atracoes.length})
          </h4>
          {atracoes.length > 0 ? (
            <ul className="grid sm:grid-cols-2 gap-2">
              {atracoes.map((a) => (
                <li key={a.id} className="flex gap-3 p-2 rounded-lg bg-cream-100/50 dark:bg-ink-800/50">
                  <Imagem
                    src={a.imagem}
                    alt={a.nome}
                    className="w-12 h-12 rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-primary-900 dark:text-ink-50 line-clamp-1">
                      {a.nome}
                    </div>
                    <div className="text-xs text-primary-500 dark:text-ink-300">{a.duracao} · {a.categoria}</div>
                  </div>
                  <div className="text-right flex-shrink-0 self-center">
                    <div className="text-sm font-bold text-accent-600 dark:text-accent-300 leading-none">
                      {formatarPreco(a.preco)}
                    </div>
                    {a.preco > 0 && (
                      <div className="text-[10px] text-primary-500 dark:text-ink-300 mt-0.5">
                        {formatarBRL(a.preco)}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-primary-500 dark:text-ink-300 italic p-3 rounded-xl bg-cream-100 dark:bg-ink-800/60">
              Nenhuma atração selecionada
            </div>
          )}
        </section>
      </div>

      <div className="border-t border-cream-200 dark:border-ink-700 px-5 sm:px-6 py-4 bg-cream-100/50 dark:bg-ink-800/40">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <Custinho label="Hospedagem" valor={custoHospedagem} />
          <Custinho label="Atrações" valor={custoAtracoes} />
          <Custinho label="Alimentação" valor={custoAlimentacao} />
        </div>
        <div className="text-[10px] text-primary-500/70 dark:text-ink-300 text-center mt-2">
          Subtotal da cidade: <strong>{formatarEUR(custoTotal)}</strong> · transporte entre cidades é contado à parte no total geral
        </div>
      </div>
    </article>
  )
}

function Custinho({ label, valor }) {
  return (
    <div>
      <div className="text-primary-500 dark:text-ink-300 font-semibold uppercase tracking-wider">{label}</div>
      <div className="font-display font-bold text-lg text-primary-900 dark:text-ink-50">{formatarEUR(valor)}</div>
      {valor > 0 && (
        <div className="text-[10px] text-primary-500 dark:text-ink-300">{formatarBRL(valor)}</div>
      )}
    </div>
  )
}
