/**
 * Rich text model.
 *
 * A field value is either a plain string (the legacy/seed shape) or an array of
 * "runs" — `{ text, bold?, italic?, underline?, color?, highlight?, size? }`.
 * `size` is a percentage of whatever size the template gives that field, so a
 * formatted run stays proportional in every template and in the DOCX export.
 *
 * Keeping strings valid means saved documents and seed data need no migration:
 * everything reads values through `toRuns` / `plainText`.
 */

export const MARK_KEYS = ['bold', 'italic', 'underline', 'color', 'highlight', 'size']

export const SIZE_STEPS = [70, 80, 90, 100, 110, 125, 150, 175, 200]

export function toRuns(value) {
  if (Array.isArray(value)) return value.filter((run) => run && typeof run.text === 'string')
  if (typeof value === 'string' && value.length) return [{ text: value }]
  return []
}

export function plainText(value) {
  return toRuns(value)
    .map((run) => run.text)
    .join('')
}

export const textLength = (value) => plainText(value).length

export const isEmptyText = (value) => !plainText(value).trim()

const signature = (run) => MARK_KEYS.map((key) => `${key}:${run[key] ?? ''}`).join('|')

/** Drop empty runs and merge neighbours that carry identical marks. */
export function normalizeRuns(runs) {
  const out = []
  for (const run of runs) {
    if (!run.text) continue
    const previous = out[out.length - 1]
    if (previous && signature(previous) === signature(run)) {
      previous.text += run.text
    } else {
      out.push({ ...run })
    }
  }
  return out
}

/** The `[from, to)` slice of a value, preserving each run's marks. */
export function sliceRuns(value, from, to) {
  const out = []
  let position = 0
  for (const run of toRuns(value)) {
    const start = position
    const end = position + run.text.length
    position = end
    if (end <= from || start >= to) continue
    out.push({ ...run, text: run.text.slice(Math.max(0, from - start), Math.min(run.text.length, to - start)) })
  }
  return normalizeRuns(out)
}

/** Apply `transform` to every run overlapping `[start, end)`. */
export function transformRange(value, start, end, transform) {
  if (start >= end) return toRuns(value)
  const out = []
  let position = 0
  for (const run of toRuns(value)) {
    const runStart = position
    const runEnd = position + run.text.length
    position = runEnd

    if (runEnd <= start || runStart >= end) {
      out.push(run)
      continue
    }
    const localStart = Math.max(0, start - runStart)
    const localEnd = Math.min(run.text.length, end - runStart)

    if (localStart > 0) out.push({ ...run, text: run.text.slice(0, localStart) })
    out.push(transform({ ...run, text: run.text.slice(localStart, localEnd) }))
    if (localEnd < run.text.length) out.push({ ...run, text: run.text.slice(localEnd) })
  }
  return normalizeRuns(out)
}

/** Set (or, with a falsy value, unset) one mark across a range. */
export function applyMark(value, start, end, mark, markValue) {
  return transformRange(value, start, end, (run) => {
    const next = { ...run }
    if (markValue === null || markValue === false || markValue === undefined || markValue === '') delete next[mark]
    else next[mark] = markValue
    return next
  })
}

export function clearMarks(value, start, end) {
  return transformRange(value, start, end, (run) => ({ text: run.text }))
}

export function replaceRange(value, start, end, text, marks = {}) {
  const runs = toRuns(value)
  const total = textLength(runs)
  const head = sliceRuns(runs, 0, start)
  const tail = sliceRuns(runs, end, total)
  return normalizeRuns([...head, ...(text ? [{ ...marks, text }] : []), ...tail])
}

/**
 * Marks shared by the whole range — used for the toolbar's active state.
 * A collapsed caret reports the marks of the character to its left, which is
 * what makes "turn bold on, then type" behave the way people expect.
 */
export function marksAt(value, start, end) {
  const runs = toRuns(value)
  if (!runs.length) return {}

  if (start === end) {
    const probe = sliceRuns(runs, Math.max(0, start - 1), Math.max(1, start))
    return markMap(probe[0] || {})
  }

  const covered = sliceRuns(runs, start, end)
  if (!covered.length) return {}

  const result = markMap(covered[0])
  for (const run of covered.slice(1)) {
    for (const key of MARK_KEYS) {
      if (result[key] !== undefined && result[key] !== run[key]) delete result[key]
    }
  }
  return result
}

function markMap(run) {
  const out = {}
  for (const key of MARK_KEYS) {
    if (run[key] !== undefined) out[key] = run[key]
  }
  return out
}

/** Inline CSS for one run. Values are relative so they compose with any template. */
export function runStyle(run) {
  const style = {}
  if (run.bold) style.fontWeight = 700
  if (run.italic) style.fontStyle = 'italic'
  if (run.underline) style.textDecoration = 'underline'
  if (run.color) style.color = run.color
  if (run.highlight) style.backgroundColor = run.highlight
  if (run.size) style.fontSize = `${run.size}%`
  return style
}
