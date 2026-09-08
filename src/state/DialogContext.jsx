import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Dialog from '../components/ui/Dialog'

const DialogContext = createContext(null)

/**
 * Promise-based dialogs:
 *   if (await confirm({ title: 'Delete section?', danger: true })) …
 *   const name = await prompt({ title: 'Download PDF', input: { defaultValue } })
 *
 * `confirm` resolves true/false; `prompt` resolves the trimmed string, or false
 * when dismissed — so `if (!name) return` covers cancelling either way.
 */
export function DialogProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolver = useRef(null)

  const open = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolver.current = resolve
        setRequest(options)
      }),
    [],
  )

  const settle = (result) => {
    setRequest(null)
    const resolve = resolver.current
    resolver.current = null
    resolve?.(result)
  }

  const api = useMemo(
    () => ({
      confirm: (options) => open(options),
      prompt: (options) => open({ ...options, input: options.input || {} }),
    }),
    [open],
  )

  return (
    <DialogContext.Provider value={api}>
      {children}
      {request ? <Dialog {...request} onConfirm={(value) => settle(value)} onCancel={() => settle(false)} /> : null}
    </DialogContext.Provider>
  )
}

export const useConfirm = () => useContext(DialogContext).confirm
export const usePrompt = () => useContext(DialogContext).prompt
