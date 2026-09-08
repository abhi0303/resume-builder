import {
  AlignmentType,
  BorderStyle,
  Document,
  Paragraph,
  Table,
  TableLayoutType,
  TableRow,
  TabStopType,
  TextRun,
  WidthType,
} from 'docx'
import { NO_BORDERS, docxRuns, filled, fontSize, px, shadedCell } from '../../export/docxKit'
import { isEmptyText, plainText } from '../../utils/richText'
import { stripHash } from '../../utils/color'
import { RATING_MAX } from '../../data/sectionTypes'
import { DEFAULT_ACCENT } from './theme'

/* Palette mirrors modernMinimal.css */
const INK = '262626'
const TEXT = '333333'
const MUTED = '6B6B6B'
const RULE = 'A9A9A9'
const FONT = 'Arial'

const PAGE_MARGIN = px(44)
const CONTENT_WIDTH = 11906 - PAGE_MARGIN * 2
const GUTTER = px(46)
const MAIN_WIDTH = Math.round(CONTENT_WIDTH * 0.53)
const SIDE_WIDTH = CONTENT_WIDTH - MAIN_WIDTH
const MAIN_TEXT_WIDTH = MAIN_WIDTH - GUTTER

const run = (text, options = {}) => new TextRun({ text, font: FONT, ...options })
const gap = (size) => new Paragraph({ spacing: { after: 0 }, children: [run('', { size })] })

function sectionTitle(heading, headingColor) {
  return new Paragraph({
    spacing: { before: 0, after: 150 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 4 } },
    children: [
      run(String(heading || '').toUpperCase(), {
        color: headingColor ? stripHash(headingColor) : MUTED,
        size: fontSize(11.5),
        characterSpacing: 20,
      }),
    ],
  })
}

/** Organisation / date / location on one line, aligned with tab stops. */
function metaRow(primary, date, place, width, accent) {
  const children = docxRuns(primary, { color: accent, size: fontSize(12) })
  const stops = []
  if (!isEmptyText(date)) {
    stops.push({ type: TabStopType.LEFT, position: Math.round(width * 0.48) })
    children.push(run('\t', { color: MUTED, size: fontSize(11) }), ...docxRuns(date, { color: MUTED, size: fontSize(11) }))
  }
  if (!isEmptyText(place)) {
    stops.push({ type: TabStopType.LEFT, position: Math.round(width * 0.76) })
    children.push(run('\t', { color: MUTED, size: fontSize(11) }), ...docxRuns(place, { color: MUTED, size: fontSize(11) }))
  }
  return new Paragraph({ spacing: { before: 30, after: 40 }, tabStops: stops, children })
}

function bulletList(items) {
  return items.map(
    (item) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 30, line: 280 },
        children: docxRuns(item.text, { color: TEXT, size: fontSize(11.5) }),
      }),
  )
}

