// Download único (build-time) de imagens da Wikipedia/Wikimedia para as
// novas atrações e hospedagens das 6 cidades expandidas.
// Roda manualmente: `node scripts/baixar-imagens-novas.mjs`
// As imagens ficam LOCAIS em /public/images — o app nunca busca em runtime.
// Para cada item, tenta os títulos candidatos na Wikipedia EN até achar
// um thumbnail; baixa em ~1200px e salva com o nome definido aqui.

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const UA = 'TripWF-portfolio/1.0 (one-time asset fetch)'
const ROOT = path.resolve('public/images')

// [pasta, nome-base-do-arquivo, [títulos candidatos na Wikipedia EN]]
const ITENS = [
  // ---------- MADRI — atrações ----------
  ['attractions', 'madri-museu-reina-sofia', ['pt:Museu Nacional Centro de Arte Rainha Sofia', 'de:Museo Reina Sofía', 'fr:Musée national centre d\'art Reina Sofía']],
  ['attractions', 'madri-museu-thyssen', ['Thyssen-Bornemisza National Museum', 'Thyssen-Bornemisza Museum']],
  ['attractions', 'madri-plaza-mayor', ['Plaza Mayor, Madrid']],
  ['attractions', 'madri-estadio-bernabeu', ['Santiago Bernabéu Stadium']],
  ['attractions', 'madri-mercado-san-miguel', ['Mercado de San Miguel']],
  ['attractions', 'madri-templo-debod', ['Temple of Debod']],
  ['attractions', 'madri-gran-via', ['Gran Vía (Madrid)', 'Gran Vía']],
  // ---------- MADRI — hospedagens ----------
  ['hotels', 'mandarin-oriental-ritz-madrid', ['es:Hotel Ritz (Madrid)', 'Mandarin Oriental Ritz, Madrid']],
  ['hotels', 'westin-palace-madrid', ['es:Hotel Palace (Madrid)', 'Paseo del Prado']],
  ['hotels', 'dear-hotel-plaza-espana-madrid', ['Plaza de España (Madrid)']],
  ['hotels', 'the-hat-puerta-del-sol-madrid', ['Puerta del Sol']],
  ['hotels', 'ok-hostel-la-latina-madrid', ['es:La Latina (Madrid)', 'Puerta de Toledo (Madrid)']],
  ['hotels', 'chamberi-apartment-madrid', ['Chamberí']],
  // ---------- BARCELONA — atrações ----------
  ['attractions', 'barcelona-casa-mila-pedrera', ['Casa Milà']],
  ['attractions', 'barcelona-museu-picasso', ['Museu Picasso']],
  ['attractions', 'barcelona-montjuic', ['Montjuïc']],
  ['attractions', 'barcelona-camp-nou', ['Camp Nou']],
  ['attractions', 'barcelona-la-boqueria', ['La Boqueria']],
  ['attractions', 'barcelona-tibidabo', ['Tibidabo', 'Tibidabo Amusement Park']],
  ['attractions', 'barcelona-palau-musica', ['Palau de la Música Catalana']],
  // ---------- BARCELONA — hospedagens ----------
  ['hotels', 'hotel-arts-barcelona', ['Hotel Arts']],
  ['hotels', 'el-palace-barcelona', ['es:Hotel Palace (Barcelona)', 'Hotel Palace (Barcelona)']],
  ['hotels', 'majestic-passeig-gracia-barcelona', ['Passeig de Gràcia']],
  ['hotels', 'generator-gracia-barcelona', ['Casa Vicens', 'ca:Vila de Gràcia']],
  ['hotels', 'st-christophers-ramblas-barcelona', ['La Rambla, Barcelona', 'La Rambla']],
  ['hotels', 'eixample-apartment-barcelona', ['Eixample']],
  // ---------- FLORENÇA — atrações ----------
  ['attractions', 'florenca-palazzo-pitti', ['Palazzo Pitti']],
  ['attractions', 'florenca-palazzo-vecchio', ['Palazzo Vecchio']],
  ['attractions', 'florenca-piazzale-michelangelo', ['it:Piazzale Michelangelo', 'pt:Piazzale Michelangelo']],
  ['attractions', 'florenca-santa-croce', ['Santa Croce, Florence', 'Basilica of Santa Croce, Florence']],
  ['attractions', 'florenca-mercato-centrale', ['Mercato Centrale (Florence)', 'Mercato Centrale, Florence', 'San Lorenzo Market']],
  ['attractions', 'florenca-bargello', ['Bargello']],
  ['attractions', 'florenca-fiesole', ['Fiesole']],
  // ---------- FLORENÇA — hospedagens ----------
  ['hotels', 'st-regis-florence-florenca', ['Ognissanti, Florence']],
  ['hotels', 'hotel-savoy-repubblica-florenca', ['Piazza della Repubblica, Florence']],
  ['hotels', 'hotel-davanzati-florenca', ['Palazzo Davanzati']],
  ['hotels', 'ostello-bello-san-lorenzo-florenca', ['Basilica of San Lorenzo, Florence']],
  ['hotels', 'oltrarno-apartment-florenca', ['Oltrarno']],
  ['hotels', 'duomo-view-apartment-florenca', ['Florence Cathedral']],
  // ---------- ROMA — atrações ----------
  ['attractions', 'roma-galleria-borghese', ['it:Galleria Borghese', 'pt:Galleria Borghese', 'Villa Borghese']],
  ['attractions', 'roma-castel-santangelo', ["Castel Sant'Angelo"]],
  ['attractions', 'roma-spanish-steps', ['Spanish Steps']],
  ['attractions', 'roma-san-pietro', ["St. Peter's Basilica"]],
  ['attractions', 'roma-catacumbas-callisto', ['Catacomb of Callixtus', 'Catacombs of Rome']],
  ['attractions', 'roma-campo-de-fiori', ["Campo de' Fiori"]],
  ['attractions', 'roma-via-appia', ['Appian Way']],
  // ---------- ROMA — hospedagens ----------
  ['hotels', 'st-regis-rome-roma', ['Piazza della Repubblica, Rome']],
  ['hotels', 'hotel-eden-roma', ['Via Vittorio Veneto', 'Villa Borghese']],
  ['hotels', 'hotel-quirinale-roma', ['Via Nazionale (Rome)', 'Quirinal Hill']],
  ['hotels', 'albergo-del-senato-roma', ['Piazza della Rotonda']],
  ['hotels', 'yellow-hostel-repubblica-roma', ['Castro Pretorio']],
  ['hotels', 'monti-apartment-roma', ['Monti (rione of Rome)']],
  // ---------- BUDAPESTE — atrações ----------
  ['attractions', 'budapeste-igreja-matthias', ['Matthias Church']],
  ['attractions', 'budapeste-colina-gellert', ['Gellért Hill']],
  ['attractions', 'budapeste-sinagoga-dohany', ['Dohány Street Synagogue']],
  ['attractions', 'budapeste-basilica-santo-estevao', ["St. Stephen's Basilica"]],
  ['attractions', 'budapeste-mercado-central', ['Great Market Hall (Budapest)']],
  ['attractions', 'budapeste-praca-herois', ["Heroes' Square (Budapest)", 'Hősök tere', 'City Park (Budapest)']],
  ['attractions', 'budapeste-opera-hungara', ['Hungarian State Opera House']],
  // ---------- BUDAPESTE — hospedagens ----------
  ['hotels', 'hotel-gellert-budapeste', ['Hotel Gellért', 'Gellért Baths']],
  ['hotels', 'corinthia-budapeste', ['Corinthia Hotel Budapest', 'Corinthia Budapest']],
  ['hotels', 'anantara-new-york-palace-budapeste', ['New York Palace, Budapest', 'New York Café', 'Boscolo Budapest Hotel']],
  ['hotels', 'wombats-vaci-budapeste', ['Váci Street', 'Váci utca']],
  ['hotels', 'danube-view-apartment-budapeste', ['Danube Promenade', 'Danube']],
  ['hotels', 'andrassy-boutique-budapeste', ['Andrássy Avenue', 'Andrássy út']],
  // ---------- ATENAS — atrações ----------
  ['attractions', 'atenas-museu-acropole', ['pt:Museu da Acrópole', 'es:Museo de la Acrópolis de Atenas', 'de:Akropolismuseum']],
  ['attractions', 'atenas-agora-antiga', ['Ancient Agora of Athens']],
  ['attractions', 'atenas-monte-licabeto', ['Mount Lycabettus']],
  ['attractions', 'atenas-templo-zeus', ['Temple of Olympian Zeus, Athens']],
  ['attractions', 'atenas-praca-syntagma', ['Syntagma Square']],
  ['attractions', 'atenas-anafiotika', ['Anafiotika']],
  ['attractions', 'atenas-estadio-panatenaico', ['Panathenaic Stadium']],
  // ---------- ATENAS — hospedagens ----------
  ['hotels', 'king-george-atenas', ['Hotel Grande Bretagne']],
  ['hotels', 'electra-palace-plaka-atenas', ['Plaka']],
  ['hotels', 'herodion-hotel-atenas', ['Odeon of Herodes Atticus']],
  ['hotels', 'athens-backpackers-makrygianni-atenas', ['Makrygianni', 'Dionysiou Areopagitou Street']],
  ['hotels', 'monastiraki-loft-atenas', ['Monastiraki']],
  ['hotels', 'kolonaki-apartment-atenas', ['Kolonaki']]
]

