import { useEffect, useRef, useState } from 'react'
import { normalizeHex } from '../../utils/color'

export const TEXT_SWATCHES = [
  '#1a1a1a', '#14384a', '#2b7c8f', '#b8860b', '#c0392b',
  '#2e7d32', '#6a3d9a', '#6b7c86', '#0b6fa4', '#a0522d',
]

export const HIGHLIGHT_SWATCHES = [
  '#fff3b0', '#ffe0b2', '#d7f0d0', '#d6e8f7', '#fbd7e2',
  '#e4e9ec', '#f8c8c0', '#e2d6f5', '#c9f0ea', '#f0f0a8',
]

export const SURFACE_SWATCHES = [
  '#14384a', '#0f2b38', '#1f4e5f', '#2b7c8f', '#123c2e',
  '#3b2f4a', '#4a2c2a', '#2f3640', '#1a1a1a', '#5a4632',
]

/**
 * Colour control: curated swatches for speed, plus the OS colour picker and a
 * hex box so any colour at all is reachable.
 *
 * `onOpenChange` lets callers pin state that would otherwise be lost when the
 * native picker steals focus (see the formatting toolbar).
 */
export default function ColorButton({
  className = 'btn btn--sm',
  title,
  value,
  onChange,
  swatches = TEXT_SWATCHES,
  clearLabel,
  onOpenChange,
  footer,
  align = 'left',
  disabled,
  children,
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('#333333')
  const hostRef = useRef(null)

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (!hostRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  useEffect(() => {
    if (open) setDraft(normalizeHex(value) || '#333333')
  }, [open, value])

  const pick = (hex, close = true) => {
    onChange(hex)
    if (close) setOpen(false)
  }

  return (
    <span className="color-host" ref={hostRef}>
      <button
        type="button"
        className={className}
        title={title}
        disabled={disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((state) => !state)}
      >
        {children}
      </button>

      {open ? (
        <div className={`color-panel color-panel--${align}`}>
          <div className="color-panel__grid">
            {clearLabel ? (
              <button
                type="button"
                className={`color-swatch color-swatch--none${value ? '' : ' color-swatch--on'}`}
                title={clearLabel}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(null)}
              />
            ) : null}
            {swatches.map((hex) => (
              <button
                type="button"
                key={hex}
                className={`color-swatch${normalizeHex(value) === hex ? ' color-swatch--on' : ''}`}
                style={{ background: hex }}
                title={hex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(hex)}
              />
            ))}
          </div>

          <div className="color-panel__custom">
            <input
              type="color"
              aria-label="Pick any colour"
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                pick(event.target.value, false)
              }}
            />
            <input
              type="text"
              className="color-panel__hex"
              aria-label="Hex colour"
              value={draft}
              spellCheck={false}
              onChange={(event) => {
                setDraft(event.target.value)
                const hex = normalizeHex(event.target.value)
                if (hex) pick(hex, false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setOpen(false)
              }}
            />
          </div>

          {footer ? <div className="color-panel__footer">{footer}</div> : null}
        </div>
      ) : null}
    </span>
  )
}
