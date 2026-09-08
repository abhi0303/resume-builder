import ClassicTeal from './classicTeal/ClassicTeal'

/**
 * Template registry.
 *
 * A template is: an id + metadata, a React renderer, a DOCX builder and a page
 * size. PDF export is template-agnostic (it rasterises whatever the renderer
 * paints), so a new template only has to supply these five things.
 *
 *   templates.push({ id, name, tagline, swatch, page, Preview, loadDocxBuilder, limits })
 *
 * `loadDocxBuilder` is a dynamic import so the ~400kB Word writer is only
 * fetched when someone actually asks for a DOCX.
 */
export const templates = [
  {
    id: 'classicTeal',
    name: 'Classic Teal',
    tagline: 'Two column · dark banner',
    description: 'Academic and research profiles. Dark banner header with a main column for narrative and a side column for credentials.',
    swatch: ['#14384a', '#2b7c8f', '#eef2f4'],
    page: { width: 794, height: 1123 }, // A4 @ 96dpi
    Preview: ClassicTeal,
    loadDocxBuilder: () => import('./classicTeal/docx').then((module) => module.buildDocx),
    /** Per-template character budgets; falls back to the section-type defaults. */
    limits: {},
  },
]

export const getTemplate = (id) => templates.find((t) => t.id === id) || templates[0]