const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

// fetch com backoff progressivo para 429 (rate limit da Wikimedia)
async function fetchComRetry(url) {
  for (const espera of [0, 8000, 20000]) {
    if (espera) await pausa(espera)
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.status !== 429) return res
  }
  return { ok: false, status: 429 }
}

// Retorna lista de URLs candidatas, da maior para a menor.
// upload.wikimedia.org devolve 429 para originais/thumbs on-demand quando o
// IP está rate-limitado, mas o thumbnail que o summary referencia (~330px)
// é cache hit no CDN e praticamente sempre responde 200 — fica como
// último recurso garantido. Tamanhos maiores só funcionam se cacheados.
async function buscarCandidatosImagem(titulo) {
  // prefixo "xx:" = Wikipedia em outro idioma (útil quando o artigo EN tem
  // logo SVG como imagem principal e o artigo local tem foto do prédio)
  const mLang = titulo.match(/^([a-z]{2}):(.+)$/)
  const [host, t] = mLang
    ? [`${mLang[1]}.wikipedia.org`, mLang[2]]
    : ['en.wikipedia.org', titulo]
  const url = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(t.replace(/ /g, '_'))}`
  const res = await fetchComRetry(url)
  if (!res.ok) {
    console.log(`    (summary ${res.status}: ${titulo})`)
    return []
  }
  const json = await res.json()
  const thumb = json?.thumbnail?.source
  const original = json?.originalimage?.source
  if (!thumb || /\.svg/i.test(thumb)) return []
  const larguraOriginal = json?.originalimage?.width ?? 0
  const urls = []
  for (const w of [1024, 800, 640]) {
    if (larguraOriginal > w) urls.push(thumb.replace(/\/(\d+)px-/, `/${w}px-`))
  }
  if (original && !/\.svg/i.test(original)) urls.push(original)
  urls.push(thumb) // ~330px, cache CDN — quase nunca falha
  return urls
}

// Baixa e normaliza: JPEG progressivo, máx. 1200px de largura (sem upscale).
// Sem retry de 429 aqui — a cascata de URLs já cai para o thumb cacheado.
async function baixarNormalizado(url, destino) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) {
    console.log(`    (download ${res.status})`)
    return false
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 5000) return false
  await sharp(buf, { failOn: 'none' })
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(destino)
  return true
}

const resultados = { ok: [], falha: [] }

for (const [pasta, nomeBase, candidatos] of ITENS) {
  // não re-baixa o que já existe (script é re-executável)
  const jaExiste = await fs.access(path.join(ROOT, pasta, nomeBase + '.jpg')).then(() => true, () => false)
  if (jaExiste) {
    resultados.ok.push(`${pasta}/${nomeBase}.jpg`)
    continue
  }
  let feito = false
  await pausa(800)
  for (const titulo of candidatos) {
    try {
      const urls = await buscarCandidatosImagem(titulo)
      const destino = path.join(ROOT, pasta, nomeBase + '.jpg')
      for (const url of urls) {
        if (await baixarNormalizado(url, destino)) {
          console.log(`  ✓ ${pasta}/${nomeBase}.jpg  ←  ${titulo}`)
          resultados.ok.push(`${pasta}/${nomeBase}.jpg`)
          feito = true
          break
        }
      }
      if (feito) break
    } catch (e) {
      console.log(`  … ${titulo}: ${e.message}`)
    }
  }
  if (!feito) {
    console.log(`  ✗ SEM IMAGEM: ${pasta}/${nomeBase}`)
    resultados.falha.push(`${pasta}/${nomeBase}`)
  }
}

console.log(`\n${resultados.ok.length} baixadas, ${resultados.falha.length} sem imagem.`)
if (resultados.falha.length) console.log('Falhas:', resultados.falha.join(', '))
