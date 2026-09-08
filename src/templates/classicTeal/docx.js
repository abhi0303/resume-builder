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
import { RATING_MAX } from '../../data/sectionTypes'
import { stripHash } from '../../utils/color'
import { DEFAULT_BANNER, bannerPalette } from './theme'

/* Palette mirrors classicTeal.css */
const INK = '14384A'
const ACCENT = '2B7C8F'
const RULE = '1C5265'
const TEXT = '333333'
const MUTED = '666666'
const CARD = 'EEF2F4'
const GOLD = 'B8860B'
const FONT = 'Arial'

const PAGE_MARGIN = px(36)
const CONTENT_WIDTH = 11906 - PAGE_MARGIN * 2
const GUTTER = px(30)
const MAIN_WIDTH = Math.round(CONTENT_WIDTH * 0.61)
const SIDE_WIDTH = CONTENT_WIDTH - MAIN_WIDTH
const MAIN_TEXT_WIDTH = MAIN_WIDTH - GUTTER
const SIDE_TEXT_WIDTH = SIDE_WIDTH

const run = (text, options = {}) => new TextRun({ text, font: FONT, ...options })

function sectionTitle(heading, headingColor) {
  const color = headingColor ? stripHash(headingColor) : ACCENT
  const rule = headingColor ? stripHash(headingColor) : RULE
  return new Paragraph({
    spacing: { before: 0, after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: rule, space: 4 } },
    children: [run(String(heading || '').toUpperCase(), { bold: true, color, size: fontSize(12.5), characterSpacing: 8 })],
  })
}

function headedRow(left, right, width, leftOptions, rightOptions) {
  const children = docxRuns(left, leftOptions)
  if (!isEmptyText(right)) {
    children.push(run('\t', rightOptions), ...docxRuns(right, rightOptions))
  }
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: width }],
    spacing: { after: 0 },
    children,
  })
}

/* One renderer per section type — mirrors ClassicTeal.jsx. */
const renderers = {
  summary: (section) =>
    isEmptyText(section.text)
      ? []
      : [
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 300, after: 0 },
            children: docxRuns(section.text, { color: TEXT, size: fontSize(11.5) }),
          }),
        ],

  experience: (section, width) =>
    (section.items || []).flatMap((item, index) => {
      const blocks = []
      if (index > 0) blocks.push(new Paragraph({ spacing: { after: 0 }, children: [run('', { size: 12 })] }))
      blocks.push(
        headedRow(
          item.title,
          item.dateRange,
          width,
          { bold: true, color: '1A1A1A', size: fontSize(12.5) },
          { color: MUTED, size: fontSize(10.5) },
        ),
      )
      if (!isEmptyText(item.organization) || !isEmptyText(item.location)) {
        const org = [...docxRuns(item.organization, { italics: true, color: ACCENT, size: fontSize(11) })]
        if (!isEmptyText(item.location)) {
          if (org.length) org.push(run(' · ', { italics: true, color: ACCENT, size: fontSize(11) }))
          org.push(...docxRuns(item.location, { italics: true, color: ACCENT, size: fontSize(11) }))
        }
        blocks.push(new Paragraph({ spacing: { before: 20, after: 60 }, children: org }))
      }
      blocks.push(...bulletList(filled(item.bullets)))
      return blocks
    }),

  bullets: (section) => bulletList(filled(section.items)),

  education: (section, width) =>
    (section.items || []).map(
      (item) =>
        new Table({
          width: { size: width, type: WidthType.DXA },
          columnWidths: [width],
          layout: TableLayoutType.FIXED,
          borders: NO_BORDERS,
          rows: [
            new TableRow({
              children: [
                shadedCell({
                  width,
                  fill: CARD,
                  margins: { top: px(8), bottom: px(8), left: px(10), right: px(10) },
                  children: [
                    headedRow(
                      item.degree,
                      item.date,
                      width - px(24),
                      { bold: true, color: INK, size: fontSize(12) },
                      { color: MUTED, size: fontSize(10.5) },
                    ),
                    ...[item.institution, item.location, item.score]
                      .filter((line) => !isEmptyText(line))
                      .map(
                        (line) =>
                          new Paragraph({
                            spacing: { before: 60, after: 0 },
                            children: docxRuns(line, { color: '7A7A7A', size: fontSize(10.5) }),
                          }),
                      ),
                    ...(isEmptyText(item.badge)
                      ? []
                      : [
                          new Paragraph({
                            spacing: { before: 80, after: 0 },
                            children: [
                              run('■ ', { bold: true, color: GOLD, size: fontSize(10.5) }),
                              ...docxRuns(item.badge, { bold: true, color: GOLD, size: fontSize(10.5) }),
                            ],
                          }),
                        ]),
                  ],
                }),
              ],
            }),
          ],
        }),
    ),

  highlights: (section) =>
    (section.items || []).flatMap((item, index) => {
      const title = []
      if (!isEmptyText(item.icon)) title.push(run(`${plainText(item.icon)}  `, { color: ACCENT, size: fontSize(11.5) }))
      title.push(...docxRuns(item.title, { bold: true, color: INK, size: fontSize(11.5) }))
      return [
        ...(index ? [new Paragraph({ spacing: { after: 0 }, children: [run('', { size: 8 })] })] : []),
        new Paragraph({ spacing: { after: 20 }, children: title }),
        ...(isEmptyText(item.description)
          ? []
          : [
              new Paragraph({
                spacing: { after: 0, line: 270 },
                children: docxRuns(item.description, { color: '555555', size: fontSize(11) }),
              }),
            ]),
      ]
    }),

  ratings: (section, width) =>
    (section.items || []).map((item) => {
      const dots = '●'.repeat(Math.max(0, Math.min(RATING_MAX, item.level ?? 0))).padEnd(RATING_MAX, '○')
      const children = docxRuns(item.label, { color: TEXT, size: fontSize(11) })
      children.push(run('\t', {}))
      if (!isEmptyText(item.note)) children.push(...docxRuns(item.note, { color: MUTED, size: fontSize(10.5) }))
      children.push(run(`  ${dots}`, { color: ACCENT, size: fontSize(10) }))
      return new Paragraph({
        spacing: { after: 40 },
        tabStops: [{ type: TabStopType.RIGHT, position: width }],
        children,
      })
    }),

  skillGroups: (section) =>
    (section.groups || []).flatMap((group, index) => {
      const blocks = []
      if (index > 0) blocks.push(new Paragraph({ spacing: { after: 0 }, children: [run('', { size: 10 })] }))
      if (!isEmptyText(group.label)) {
        blocks.push(
          new Paragraph({
            spacing: { after: 60 },
            children: docxRuns(group.label, { bold: true, color: ACCENT, size: fontSize(11.5) }),
          }),
        )
      }
      blocks.push(
        ...filled(group.items).map(
          (item) =>
            new Paragraph({
              spacing: { after: 20 },
              children: [
                run('■ ', { color: ACCENT, size: fontSize(9) }),
                ...docxRuns(item.text, { color: TEXT, size: fontSize(11) }),
              ],
            }),
        ),
      )
      return blocks
    }),
}

