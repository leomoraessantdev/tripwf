import { memo, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Plane, ArrowRight, ExternalLink } from 'lucide-react'
import { haversine, formatarDistancia } from '../../utils/distancia.js'
import { useWikiResumo } from '../../hooks/useWikiResumo.js'
import { buscarCidade } from '../../data/cidades.js'

// Marker numerado em laranja (acent-500) — combina com o tema do app.
// Gradiente sutil + halo translúcido para dar profundidade premium.
function iconeNumerado(numero) {
  return L.divIcon({
    html: `<div style="position:relative;width:38px;height:38px;">
      <div style="
        position:absolute;
        inset:-6px;
        background:rgba(227,100,20,0.18);
        border-radius:9999px;
        animation:tripwfPulse 2.4s ease-in-out infinite;
      "></div>
      <div style="
        position:relative;
        background:linear-gradient(135deg,#E36414 0%,#C0530F 100%);
        color:white;
        font-weight:800;
        font-family:'Plus Jakarta Sans',Inter,sans-serif;
        border-radius:9999px;
        width:38px;
        height:38px;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 8px 18px rgba(15,76,92,.35), inset 0 -2px 4px rgba(0,0,0,.15);
        border:3px solid white;
        font-size:15px;
      ">${numero}</div>
    </div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  })
}

// CSS-in-JS para o pulse do marker — injetado uma única vez.
if (typeof document !== 'undefined' && !document.getElementById('tripwf-marker-css')) {
  const tag = document.createElement('style')
  tag.id = 'tripwf-marker-css'
  tag.textContent = `@keyframes tripwfPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.25);opacity:.2}}`
  document.head.appendChild(tag)
}

function MapaRoteiroBase({ dadosViagem }) {
  const cidades = useMemo(
    () =>
      (dadosViagem || [])
        .filter((d) => d.cidade?.lat != null && d.cidade?.lng != null)
        .map((d) => ({
          slug: d.cidade.slug,
          nome: d.cidade.nome,
          pais: d.cidade.pais,
          bandeira: d.cidade.bandeira,
          dias: d.dias,
          lat: d.cidade.lat,
          lng: d.cidade.lng
        })),
    [dadosViagem]
  )

  const trechos = useMemo(() => {
    const arr = []
    let total = 0
    for (let i = 0; i < cidades.length - 1; i++) {
      const a = cidades[i]
      const b = cidades[i + 1]
      const km = haversine(a.lat, a.lng, b.lat, b.lng)
      total += km
      arr.push({ origem: a, destino: b, km })
    }
    return { lista: arr, total }
  }, [cidades])

  if (cidades.length === 0) return null

  // Centraliza o mapa no centroide das cidades selecionadas e ajusta zoom
  // pelo número de pontos (mais cidades → mais distantes → menos zoom)
  const centro = cidades.reduce(
    (acc, c) => [acc[0] + c.lat / cidades.length, acc[1] + c.lng / cidades.length],
    [0, 0]
  )
  const bounds = cidades.length > 1 ? cidades.map((c) => [c.lat, c.lng]) : null
  const zoom = cidades.length === 1 ? 6 : 4

  return (
    <section className="bg-white dark:bg-ink-900 dark:ring-1 dark:ring-ink-700 rounded-3xl shadow-soft dark:shadow-none overflow-hidden">
      <header className="px-6 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-cream-200 dark:border-ink-700">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-accent-500" />
          </div>
          <div>
            <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-wider mb-1">
              Mapa da viagem
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary-900 dark:text-ink-50 leading-tight">
              {cidades.length === 1
                ? `${cidades[0].nome}`
                : `${cidades[0].nome} → ${cidades[cidades.length - 1].nome}`}
            </h2>
          </div>
        </div>
        {trechos.total > 0 && (
          <div className="text-left sm:text-right">
            <div className="text-[11px] text-primary-500 dark:text-ink-300 font-semibold uppercase tracking-wider">
              Distância total
            </div>
            <div className="font-display font-extrabold text-3xl text-accent-500 leading-none">
              {formatarDistancia(trechos.total)}
            </div>
            <div className="text-[10px] text-primary-500 dark:text-ink-300 mt-0.5">em linha reta</div>
          </div>
        )}
      </header>

      <div className="relative h-[340px] sm:h-[440px] w-full">
        <MapContainer
          center={centro}
          zoom={zoom}
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {cidades.length > 1 && (
            <Polyline
              positions={cidades.map((c) => [c.lat, c.lng])}
              pathOptions={{
                color: '#E36414',
                weight: 4,
                dashArray: '10, 10',
                opacity: 0.9,
                lineCap: 'round'
              }}
            />
          )}

          {cidades.map((c, i) => (
            <Marker key={c.slug} position={[c.lat, c.lng]} icon={iconeNumerado(i + 1)}>
              <Popup>
                <CidadePopup cidadeMini={c} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/30 to-transparent" />

        {/* Fallback exibido SÓ durante exportação de PDF (body.tripwf-exporting).
            Evita tainted canvas dos tiles OSM e garante que o mapa apareça no PDF. */}
        <div className="mapa-pdf-fallback absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white p-6 sm:p-10 flex-col items-center justify-center text-center">
          <MapPin className="w-12 h-12 text-accent-400 mb-3" />
          <div className="text-[11px] uppercase tracking-wider text-accent-300 font-bold mb-2">
            Rota da viagem
          </div>
          <div className="font-display font-extrabold text-2xl sm:text-3xl leading-tight max-w-3xl">
            {cidades.map((c) => `${c.bandeira} ${c.nome}`).join('  →  ')}
          </div>
          {trechos.total > 0 && (
            <div className="mt-4 text-sm text-white/80">
              {formatarDistancia(trechos.total)} em linha reta · {cidades.length} cidades
            </div>
          )}
        </div>
      </div>

      {trechos.lista.length > 0 && (
        <div className="px-6 sm:px-8 py-5 border-t border-cream-200 bg-cream-50 dark:bg-ink-800/60 dark:border-ink-700">
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-primary-500 dark:text-ink-300 uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5 text-accent-500" />
            Trechos da rota
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trechos.lista.map((t, i) => (
              <li
                key={`${t.origem.slug}-${t.destino.slug}`}
                className="bg-white dark:bg-ink-900 dark:border-ink-700 rounded-2xl px-4 py-3 border border-cream-200 shadow-soft dark:shadow-none hover:border-accent-500/30 transition group"
              >
                <div className="flex items-center gap-2 text-[10px] text-primary-500 dark:text-ink-300 font-semibold uppercase tracking-wider mb-1">
                  <span className="bg-accent-500/10 text-accent-700 dark:text-accent-300 px-1.5 py-0.5 rounded">
                    Trecho {i + 1}
                  </span>
                  <span className="ml-auto font-display font-extrabold text-accent-600 dark:text-accent-300 text-sm normal-case tracking-normal">
                    {formatarDistancia(t.km)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-900 dark:text-ink-50 min-w-0">
                  <span className="truncate">{t.origem.nome}</span>
                  <ArrowRight className="w-4 h-4 text-accent-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span className="truncate">{t.destino.nome}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

// Popup de marker — busca extract da Wikipedia em runtime (cache global compartilhado).
function CidadePopup({ cidadeMini }) {
  const cidade = buscarCidade(cidadeMini.slug)
  const resumo = useWikiResumo(cidade?.wiki)
  const extract = resumo?.extract
    ? resumo.extract.slice(0, 200).replace(/\s+\S*$/, '') + (resumo.extract.length > 200 ? '…' : '')
    : null

  return (
    <div className="min-w-[200px] max-w-[260px]">
      <div className="text-xs text-primary-500 dark:text-ink-300 font-semibold flex items-center gap-1 mb-1">
        <span>{cidadeMini.bandeira}</span>
        {cidadeMini.pais}
        <span className="ml-auto px-2 py-0.5 rounded-full bg-accent-500 text-white text-[10px] font-bold">
          {cidadeMini.dias} {cidadeMini.dias === 1 ? 'dia' : 'dias'}
        </span>
      </div>
      <div className="font-display font-extrabold text-lg text-primary-900 dark:text-ink-50 leading-tight">
        {cidadeMini.nome}
      </div>
      {resumo?.descricao && (
        <div className="text-[10px] uppercase tracking-wider text-primary-500 dark:text-ink-300 font-bold mt-1">
          {resumo.descricao}
        </div>
      )}
      {extract && (
        <p className="text-xs text-primary-700 dark:text-ink-200 mt-2 leading-relaxed">{extract}</p>
      )}
      {resumo?.urlArtigo && (
        <a
          href={resumo.urlArtigo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-accent-600 hover:text-accent-700"
        >
          Wikipedia <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  )
}

export default memo(MapaRoteiroBase)
