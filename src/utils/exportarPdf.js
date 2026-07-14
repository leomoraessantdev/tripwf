// jsPDF + html2canvas somam ~500KB minificados e só são usados no clique de
// "Exportar PDF" — import dinâmico tira ambos do bundle inicial (code splitting).
export async function exportarRoteiroPdf(elementoId, nomeArquivo = 'tripwf-roteiro.pdf') {
  const elemento = document.getElementById(elementoId)
  if (!elemento) {
    throw new Error(`Elemento #${elementoId} não encontrado`)
  }

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas')
  ])

  // Leaflet usa tiles de subdomínios sem CORS — quando html2canvas tenta
  // capturar, gera tainted canvas e o mapa sai em branco (ou quebra tudo).
  // Solução: durante export, body recebe `tripwf-exporting`, o que esconde
  // o `.leaflet-container` e mostra o fallback estático `.mapa-pdf-fallback`
  // já presente no DOM (rota textual + distância). Sem dependência externa.
  document.body.classList.add('tripwf-exporting')
  // Frame extra para o CSS aplicar antes do html2canvas snapshotar o DOM.
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

  try {
    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FBF8F3',
      logging: false
    })

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const larguraPdf = pdf.internal.pageSize.getWidth()
    const alturaPdf = pdf.internal.pageSize.getHeight()
    const proporcao = canvas.width / canvas.height
    const larguraImg = larguraPdf
    const alturaImg = larguraImg / proporcao

    let y = 0
    let alturaRestante = alturaImg

    pdf.addImage(dataUrl, 'JPEG', 0, y, larguraImg, alturaImg)
    alturaRestante -= alturaPdf

    while (alturaRestante > 0) {
      y -= alturaPdf
      pdf.addPage()
      pdf.addImage(dataUrl, 'JPEG', 0, y, larguraImg, alturaImg)
      alturaRestante -= alturaPdf
    }

    pdf.save(nomeArquivo)
  } finally {
    document.body.classList.remove('tripwf-exporting')
  }
}