function bulletList(items) {
  return items.map(
    (item) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40, line: 280 },
        children: docxRuns(item.text, { color: TEXT, size: fontSize(11.5) }),
      }),
  )
}

function renderSection(section, width, isFirst) {
  const render = renderers[section.type]
  if (!render) return []
  const body = render(section, width)
  if (!body.length && !section.heading) return []
  return [
    ...(isFirst ? [] : [new Paragraph({ spacing: { after: 0 }, children: [run('', { size: 16 })] })]),
    sectionTitle(section.heading, section.headingColor),
    ...body,
  ]
}

function column(sections, width) {
  const blocks = sections.flatMap((section, index) => renderSection(section, width, index === 0))
  // A table cell must end with a paragraph for Word to render it reliably.
  return blocks.length ? [...blocks, new Paragraph({ spacing: { after: 0 }, children: [] })] : [new Paragraph({ children: [] })]
}

function banner(header, theme) {
  const background = theme?.bannerBg || DEFAULT_BANNER
  const palette = bannerPalette(background)
  const contactOptions = { color: stripHash(palette.contact), size: fontSize(11) }
  const contactChildren = []
  for (const part of [header.phone, header.email].filter((value) => !isEmptyText(value))) {
    if (contactChildren.length) contactChildren.push(run('   |   ', contactOptions))
    contactChildren.push(...docxRuns(part, contactOptions))
  }

  const children = [
    new Paragraph({
      spacing: { after: 60 },
      children: docxRuns(header.name, {
        bold: true,
        color: stripHash(palette.name),
        size: fontSize(38),
        characterSpacing: 8,
      }),
    }),
  ]
  if (!isEmptyText(header.title)) {
    children.push(
      new Paragraph({
        spacing: { after: 0 },
        children: docxRuns(header.title, { color: stripHash(palette.title), size: fontSize(14) }),
      }),
    )
  }
  children.push(
    new Paragraph({
      spacing: { before: 160, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: stripHash(palette.rule), space: 1 } },
      children: [],
    }),
  )
  if (contactChildren.length) children.push(new Paragraph({ spacing: { after: 20 }, children: contactChildren }))
  if (!isEmptyText(header.address)) {
    children.push(new Paragraph({ spacing: { after: 20 }, children: docxRuns(header.address, contactOptions) }))
  }

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          shadedCell({
            width: CONTENT_WIDTH,
            fill: stripHash(background),
            margins: { top: px(22), bottom: px(20), left: px(26), right: px(26) },
            children,
          }),
        ],
      }),
    ],
  })
}

/** Build a Word document that mirrors the Classic Teal HTML template. */
export function buildDocx(resume) {
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
            children: column(main, MAIN_TEXT_WIDTH),
          }),
          shadedCell({
            width: SIDE_WIDTH,
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: column(side, SIDE_TEXT_WIDTH),
          }),
        ],
      }),
    ],
  })

  return new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: fontSize(11.5), color: TEXT } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: px(34), bottom: px(34), left: PAGE_MARGIN, right: PAGE_MARGIN },
          },
        },
        children: [banner(resume.header, resume.theme), new Paragraph({ spacing: { after: 260 }, children: [] }), body],
      },
    ],
  })
}
