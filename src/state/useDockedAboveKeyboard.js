import { useEffect, useState } from 'react'

/**
 * Y offset that keeps a fixed element sitting on top of the software keyboard.
 *
 * A phone keyboard does not shrink the layout viewport — the page is scrolled
 * and the top of the app goes off screen — so `position: fixed; bottom: 0` ends
 * up behind the keyboard. The visual viewport does track it, so the element is
 * pinned to `offsetTop + height` instead, minus its own height.
 *
 * Returns null when docking does not apply, so the caller can fall back to the
 * element's normal place in the flow.
 */
export function useDockedAboveKeyboard(ref, enabled) {
  const [offset, setOffset] = useState(null)

  useEffect(() => {
    const viewport = typeof window !== 'undefined' ? window.visualViewport : null
    if (!enabled || !viewport) {
      setOffset(null)
      return undefined
    }

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const height = ref.current?.offsetHeight ?? 0
        setOffset(Math.max(0, viewport.offsetTop + viewport.height - height))
      })
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    window.addEventListener('orientationchange', update)
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [ref, enabled])

  return offset
}
