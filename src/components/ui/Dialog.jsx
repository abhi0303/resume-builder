import { useEffect, useRef, useState } from 'react'

/**
 * Modal confirmation, and — when `input` is supplied — a single-field prompt.
 * Replaces window.confirm/prompt so dialogs match the app's design.
 */
export default function Dialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  input,
  onConfirm,
  onCancel,
}) {
  const [value, setValue] = useState(input?.defaultValue ?? '')
  const inputRef = useRef(null)
  const confirmRef = useRef(null)
  const submitRef = useRef(null)

  const trimmed = value.trim()
  const canSubmit = !input || trimmed.length > 0
  submitRef.current = () => {
    if (canSubmit) onConfirm(input ? trimmed : true)
  }

  useEffect(() => {
    const field = inputRef.current
    if (field) {
      field.focus()
      field.select()
    } else {
      confirmRef.current?.focus()
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
      if (event.key === 'Enter') {
        event.preventDefault()
        submitRef.current()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onCancel])

  return (
    <div className="dialog-overlay" onMouseDown={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className="dialog__title" id="dialog-title">
          {title}
        </h2>
        {message ? <p className="dialog__message">{message}</p> : null}

        {input ? (
          <label className="dialog__field">
            <span>{input.label || 'Name'}</span>
            <span className="dialog__input">
              <input
                ref={inputRef}
                type="text"
                value={value}
                placeholder={input.placeholder}
                spellCheck={false}
                onChange={(event) => setValue(event.target.value)}
              />
              {input.suffix ? <span className="dialog__suffix">{input.suffix}</span> : null}
            </span>
          </label>
        ) : null}

        <div className="dialog__actions">
          <button type="button" className="btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmRef}
            className={`btn ${danger ? 'btn--solid-danger' : 'btn--primary'}`}
            disabled={!canSubmit}
            onClick={() => submitRef.current()}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
