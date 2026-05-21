// Compressão lossy de imagens em /public/images.
// Roda manualmente: `node scripts/compress-images.mjs`
// Mantém o nome do arquivo. Não criar nada extra.

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('public/images')
const LIMIAR_BYTES = 1024 * 1024 // só comprime arquivos > 1MB
const MAX_LARGURA = 1920
const Q_JPG = 82
const Q_WEBP = 82
const Q_AVIF = 60
const PNG_QUALIDADE = 85

async function listarArquivos(dir) {
  const entradas = await fs.readdir(dir, { withFileTypes: true })
  const arquivos = []
  for (const e of entradas) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) arquivos.push(...(await listarArquivos(p)))
    else arquivos.push(p)
  }
  return arquivos
}

function fmtKB(b) { return (b / 1024).toFixed(0) + 'KB' }
function fmtMB(b) { return (b / 1024 / 1024).toFixed(2) + 'MB' }

async function comprimir(arquivo) {
  const ext = path.extname(arquivo).toLowerCase()
  const tmp = arquivo + '.tmp'
  const stat = await fs.stat(arquivo)
  if (stat.size <= LIMIAR_BYTES) return null

  let pipeline = sharp(arquivo, { failOn: 'none' })
  const meta = await pipeline.metadata()
  if (meta.width && meta.width > MAX_LARGURA) {
    pipeline = pipeline.resize({ width: MAX_LARGURA, withoutEnlargement: true })
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: Q_JPG, mozjpeg: true, progressive: true })
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: Q_WEBP, effort: 5 })
  } else if (ext === '.avif') {
    pipeline = pipeline.avif({ quality: Q_AVIF, effort: 4 })
  } else if (ext === '.png') {
    // PNG: tentar paleta primeiro (drástico p/ fotos com poucas cores); senão zlib alto
    pipeline = pipeline.png({ quality: PNG_QUALIDADE, compressionLevel: 9, palette: true })
  } else {
    return { arquivo, skip: 'ext-nao-suportada' }
  }

  await pipeline.toFile(tmp)
  const tmpStat = await fs.stat(tmp)
  if (tmpStat.size >= stat.size) {
    await fs.unlink(tmp)
    return { arquivo, antes: stat.size, depois: stat.size, skip: 'sem-ganho' }
  }
  await fs.rename(tmp, arquivo)
  return { arquivo, antes: stat.size, depois: tmpStat.size }
}

async function main() {
  const arquivos = await listarArquivos(ROOT)
  const candidatos = []
  for (const a of arquivos) {
    const s = await fs.stat(a)
    if (s.size > LIMIAR_BYTES) candidatos.push({ arquivo: a, tamanho: s.size })
  }
  candidatos.sort((a, b) => b.tamanho - a.tamanho)
  console.log(`Encontrados ${candidatos.length} arquivos > 1MB. Comprimindo…\n`)

  let totalAntes = 0
  let totalDepois = 0
  for (const c of candidatos) {
    try {
      const r = await comprimir(c.arquivo)
      if (!r) continue
      const rel = path.relative(ROOT, r.arquivo)
      if (r.skip) {
        console.log(`  - ${rel}: SKIP (${r.skip})`)
        continue
      }
      totalAntes += r.antes
      totalDepois += r.depois
      const pct = (100 * (1 - r.depois / r.antes)).toFixed(1)
      console.log(`  ✓ ${rel}: ${fmtMB(r.antes)} → ${fmtKB(r.depois)} (-${pct}%)`)
    } catch (e) {
      console.log(`  ✗ ${c.arquivo}: ERRO ${e.message}`)
    }
  }
  console.log(`\nTotal: ${fmtMB(totalAntes)} → ${fmtMB(totalDepois)} (economia ${fmtMB(totalAntes - totalDepois)})`)
}

main().catch((e) => { console.error(e); process.exit(1) })
