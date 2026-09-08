import { useEffect, useRef, useState } from 'react'

/** Trigger + popover menu. Shared by the sample picker and the mobile overflow. */
export default function MenuButton({ className = 'btn btn--sm', label, title, align = 'right', children }) {
  const [open, setOpen] = useState(false)
  const hostRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const close = (event) => {
      if (!hostRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <span className="menu-host" ref={hostRef}>
      <button
        type="button"
        className={className}
        title={title}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
      >
        {label}
      </button>
      {open ? (
        <div className={`menu menu--${align}`} role="menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      ) : null}
    </span>
  )
}