const renderers = {
  summary: (section) =>
    isEmptyText(section.text)
      ? []
      : [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { line: 300, after: 0 },
            children: docxRuns(section.text, { color: TEXT, size: fontSize(11.5) }),
          }),
        ],

  experience: (section, width, accent) =>
    (section.items || []).flatMap((item, index) => [
      ...(index ? [gap(12)] : []),
      new Paragraph({
        spacing: { after: 0 },
        children: docxRuns(item.title, { bold: true, color: INK, size: fontSize(13.5) }),
      }),
      metaRow(item.organization, item.dateRange, item.location, width, accent),
      ...bulletList(filled(item.bullets)),
    ]),

  bullets: (section) => bulletList(filled(section.items)),

  education: (section, width, accent) =>
    (section.items || []).flatMap((item, index) => [
      ...(index ? [gap(12)] : []),
      new Paragraph({
        spacing: { after: 0 },
        children: docxRuns(item.degree, { bold: true, color: INK, size: fontSize(13.5) }),
      }),
      metaRow(item.institution, item.date, item.location, width, accent),
      ...[item.score, item.badge]
        .filter((line) => !isEmptyText(line))
        .map(
          (line) =>
            new Paragraph({
              spacing: { after: 0 },
              children: docxRuns(line, { bold: true, color: accent, size: fontSize(11) }),
            }),
        ),
    ]),

  skillGroups: (section, width, accent) =>
    (section.groups || []).flatMap((group, index) => {
      const items = filled(group.items)
      const joined = []
      items.forEach((item, itemIndex) => {
        if (itemIndex) joined.push(run(', ', { color: TEXT, size: fontSize(11.5) }))
        joined.push(...docxRuns(item.text, { color: TEXT, size: fontSize(11.5) }))
      })
      return [
        ...(index ? [gap(10)] : []),
        ...(isEmptyText(group.label)
          ? []
          : [
              new Paragraph({
                spacing: { after: 30 },
                children: docxRuns(group.label, { color: accent, size: fontSize(12.5) }),
              }),
            ]),
        new Paragraph({ spacing: { after: 0, line: 290 }, children: joined }),
      ]
    }),

  highlights: (section, width, accent) =>
    (section.items || []).flatMap((item, index) => {
      const isSide = section.column === 'side'
      const titleRuns = []
      if (!isEmptyText(item.icon)) titleRuns.push(run(`${plainText(item.icon)}  `, { color: accent, size: fontSize(12.5) }))
      titleRuns.push(
        ...docxRuns(item.title, isSide ? { bold: true, color: INK, size: fontSize(12.5) } : { color: accent, size: fontSize(12.5) }),
      )
      return [
        ...(index ? [gap(10)] : []),
        new Paragraph({ spacing: { after: 30 }, children: titleRuns }),
        ...(isEmptyText(item.description)
          ? []
          : [
              new Paragraph({
                spacing: { after: 0, line: 280 },
                children: docxRuns(item.description, { color: '444444', size: fontSize(11.5) }),
              }),
            ]),
      ]
    }),

  ratings: (section, width) =>
    (section.items || []).map((item) => {
      const dots = '●'.repeat(Math.max(0, Math.min(RATING_MAX, item.level ?? 0))).padEnd(RATING_MAX, '○')
      const children = docxRuns(item.label, { color: INK, size: fontSize(12.5) })
      children.push(run('\t', {}))
      if (!isEmptyText(item.note)) children.push(...docxRuns(item.note, { color: '555555', size: fontSize(11.5) }))
      children.push(run(`  ${dots}`, { color: INK, size: fontSize(11) }))
      return new Paragraph({
        spacing: { after: 60 },
        tabStops: [{ type: TabStopType.RIGHT, position: width }],
        children,
      })
    }),
}

function renderSection(section, width, accent, isFirst) {
  const render = renderers[section.type]
  if (!render) return []
  const body = render(section, width, accent)
  if (!body.length && !section.heading) return []
  return [...(isFirst ? [] : [gap(18)]), sectionTitle(section.heading, section.headingColor), ...body]
}

function column(sections, width, accent) {
  const blocks = sections.flatMap((section, index) => renderSection(section, width, accent, index === 0))
  return blocks.length ? [...blocks, new Paragraph({ spacing: { after: 0 }, children: [] })] : [new Paragraph({ children: [] })]
}

function head(header, accent) {
  const blocks = [
    new Paragraph({
      spacing: { after: 40 },
      children: docxRuns(header.name, { bold: true, color: INK, size: fontSize(34) }),
    }),
  ]
  if (!isEmptyText(header.title)) {
    blocks.push(
      new Paragraph({ spacing: { after: 120 }, children: docxRuns(header.title, { color: accent, size: fontSize(14.5) }) }),
    )
  }
  const contactOptions = { color: '555555', size: fontSize(11.5) }
  const contacts = []
  for (const value of [header.phone, header.email, header.website, header.address].filter((v) => !isEmptyText(v))) {
    if (contacts.length) contacts.push(run('     ', contactOptions))
    contacts.push(...docxRuns(value, contactOptions))
  }
  if (contacts.length) blocks.push(new Paragraph({ spacing: { after: 0 }, children: contacts }))
  return blocks
}

/** Build a Word document that mirrors the Modern Minimal HTML template. */
export function buildDocx(resume) {
  const accent = stripHash(resume.theme?.accent || DEFAULT_ACCENT)
  const visible = resume.sections.filter((s) => s.visible !== false)
  const main = visible.filter((s) => s.column !== 'side')
  const side = visible.filter((s) => s.column === 'side')

  const body = new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [MAIN_WIDTH, SIDE_WIDTH],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          shadedCell({
            width: MAIN_WIDTH,
            margins: { top: 0, bottom: 0, left: 0, right: GUTTER },
            children: column(main, MAIN_TEXT_WIDTH, accent),
          }),
          shadedCell({
            width: SIDE_WIDTH,
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: column(side, SIDE_WIDTH, accent),
          }),
        ],
      }),
    ],
  })

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: fontSize(11.5), color: TEXT } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: px(40), bottom: px(36), left: PAGE_MARGIN, right: PAGE_MARGIN },
          },
        },
        children: [...head(resume.header, accent), new Paragraph({ spacing: { after: 300 }, children: [] }), body],
      },
    ],
  })
}
