import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usageLevel } from '../../utils/limits'
import { useFormattingApi } from '../../state/FormattingContext'
import {
  applyMark as applyMarkToRange,
  clearMarks,
  marksAt,
  replaceRange,
  textLength,
} from '../../utils/richText'
import {
  getSelectionOffsets,
  runsFromElement,
  runsToHtml,
  setSelectionOffsets,
} from '../../utils/richTextDom'

/**
 * Labelled rich-text field with a live character budget.
 *
 * The budget is a hard cap: the templates are fixed-width, so keeping text inside
 * the budget is what stops the layout from breaking. The counter turns amber at
 * 85% and red at the cap — which counts characters, never formatting.
 *
 * The control is a `contenteditable` so the toolbar can format a selection, but
 * it behaves like an input: Enter is swallowed (or inserts a newline when
 * multiline), and paste is coerced to plain text and clipped to the budget.
 */
export default function Field({
  label,
  value = '',
  onChange,
  limit,
  placeholder,
  multiline = false,
  rows = 3,
  hint,
  autoFocus,
}) {
  const ref = useRef(null)
  const emitted = useRef(null)
  const pendingSelection = useRef(null)
  const lastRange = useRef(null)
  const latest = useRef({ value, onChange, limit })
  latest.current = { value, onChange, limit }

  const formatting = useFormattingApi()
  const length = textLength(value)
  const level = usageLevel(length, limit)

  const reportSelection = useCallback(
    (field) => {
      const offsets = getSelectionOffsets(ref.current)
      const { value: current } = latest.current
      if (offsets) lastRange.current = offsets
      const range = offsets || { start: 0, end: textLength(current) }
      formatting.reportMarks(field, marksAt(current, range.start, range.end))
    },
    [formatting],
  )

  /** Stable handle handed to the toolbar while this field holds focus. */
  const field = useMemo(() => {
    const handle = {
      getMarks() {
        const offsets = getSelectionOffsets(ref.current)
        const { value: current } = latest.current
        const range = offsets || { start: 0, end: textLength(current) }
        return marksAt(current, range.start, range.end)
      },
      /**
       * With nothing selected the whole field is formatted — the useful default
       * here. Falls back to the last real selection, because opening the OS
       * colour picker drops the document selection.
       */
      resolveRange() {
        const { value: current } = latest.current
        const offsets = getSelectionOffsets(ref.current) || lastRange.current
        if (!offsets || offsets.start === offsets.end) return { start: 0, end: textLength(current) }
        return offsets
      },
      applyMark(mark, markValue) {
        const range = handle.resolveRange()
        const { value: current, onChange: emit } = latest.current
        pendingSelection.current = range
        emit(applyMarkToRange(current, range.start, range.end, mark, markValue))
      },
      clearFormatting() {
        const range = handle.resolveRange()
        const { value: current, onChange: emit } = latest.current
        pendingSelection.current = range
        emit(clearMarks(current, range.start, range.end))
      },
    }
    return handle
  }, [])

  // Push the model into the DOM — except when the DOM *is* the model because the
  // user just typed, which would wipe the caret.
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (value !== emitted.current) element.innerHTML = runsToHtml(value)

    const pending = pendingSelection.current
    if (pending) {
      pendingSelection.current = null
      element.focus()
      setSelectionOffsets(element, pending.start, pending.end)
      reportSelection(field)
    }
  }, [value, field, reportSelection])

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  const emit = (runs) => {
    emitted.current = runs
    onChange(runs)
  }

  const insertText = (text) => {
    const element = ref.current
    const offsets = getSelectionOffsets(element) || { start: length, end: length }
    const room = limit ? limit - (length - (offsets.end - offsets.start)) : Infinity
    const clipped = text.slice(0, Math.max(0, room))
    if (!clipped) return
    const caret = offsets.start + clipped.length
    pendingSelection.current = { start: caret, end: caret }
    onChange(replaceRange(value, offsets.start, offsets.end, clipped, marksAt(value, offsets.start, offsets.start)))
  }

  const handleInput = () => {
    const element = ref.current
    const runs = runsFromElement(element)
    if (!textLength(runs) && element.innerHTML) element.innerHTML = '' // let the placeholder show
    emit(runs)
    reportSelection(field)
  }

  const handleBeforeInput = (event) => {
    if (!limit || !event.nativeEvent.inputType?.startsWith('insert')) return
    const offsets = getSelectionOffsets(ref.current) || { start: length, end: length }
    const incoming = event.nativeEvent.data?.length ?? 1
    if (length - (offsets.end - offsets.start) + incoming > limit) event.preventDefault()
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    if (multiline) insertText('\n')
  }

  const handlePaste = (event) => {
    event.preventDefault()
    insertText(event.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n'))
  }

  return (
    <div className={`field${level === 'full' ? ' field--full' : ''}`}>
      <div className="field__label">
        <span>{label}</span>
        {limit ? (
          <span className={`counter counter--${level}`}>
            {length} / {limit}
          </span>
        ) : null}
      </div>
      <div
        ref={ref}
        className={`field__editable${multiline ? ' field__editable--multiline' : ''}`}
        style={multiline ? { minHeight: rows * 20 + 16 } : undefined}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={label}
        aria-multiline={multiline}
        spellCheck
        data-placeholder={placeholder || ''}
        onInput={handleInput}
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => formatting.focusField(field)}
        onBlur={() => formatting.blurField(field)}
        onKeyUp={() => reportSelection(field)}
        onMouseUp={() => reportSelection(field)}
        onSelect={() => reportSelection(field)}
      />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  )
}
