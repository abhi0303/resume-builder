import { SECTION_TYPES } from '../data/sectionTypes'

/** Character budgets for the header, shared by every template unless overridden. */
export const HEADER_LIMITS = {
  name: 26,
  title: 62,
  phone: 24,
  email: 40,
  address: 90,
}

/**
 * Resolve the character budget for a field.
 * Templates may tighten/loosen any limit via `template.limits`, e.g.
 *   limits: { header: { name: 20 }, summary: { text: 600 } }
 */
export function getLimit(template, scope, field) {
  const override = template?.limits?.[scope]?.[field]
  if (typeof override === 'number') return override
  if (scope === 'header') return HEADER_LIMITS[field]
  return SECTION_TYPES[scope]?.limits?.[field]
}

export function usageLevel(length, limit) {
  if (!limit) return 'ok'
  const ratio = length / limit
  if (ratio >= 1) return 'full'
  if (ratio >= 0.85) return 'warn'
  return 'ok'
}
