import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const CAPTURE_SCALE = 2

/**
 * Rasterise the live preview node and slice it across A4 pages.
 *
 * Capturing the DOM (rather than re-drawing the CV in PDF primitives) is what
 * guarantees the PDF is pixel-identical to the template on screen — and it keeps
 * working for every template added later, with no extra export code.
 */
export async function exportPdf(node, { fileName, page }) {
  const pdf = await renderPdf(node, { page })
  pdf.save(fileName)
}

/** Renders the node into a jsPDF document without saving it (used by exports and tests). */
export async function renderPdf(node, { page }) {
  const clone = mountNaturalSizeClone(node, page.width)
  try {
    const canvas = await html2canvas(clone, {
      scale: CAPTURE_SCALE,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: page.width,
    })

    const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const sliceHeight = Math.round((canvas.width * pdfHeight) / pdfWidth)
    // Sub-pixel rounding must not spill a few stray rows onto a second page.
    const tolerance = Math.max(2, Math.round(sliceHeight * 0.005))

    let offset = 0
    let pageIndex = 0
    while (offset < canvas.height - tolerance || pageIndex === 0) {
      const height = Math.min(sliceHeight, canvas.height - offset)
      const slice = document.createElement('canvas')
      slice.width = canvas.width
      slice.height = height
      const ctx = slice.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, slice.width, slice.height)
      ctx.drawImage(canvas, 0, offset, canvas.width, height, 0, 0, canvas.width, height)

      if (pageIndex > 0) pdf.addPage()
      pdf.addImage(slice.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, (height * pdfWidth) / canvas.width)

      offset += height
      pageIndex += 1
    }

    return pdf
  } finally {
    clone.parentNode?.removeChild(clone)
  }
}

/**
 * The on-screen preview is zoomed with a CSS transform, which html2canvas does
 * not reproduce faithfully. Capture an untransformed copy parked off-screen —
 * minus anything marked as editor-only chrome (e.g. the page-break guides).
 */
function mountNaturalSizeClone(node, width) {
  const host = document.createElement('div')
  host.style.cssText = `position:fixed;top:0;left:-10000px;width:${width}px;background:#ffffff;z-index:-1;`
  const clone = node.cloneNode(true)
  clone.style.transform = 'none'
  clone.style.width = `${width}px`
  clone.style.boxShadow = 'none'
  clone.querySelectorAll('[data-export-ignore]').forEach((element) => element.remove())
  host.appendChild(clone)
  document.body.appendChild(host)
  return host
}
