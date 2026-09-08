import { normalizeRuns, runStyle, toRuns } from './richText'

/* ---------- model -> DOM ---------- */

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const kebab = (key) => key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)

const styleAttribute = (run) => {
  const entries = Object.entries(runStyle(run))
  if (!entries.length) return ''
  return ` style="${entries.map(([key, value]) => `${kebab(key)}:${value}`).join(';')}"`
}

/** Newlines survive as real characters because the editor uses `white-space: pre-wrap`. */
export function runsToHtml(value) {
  return toRuns(value)
    .map((run) => `<span${styleAttribute(run)}>${escapeHtml(run.text)}</span>`)
    .join('')
}

/* ---------- DOM -> model ---------- */

const hex = (value) => {
  const match = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(value || '')
  if (!match) return value?.startsWith('#') ? value.toLowerCase() : null
  return `#${match.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`
}

/**
 * Read the contenteditable back into runs. Typing inside a formatted span makes
 * the browser extend that span, so marks survive without us intercepting keys.
 */
export function runsFromElement(element) {
  const out = []
  walk(element, {}, out)
  return normalizeRuns(out)
}

function walk(node, marks, out) {
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.nodeValue) out.push({ ...marks, text: child.nodeValue })
      continue
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue
    if (child.nodeName === 'BR') {
      out.push({ ...marks, text: '\n' })
      continue
    }

    const next = { ...marks }
    const style = child.style || {}
    const weight = style.fontWeight
    if (child.nodeName === 'B' || child.nodeName === 'STRONG' || weight === 'bold' || Number(weight) >= 600) next.bold = true
    if (child.nodeName === 'I' || child.nodeName === 'EM' || style.fontStyle === 'italic') next.italic = true
    const decoration = style.textDecorationLine || style.textDecoration || ''
    if (child.nodeName === 'U' || decoration.includes('underline')) next.underline = true
    if (style.color) next.color = hex(style.color) || next.color
    if (style.backgroundColor) next.highlight = hex(style.backgroundColor) || next.highlight
    if (style.fontSize && style.fontSize.endsWith('%')) next.size = parseFloat(style.fontSize)

    // Browsers wrap pasted or Enter-split content in blocks; treat them as newlines.
    if (/^(DIV|P|LI)$/.test(child.nodeName) && out.length) out.push({ text: '\n' })
    walk(child, next, out)
  }
}

/* ---------- selection <-> plain-text offsets ---------- */

function lengthOf(node) {
  let total = 0
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) total += child.nodeValue.length
    else if (child.nodeName === 'BR') total += 1
    else total += lengthOf(child)
  }
  return total
}

export function getSelectionOffsets(root) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (!root.contains(range.commonAncestorContainer)) return null

  const measure = (container, offset) => {
    const probe = document.createRange()
    probe.selectNodeContents(root)
    probe.setEnd(container, offset)
    return lengthOf(probe.cloneContents())
  }
  return { start: measure(range.startContainer, range.startOffset), end: measure(range.endContainer, range.endOffset) }
}

function locate(root, target) {
  let remaining = target
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) =>
      node.nodeType === Node.TEXT_NODE || node.nodeName === 'BR' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
  })

  let node
  let fallback = { node: root, offset: 0 }
  while ((node = walker.nextNode())) {
    const size = node.nodeType === Node.TEXT_NODE ? node.nodeValue.length : 1
    if (remaining <= size) {
      if (node.nodeType === Node.TEXT_NODE) return { node, offset: remaining }
      const index = Array.prototype.indexOf.call(node.parentNode.childNodes, node)
      return { node: node.parentNode, offset: index + (remaining > 0 ? 1 : 0) }
    }
    remaining -= size
    if (node.nodeType === Node.TEXT_NODE) fallback = { node, offset: node.nodeValue.length }
  }
  return fallback
}

export function setSelectionOffsets(root, start, end) {
  const from = locate(root, start)
  const to = locate(root, end)
  const range = document.createRange()
  range.setStart(from.node, from.offset)
  range.setEnd(to.node, to.offset)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}
