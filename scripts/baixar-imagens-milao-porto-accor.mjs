// Download único (build-time) de imagens da Wikipedia/Wikimedia para as
// cidades Milão e Porto, bate e volta e hotéis Accor (foto do bairro/marco).
// Roda manualmente: `node scripts/baixar-imagens-milao-porto-accor.mjs`
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
  ['cities', 'milao', ['Milan Cathedral', 'Milan']],
  ['cities', 'porto', ['Ribeira (Porto)', 'Porto']],
  ['attractions', 'milao-duomo', ['Milan Cathedral']],
  ['attractions', 'milao-cenacolo', ['Santa Maria delle Grazie, Milan', 'The Last Supper (Leonardo)']],
  ['attractions', 'milao-galleria', ['Galleria Vittorio Emanuele II']],
  ['attractions', 'milao-sforzesco', ['Castello Sforzesco']],
  ['attractions', 'milao-brera', ['Pinacoteca di Brera', 'Brera Academy']],
  ['attractions', 'milao-scala', ['La Scala']],
  ['attractions', 'milao-navigli', ['Navigli', 'Naviglio Grande']],
  ['attractions', 'milao-porta-nuova', ['Bosco Verticale', 'Porta Nuova (Milan)']],
  ['attractions', 'milao-san-siro', ['San Siro']],
  ['attractions', 'porto-ribeira', ['Dom Luís I Bridge', 'Ribeira (Porto)']],
  ['attractions', 'porto-lello', ['Livraria Lello']],
  ['attractions', 'porto-caves', ['pt:Caves do Vinho do Porto', 'Port wine']],
  ['attractions', 'porto-clerigos', ['Clérigos Church']],
  ['attractions', 'porto-bolsa', ['Palácio da Bolsa']],
  ['attractions', 'porto-sao-bento', ['São Bento railway station']],
  ['attractions', 'porto-se', ['Porto Cathedral']],
  ['attractions', 'porto-cruzeiro', ['Rabelo boat', 'Douro']],
  ['attractions', 'porto-serralves', ['Serralves', 'Serralves Foundation']],
  ['attractions', 'porto-foz', ['pt:Foz do Douro', 'Farol de Felgueiras', 'Foz do Douro']],
  ['attractions', 'madri-toledo', ['Toledo, Spain']],
  ['attractions', 'milao-lugano', ['Lugano']],
  ['attractions', 'milao-bernina', ['Bernina Express', 'Brusio spiral viaduct', 'Bernina railway']],
  ['hotels', 'milao-h1', ['Piazza della Repubblica, Milan', 'Milano Centrale railway station']],
  ['hotels', 'milao-h2', ['Naviglio Grande']],
  ['hotels', 'milao-h3', ['Piazza della Scala']],
  ['hotels', 'porto-h1', ['pt:Rua de Miguel Bombarda', 'Cedofeita']],
  ['hotels', 'porto-h2', ['pt:Ribeira (Porto)', 'Douro', 'pt:Cais da Ribeira']],
  ['hotels', 'porto-h3', ['Vila Nova de Gaia']],
  ['hotels', 'paris-accor-ibis', ['15th arrondissement of Paris']],
  ['hotels', 'paris-accor-sofitel', ['Rue du Faubourg Saint-Honoré']],
  ['hotels', 'roma-accor-mercure-termini', ['Roma Termini railway station']],
  ['hotels', 'roma-accor-mercure-colosseo', ['Esquiline Hill', 'Via Labicana']],
  ['hotels', 'roma-accor-sofitel', ['Villa Borghese gardens']],
  ['hotels', 'barcelona-accor-ibis', ['Hospital de la Santa Creu i Sant Pau', 'ca:Avinguda de Gaudí']],
  ['hotels', 'barcelona-accor-novotel', ['Torre Glòries']],
  ['hotels', 'amsterdam-accor-ibis', ['Amsterdam Centraal station']],
  ['hotels', 'amsterdam-accor-sofitel', ['Sofitel Legend The Grand Amsterdam', 'Oudezijds Voorburgwal']],
  ['hotels', 'praga-accor-ibis', ['Powder Tower, Prague']],
  ['hotels', 'praga-accor-novotel', ['Wenceslas Square']],
  ['hotels', 'lisboa-accor-ibis', ['pt:Praça do Marquês de Pombal', 'Eduardo VII Park']],
  ['hotels', 'lisboa-accor-novotel', ['Calouste Gulbenkian Museum']],
  ['hotels', 'lisboa-accor-sofitel', ['Avenida da Liberdade']],
  ['hotels', 'viena-accor-novotel', ['Augarten', 'Wiener Prater']],
  ['hotels', 'londres-accor-novotel', ['Tower Bridge']],
  ['hotels', 'londres-accor-sofitel', ['St James\'s']],
  ['hotels', 'berlim-accor-ibis', ['Prenzlauer Berg']],
  ['hotels', 'berlim-accor-novotel', ['Alexanderplatz']],
  ['hotels', 'berlim-accor-sofitel', ['Kurfürstendamm']],
  ['hotels', 'madri-accor-ibis', ['es:Plaza de toros de Las Ventas', 'Plaza de toros de Las Ventas']],
  ['hotels', 'madri-accor-ibis-styles', ['es:Barrio de las Letras', 'Barrio de las Letras']],
  ['hotels', 'madri-accor-novotel', ['Puerta de Alcalá']],
  ['hotels', 'atenas-accor-ibis-styles', ['Plaka']],
  ['hotels', 'atenas-accor-novotel', ['Metaxourgeio']],
  ['hotels', 'istambul-accor-novotel', ['Karaköy']],
  ['hotels', 'istambul-accor-swissotel', ['Dolmabahçe Palace']],
  ['hotels', 'budapeste-accor-ibis', ['Liberty Bridge (Budapest)', 'hu:Szabadság híd']],
  ['hotels', 'budapeste-accor-sofitel', ['Széchenyi Chain Bridge']],
  ['hotels', 'florenca-accor-mercure', ['Santa Maria Novella, Florence', 'Firenze Santa Maria Novella railway station']],
  ['hotels', 'florenca-accor-ibis', ['Sesto Fiorentino', 'Campi Bisenzio']],
  ['hotels', 'edimburgo-accor-ibis', ['Royal Mile']],
  ['hotels', 'edimburgo-accor-novotel', ['Grassmarket']],
  ['hotels', 'copenhague-accor-ibis-styles', ['Ørestad']],
  ['hotels', 'milao-accor-ibis', ['Milano Centrale railway station']],
  ['hotels', 'milao-accor-ibis-styles', ['Pirelli Tower']],
  ['hotels', 'porto-accor-ibis', ['pt:Mercado do Bolhão', 'Rua de Santa Catarina']],
  ['hotels', 'porto-accor-mercure', ['pt:Avenida dos Aliados', 'pt:Câmara Municipal do Porto']],
  ['hotels', 'porto-accor-novotel', ['Serra do Pilar Monastery', 'Vila Nova de Gaia']],
  ['hotels', 'paris-accor-ibis-budget', ['Parc de la Villette']],
  ['hotels', 'paris-accor-ibis-styles', ['Place de la Bastille']],
  ['hotels', 'paris-accor-novotel', ['Les Halles', 'Forum des Halles']],
  ['hotels', 'roma-accor-jojo', ['Quattro Fontane', 'Sant\'Andrea al Quirinale']],
  ['hotels', 'barcelona-accor-ibis-budget', ['Poblenou', 'Rambla del Poblenou']],
  ['hotels', 'barcelona-accor-ibis-styles', ['Passeig de Gràcia']],
  ['hotels', 'amsterdam-accor-ibis-stopera', ['Stopera', 'Waterlooplein']],
  ['hotels', 'amsterdam-accor-ibis-styles', ['Damrak']],
  ['hotels', 'praga-accor-ibis-wenceslas', ['National Museum (Prague)']],
  ['hotels', 'lisboa-accor-ibis-saldanha', ['pt:Praça Duque de Saldanha', 'Saldanha (Lisbon Metro)']],
  ['hotels', 'lisboa-accor-ibis-styles', ['Restauradores Square', 'pt:Praça dos Restauradores']],
  ['hotels', 'viena-accor-jojo', ['Wien Westbahnhof']],
  ['hotels', 'viena-accor-ibis-budget', ['Wiener Riesenrad']],
  ['hotels', 'viena-accor-ibis', ['Wien Hauptbahnhof']],
  ['hotels', 'londres-accor-ibis', ['Blackfriars Bridge']],
  ['hotels', 'londres-accor-ibis-styles', ['Borough Market']],
  ['hotels', 'berlim-accor-ibis-budget', ['Fernsehturm Berlin']],
  ['hotels', 'madri-accor-ibis-budget', ['Lavapiés']],
  ['hotels', 'madri-accor-mercure', ['es:Calle de las Huertas', 'Plaza de Santa Ana']],
  ['hotels', 'atenas-accor-mgallery', ['Hellenic Parliament', 'Syntagma Square']],
  ['hotels', 'istambul-accor-mercure', ['Sirkeci railway station']],
  ['hotels', 'budapeste-accor-jojo', ['Dohány Street Synagogue']],
  ['hotels', 'budapeste-accor-ibis-castle', ['Buda Castle']],
  ['hotels', 'budapeste-accor-novotel', ['Hungarian Parliament Building']],
  ['hotels', 'edimburgo-accor-ibis-styles', ['St Andrew Square, Edinburgh']],
  ['hotels', 'milao-accor-mercure', ['it:Zona Tortona', 'Porta Genova']],
  ['hotels', 'porto-accor-ibis-budget', ['pt:Afurada', 'Afurada']],
  ['hotels', 'porto-accor-ibis-sao-bento', ['Praça da Batalha', 'pt:Praça da Batalha']],
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
  // Wikimedia só serve larguras padronizadas (500/960/1280…); outras dão 400.
  for (const w of [1280, 960, 500]) {
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
  await pausa(1500)
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
