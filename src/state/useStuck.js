import { useEffect, useState } from 'react'

/**
 * True while a `position: sticky` element is actually pinned.
 *
 * Used to square off the section header's corners once it detaches from the top
 * of its card — otherwise its rounded corners sit over straight card edges and
 * let the white body show through at the corners.
 */
export function useStuck(ref, scrollSelector = '.app__editor') {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const root = node.closest(scrollSelector)
    const offset = parseInt(window.getComputedStyle(node).top, 10) || 0
    // With the root shrunk to the sticky line, a pinned header stops being
    // fully visible — that drop below a ratio of 1 is the signal.
    const observer = new IntersectionObserver(([entry]) => setStuck(entry.intersectionRatio < 1), {
      root,
      threshold: [1],
      rootMargin: `-${offset + 1}px 0px 0px 0px`,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, scrollSelector])

  return stuck
}
