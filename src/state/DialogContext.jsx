import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Dialog from '../components/ui/Dialog'

const DialogContext = createContext(null)

/**
 * Promise-based confirmations:
 *   if (await confirm({ title: 'Delete section?', danger: true })) …
 */
export function DialogProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback(
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

  return (
    <DialogContext.Provider value={confirm}>
      {children}
      {request ? <Dialog {...request} onConfirm={() => settle(true)} onCancel={() => settle(false)} /> : null}
    </DialogContext.Provider>
  )
}

export const useConfirm = () => useContext(DialogContext)
