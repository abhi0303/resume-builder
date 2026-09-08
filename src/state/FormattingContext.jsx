import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

/**
 * Connects whichever field is focused to the formatting toolbar.
 *
 * Two contexts on purpose: fields subscribe only to the (never-changing) API, so
 * moving the caret re-renders the toolbar and nothing else.
 */
const FormattingApiContext = createContext(null)
const FormattingStateContext = createContext({ active: false, marks: {} })

export function FormattingProvider({ children }) {
  const fieldRef = useRef(null)
  const holdRef = useRef(false)
  const [state, setState] = useState({ active: false, marks: {} })

  const api = useMemo(
    () => ({
      focusField(field) {
        fieldRef.current = field
        setState({ active: true, marks: field.getMarks() })
      },
      /** Popovers (and the OS colour picker) steal focus; hold the field meanwhile. */
      holdFocus(hold) {
        holdRef.current = hold
      },
      blurField(field) {
        if (holdRef.current) return
        if (fieldRef.current !== field) return
        fieldRef.current = null
        setState({ active: false, marks: {} })
      },
      reportMarks(field, marks) {
        if (fieldRef.current !== field) return
        setState((previous) => (sameMarks(previous.marks, marks) ? previous : { active: true, marks }))
      },
      applyMark(mark, value) {
        fieldRef.current?.applyMark(mark, value)
      },
      clearFormatting() {
        fieldRef.current?.clearFormatting()
      },
    }),
    [],
  )

  return (
    <FormattingApiContext.Provider value={api}>
      <FormattingStateContext.Provider value={state}>{children}</FormattingStateContext.Provider>
    </FormattingApiContext.Provider>
  )
}

function sameMarks(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if (a[key] !== b[key]) return false
  }
  return true
}

export const useFormattingApi = () => useContext(FormattingApiContext)
export const useFormattingState = () => useContext(FormattingStateContext)
