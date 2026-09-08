import ClassicTeal from './classicTeal/ClassicTeal'
import ModernMinimal from './modernMinimal/ModernMinimal'
import { ACCENT_SWATCHES, SURFACE_SWATCHES } from '../utils/swatches'

/**
 * Template registry.
 *
 * A template is: an id + metadata, a React renderer, a DOCX builder, a page size
 * and the theme colours it exposes. PDF export is template-agnostic (it
 * rasterises whatever the renderer paints), so a new template only has to supply
 * these things.
 *
 *   templates.push({ id, name, tagline, swatch, page, Preview, loadDocxBuilder, themeFields, limits })
 *
 * `loadDocxBuilder` is a dynamic import so the ~400kB Word writer is only
 * fetched when someone actually asks for a DOCX.
 */
export const templates = [
  {
    id: 'classicTeal',
    name: 'Classic Teal',
    tagline: 'Two column · dark banner',
    description:
      'Academic and research profiles. Dark banner header with a main column for narrative and a side column for credentials.',
    swatch: ['#14384a', '#2b7c8f', '#eef2f4'],
    page: { width: 794, height: 1123 }, // A4 @ 96dpi
    Preview: ClassicTeal,
    loadDocxBuilder: () => import('./classicTeal/docx').then((module) => module.buildDocx),
    themeFields: [
      { key: 'bannerBg', label: 'Header colour', title: 'Header background colour', fallback: '#14384a', swatches: SURFACE_SWATCHES },
    ],
    /** Per-template character budgets; falls back to the section-type defaults. */
    limits: {},
  },
  {
    id: 'modernMinimal',
    name: 'Modern Minimal',
    tagline: 'Two column · no banner',
    description:
      'Technology and product profiles. Plain typographic header, ruled section headings and a single accent colour throughout.',
    swatch: ['#3cb9d2', '#262626', '#ffffff'],
    page: { width: 794, height: 1123 },
    Preview: ModernMinimal,
    loadDocxBuilder: () => import('./modernMinimal/docx').then((module) => module.buildDocx),
    themeFields: [
      { key: 'accent', label: 'Accent colour', title: 'Accent colour', fallback: '#3cb9d2', swatches: ACCENT_SWATCHES },
    ],
    limits: {},
  },
]

export const getTemplate = (id) => templates.find((t) => t.id === id) || templates[0]
