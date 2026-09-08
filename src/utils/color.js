/** Accepts "#abc", "abc", "#aabbcc"; returns a lowercase 6-digit hex or null. */
export function normalizeHex(value) {
  if (!value) return null
  let hex = String(value).trim()
  if (!hex.startsWith('#')) hex = `#${hex}`
  if (/^#[0-9a-f]{3}$/i.test(hex)) hex = `#${hex.slice(1).split('').map((c) => c + c).join('')}`
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : null
}

export function hexToRgb(hex) {
  const safe = normalizeHex(hex) || '#000000'
  return [1, 3, 5].map((index) => parseInt(safe.slice(index, index + 2), 16))
}

/** WCAG relative luminance — used to keep banner text readable on any background. */
export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const isLight = (hex, threshold = 0.45) => relativeLuminance(hex) > threshold

/** Blend `hex` toward white (amount > 0) or black (amount < 0). */
export function mix(hex, amount) {
  const target = amount > 0 ? 255 : 0
  const ratio = Math.abs(amount)
  const channels = hexToRgb(hex).map((channel) => Math.round(channel + (target - channel) * ratio))
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

export const stripHash = (hex) => (normalizeHex(hex) || '#000000').slice(1).toUpperCase()
