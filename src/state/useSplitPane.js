import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'resume-builder:editor-width'
const MIN_EDITOR = 340
const MIN_PREVIEW = 430
const DEFAULT_RATIO = 0.46

/** `null` means "follow the default ratio", so the split still adapts to window size. */
function readSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const value = Number(raw)
    return Number.isFinite(value) && value >= 0 ? value : null
  } catch {
    return null
  }
}

/**
 * Drag-to-resize split between the editor and the preview.
 *
 * Widths are kept in the layout layer (localStorage), not in the resume document —
 * how wide you like the editor is a workspace preference, not part of the CV.
 */
export function useSplitPane(containerRef) {
  const [width, setWidth] = useState(readSaved)
  const [dragging, setDragging] = useState(false)
  const [bounds, setBounds] = useState({ min: MIN_EDITOR, max: MIN_EDITOR, preferred: MIN_EDITOR })

  useLayoutEffect(() => {
    const node = containerRef.current
    if (!node) return undefined
    const measure = () =>
      setBounds({
        min: MIN_EDITOR,
        max: Math.max(MIN_EDITOR, node.clientWidth - MIN_PREVIEW),
        preferred: Math.round(node.clientWidth * DEFAULT_RATIO),
      })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [containerRef])

  useEffect(() => {
    try {
      if (width === null) window.localStorage.removeItem(STORAGE_KEY)
      else window.localStorage.setItem(STORAGE_KEY, String(width))
    } catch {
      /* private mode — the split just won't be remembered */
    }
  }, [width])

  /** Dragging past half the minimum collapses the editor rather than fighting the clamp. */
  const clamp = useCallback(
    (value) => (value < MIN_EDITOR / 2 ? 0 : Math.min(Math.max(value, bounds.min), bounds.max)),
    [bounds],
  )

  const startDrag = useCallback(
    (event) => {
      const node = containerRef.current
      if (!node) return
      event.preventDefault()
      const { left } = node.getBoundingClientRect()
      setDragging(true)

      const onMove = (moveEvent) => setWidth(clamp(moveEvent.clientX - left))
      const onUp = () => {
        setDragging(false)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [clamp, containerRef],
  )

  const current = width === null ? bounds.preferred : width
  const steps = useMemo(
    () => [...new Set([0, bounds.min, bounds.preferred, bounds.max])].sort((a, b) => a - b),
    [bounds],
  )

  /**
   * The arrows walk between hidden / narrow / default / widest — predictable stops.
   * Computed from the previous state rather than the rendered value, so two quick
   * clicks move two stops instead of both resolving against the same stale width.
   */
  const step = useCallback(
    (direction) => {
      setWidth((previous) => {
        const from = previous === null ? bounds.preferred : previous
        const next =
          direction > 0
            ? steps.find((value) => value > from + 2)
            : [...steps].reverse().find((value) => value < from - 2)
        if (next === undefined) return previous
        return next === bounds.preferred ? null : next
      })
    },
    [steps, bounds.preferred],
  )

  return {
    width,
    current,
    dragging,
    collapsed: current === 0,
    canShrink: current > steps[0] + 2,
    canGrow: current < steps[steps.length - 1] - 2,
    startDrag,
    step,
    reset: () => setWidth(null),
    nudge: (delta) => setWidth((previous) => clamp((previous === null ? bounds.preferred : previous) + delta)),
  }
}
