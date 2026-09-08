import { BorderStyle, ShadingType, TableCell, TextRun, WidthType } from 'docx'
import { isEmptyText, toRuns } from '../utils/richText'

/** 1 CSS px @96dpi === 15 twips. Keeps the DOCX in step with the HTML template. */
export const px = (value) => Math.round(value * 15)

/** CSS px font-size -> docx half-points. */
export const fontSize = (value) => Math.round(value * 0.75 * 2)

export const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }

export const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE }

export function shadedCell({ children, width, fill, margins }) {
  return new TableCell({
    children,
    width: { size: width, type: WidthType.DXA },
    borders: NO_BORDERS,
    margins,
    ...(fill ? { shading: { type: ShadingType.CLEAR, color: 'auto', fill } } : {}),
  })
}

/** Word keeps empty paragraphs; drop blank entries before they reach the doc. */
export const filled = (list, key = 'text') => (list || []).filter((item) => !isEmptyText(item?.[key]))

/**
 * Turn a rich-text value into Word runs, inheriting the template's own styling
 * for the field. Per-run marks layer on top: `size` is a percentage of the
 * template's size, so a 125% run stays 125% in Word too.
 */
export function docxRuns(value, base = {}) {
  const out = []
  for (const run of toRuns(value)) {
    const options = {
      font: base.font,
      size: run.size && base.size ? Math.max(2, Math.round((base.size * run.size) / 100)) : base.size,
      bold: run.bold || base.bold,
      italics: run.italic || base.italics,
      color: run.color ? run.color.replace('#', '').toUpperCase() : base.color,
      characterSpacing: base.characterSpacing,
      ...(run.underline ? { underline: {} } : {}),
      ...(run.highlight
        ? { shading: { type: ShadingType.CLEAR, color: 'auto', fill: run.highlight.replace('#', '').toUpperCase() } }
        : {}),
    }
    // Word needs an explicit line break element; a "\n" inside a run is ignored.
    run.text.split('\n').forEach((line, index) => {
      out.push(new TextRun({ ...options, text: line, ...(index ? { break: 1 } : {}) }))
    })
  }
  return out
}
