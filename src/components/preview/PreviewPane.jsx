import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const ZOOM_STEPS = [0.5, 0.65, 0.8, 0.9, 1, 1.25, 1.5]

/**
 * Renders the active template on a real A4 sheet.
 *
 * The sheet is always laid out at its true pixel size and only *scaled* for
 * viewing, so what is measured here — including the page-break guides — is
 * exactly what the PDF exporter captures.
 */
export default function PreviewPane({ template, resume, sheetRef }) {
  const scrollRef = useRef(null)
  const [zoom, setZoom] = useState('fit')
  const [fitScale, setFitScale] = useState(1)
  const [sheetHeight, setSheetHeight] = useState(template.page.height)

  const { Preview, page } = template

  const measure = useCallback(() => {
    const node = scrollRef.current
    if (node) setFitScale(Math.min(1, (node.clientWidth - 48) / page.width))
  }, [page.width])

  /**
   * Re-measured after every render, not just on resize events. Dragging the
   * split changes this pane's width through a style change on a parent, and a
   * ResizeObserver notification is not guaranteed to land before paint — relying
   * on one alone left the preview stuck at a stale zoom and clipped the page.
   * Setting the same value is a no-op, so this settles in one extra render.
   */
  useLayoutEffect(measure)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return undefined
    const measure = () => setSheetHeight(sheet.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(sheet)
    return () => observer.disconnect()
  }, [sheetRef])

  const scale = zoom === 'fit' ? fitScale : zoom
  const pageCount = Math.max(1, Math.ceil(sheetHeight / page.height - 0.02))
  const guides = Array.from({ length: pageCount - 1 }, (_, index) => (index + 1) * page.height)

  const step = (direction) => {
    const current = scale
    const next =
      direction > 0
        ? ZOOM_STEPS.find((value) => value > current + 0.001)
        : [...ZOOM_STEPS].reverse().find((value) => value < current - 0.001)
    if (next) setZoom(next)
  }

  return (
    <div className="app__preview">
      <div className="preview__bar">
        <strong style={{ color: '#1f2d35' }}>{template.name}</strong>
        <span>·</span>
        <span>
          {pageCount} page{pageCount > 1 ? 's' : ''} · A4
        </span>
        {pageCount > 1 ? <span style={{ color: '#d94f3d' }}>· dashed lines mark page breaks</span> : null}
        <span style={{ marginLeft: 'auto' }} />
        <button type="button" className="btn btn--sm" onClick={() => step(-1)}>
          −
        </button>
        <span style={{ minWidth: 42, textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
        <button type="button" className="btn btn--sm" onClick={() => step(1)}>
          +
        </button>
        <button type="button" className="btn btn--sm" onClick={() => setZoom('fit')}>
          Fit
        </button>
      </div>

      <div className="preview__scroll" ref={scrollRef}>
        <div className="preview__stage" style={{ width: page.width * scale, height: sheetHeight * scale }}>
          <div className="preview__scaler" style={{ transform: `scale(${scale})`, width: page.width }}>
            <div className="page-sheet" ref={sheetRef} style={{ width: page.width, minHeight: page.height }}>
              <Preview resume={resume} />
              <div className="page-guides" data-export-ignore>
                {guides.map((top, index) => (
                  <div className="page-guide" key={top} style={{ top }}>
                    <span>PAGE {index + 2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
