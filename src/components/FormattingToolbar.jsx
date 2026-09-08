import { useCallback } from 'react'
import ColorButton, { HIGHLIGHT_SWATCHES, TEXT_SWATCHES } from './ui/ColorButton'
import { useFormattingApi, useFormattingState } from '../state/FormattingContext'
import { SIZE_STEPS } from '../utils/richText'

/**
 * Formats the selection in whichever field has focus. Every control blocks
 * mousedown so the field keeps focus (and therefore its selection) while the
 * toolbar is used. With nothing selected, a control formats the whole field.
 */
export default function FormattingToolbar() {
  const { applyMark, clearFormatting, holdFocus } = useFormattingApi()
  const { active, marks } = useFormattingState()
  const pin = useCallback((open) => holdFocus(open), [holdFocus])

  const hold = (event) => event.preventDefault() // keep the field's selection alive

  const size = marks.size ?? 100
  const stepSize = (direction) => {
    const index = SIZE_STEPS.indexOf(size)
    const base = index === -1 ? SIZE_STEPS.indexOf(100) : index
    const next = SIZE_STEPS[Math.min(SIZE_STEPS.length - 1, Math.max(0, base + direction))]
    applyMark('size', next === 100 ? null : next)
  }

  const Toggle = ({ mark, children, title, style }) => (
    <button
      type="button"
      className={`fmt-btn${marks[mark] ? ' fmt-btn--on' : ''}`}
      title={title}
      disabled={!active}
      style={style}
      onMouseDown={hold}
      onClick={() => applyMark(mark, !marks[mark])}
    >
      {children}
    </button>
  )

  return (
    <div className={`formatbar${active ? '' : ' formatbar--idle'}`}>
      <span className="formatbar__label">Text</span>

      <Toggle mark="bold" title="Bold" style={{ fontWeight: 800 }}>
        B
      </Toggle>
      <Toggle mark="italic" title="Italic" style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
        I
      </Toggle>
      <Toggle mark="underline" title="Underline" style={{ textDecoration: 'underline' }}>
        U
      </Toggle>

      <span className="formatbar__divider" />

      <button type="button" className="fmt-btn" title="Smaller" disabled={!active} onMouseDown={hold} onClick={() => stepSize(-1)}>
        −
      </button>
      <span className="fmt-size" title="Size, relative to the template's size for this field">
        {size}%
      </span>
      <button type="button" className="fmt-btn" title="Larger" disabled={!active} onMouseDown={hold} onClick={() => stepSize(1)}>
        +
      </button>

      <span className="formatbar__divider" />

      <ColorButton
        className="fmt-btn fmt-btn--wide"
        title="Text colour"
        disabled={!active}
        value={marks.color}
        swatches={TEXT_SWATCHES}
        clearLabel="Default colour"
        onOpenChange={pin}
        onChange={(hex) => applyMark('color', hex)}
      >
        A
        <span className="fmt-swatch-bar" style={{ background: marks.color || '#333333' }} />
      </ColorButton>

      <ColorButton
        className="fmt-btn fmt-btn--wide"
        title="Highlight"
        disabled={!active}
        value={marks.highlight}
        swatches={HIGHLIGHT_SWATCHES}
        clearLabel="No highlight"
        onOpenChange={pin}
        onChange={(hex) => applyMark('highlight', hex)}
      >
        ▨
        <span className="fmt-swatch-bar" style={{ background: marks.highlight || '#fff3b0' }} />
      </ColorButton>

      <span className="formatbar__divider" />

      <button type="button" className="fmt-btn fmt-btn--wide" title="Clear formatting" disabled={!active} onMouseDown={hold} onClick={clearFormatting}>
        Clear
      </button>

      <span className="formatbar__hint">
        {active ? 'Formatting the selection — with nothing selected, the whole field.' : 'Click into any field to format it.'}
      </span>
    </div>
  )
}
