# Resume Builder

A front-end-only CV editor: edit on the left, see a live A4 page on the right, download
the result as **PDF** or **DOCX**. No backend — the document lives in `localStorage`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## What is fixed and what is dynamic

The **template** is the only fixed thing: its grid, colours, type scale and spacing are
locked so the exported CV always looks like the design.

Everything inside it is data:

- Every section carries its own **editable heading**, so the same block shape can be used
  many times. Add a second *Experience timeline* and title it `INTERNSHIP EXPERIENCE`;
  add a second *Summary paragraph* and title it `RESEARCH INTERESTS`. Identical styling,
  different content.
- Sections can be reordered, moved between the main and side column, hidden, duplicated
  and deleted.
- Header fields, bullet points, education cards and skill groups are all add/remove/reorder.

### Workspace layout

The editor and the preview are split by a drag handle. Drag it anywhere to resize, or use
the chevrons to jump between four stops — hidden, narrow, default and widest. Dragging
past the left edge collapses the editor entirely so the preview gets the full window;
the `›` arrow brings it back. Double-click the bar (or press Enter on it) to restore the
default split, and the arrow keys nudge it 24px at a time.

The width is remembered in `localStorage` under the layout key, separate from the CV
itself — how wide you like the editor is a workspace preference, not part of the document.
The preview re-fits its zoom to whatever room it has left.

### Text formatting

Click into any field and the toolbar above the editor becomes active. It formats the
current selection — or, with nothing selected, the whole field:

| Control | Notes |
| --- | --- |
| Bold / Italic / Underline | toggles, reflecting the selection's current state |
| Size − / + | 70%–200% **relative** to the size the template gives that field |
| Text colour | ten swatches, the OS colour picker and a hex box — any colour is reachable |
| Highlight | same picker, ten highlight swatches plus "none" |
| Clear | strips every mark from the selection |

Sizes are stored as percentages rather than absolute points, so formatted text stays
proportional in every template and in the DOCX export (125% of an 8.5pt field becomes
10.5pt in Word, not a hard-coded size).

Formatting survives both exports: the PDF because it rasterises the preview, and the DOCX
because each run maps to a Word `TextRun` with bold/italic/underline/colour/size/shading.

### Colours

Every colour control is the same component: curated swatches for speed, plus the native
OS picker and a hex field so nothing is out of reach.

- **Header background** — in the top bar. Banner text re-contrasts automatically from the
  background's relative luminance, so a pale banner switches to dark text instead of
  turning white-on-white. The derived defaults reproduce the original design.
- **Heading colour** — the swatch beside each section heading. Its panel carries an
  **Apply to all headings** checkbox: ticked (the default), one pick repaints every
  heading; unticked, it changes only that section. The choice is remembered.
  Clearing a heading colour returns it to the template's own accent.

Heading colour drives both the heading text and its rule, in the preview, the PDF and the
DOCX. Section heading *text* stays plain — its type styling belongs to the template.

### Dialogs

Confirmations (delete a section, load the sample, clear the CV) use an in-app modal rather
than `window.confirm`, so prompts match the design. `useConfirm()` returns a promise:

```js
if (await confirm({ title: 'Delete section?', danger: true })) …
```

### Character budgets

Because the layout is fixed, every text field has a character budget shown as a live
counter (`390 / 720`) that turns amber at 85% and red at the cap. The cap is enforced, so
a paste can't silently break the page. Budgets live in one place per section type
(`src/data/sectionTypes.js`) and any template can override them.

The preview also draws a dashed **page-break guide** whenever the content spills past one
A4 page, and reports the page count in the preview toolbar.

## Architecture

```
src/
  utils/richText.js        rich-text run model (marks, ranges, selection queries)
  utils/richTextDom.js     contenteditable bridge: serialise, parse, selection offsets
  data/sectionTypes.js     section type registry (shape, defaults, character budgets)
  data/sampleResume.js     seed document
  state/resumeReducer.js   generic reducer — knows list shapes, not meanings
  state/ResumeContext.jsx  provider + debounced localStorage persistence
  state/FormattingContext.jsx  links the focused field to the formatting toolbar
  state/DialogContext.jsx  promise-based confirmation modals
  state/useSplitPane.js    drag-to-resize split, persisted separately from the CV
  utils/color.js           hex parsing, luminance and mixing for contrast-safe theming
  templates/index.js       template registry
  templates/classicTeal/   ClassicTeal.jsx + classicTeal.css + docx.js
  components/FormattingToolbar.jsx  the formatting bar
  components/RichText.jsx  renders a rich-text value inside a template
  components/ThemeMenu.jsx  template-level colours (header background)
  components/Splitter.jsx  the drag handle between editor and preview
  components/ui/ColorButton.jsx  swatches + OS picker + hex, reused everywhere
  templates/classicTeal/theme.js  banner palette derived from the chosen background
  components/editor/       editor panel, section cards, per-type editors
  components/preview/      A4 preview with zoom + page-break guides
  export/exportPdf.js      DOM -> canvas -> paginated A4 PDF (template-agnostic)
  export/exportDocx.js     delegates to the active template's Word builder
```

A field's value is either a plain string or an array of runs
(`{ text, bold?, italic?, underline?, color?, highlight?, size? }`). Plain strings stay
valid, so saved documents and seed data need no migration — everything reads values
through `toRuns` / `plainText`.

The reducer never switches on what a section *means*. It reads `SECTION_SHAPE` to learn
that an `experience` section keeps entries under `items` and each entry keeps children
under `bullets`, then applies the same generic add/update/move/remove actions to any type.

### Adding a template

1. Create `src/templates/<id>/` with a React renderer and a stylesheet.
   The renderer receives `{ resume }` and should render sections it recognises, skipping
   the rest — see `ClassicTeal.jsx`'s `renderers` map.
2. Add a `docx.js` exporting `buildDocx(resume)` (see `src/export/docxKit.js` for the
   px→twip helpers that keep the Word output in step with the CSS).
3. Register it in `src/templates/index.js`:

```js
{
  id: 'myTemplate',
  name: 'My Template',
  tagline: 'Single column · serif',
  page: { width: 794, height: 1123 },       // A4 @96dpi
  Preview: MyTemplate,
  loadDocxBuilder: () => import('./myTemplate/docx').then((m) => m.buildDocx),
  limits: { header: { name: 30 } },          // optional per-template overrides
}
```

PDF export needs no work: it rasterises whatever the renderer paints.

### Adding a section type

1. Add an entry to `SECTION_TYPES` and its shape to `SECTION_SHAPE` in
   `src/data/sectionTypes.js` (label, hint, default heading/column, character budgets).
2. Add an editor to `src/components/editor/sections/` and register it in that folder's
   `index.js`.
3. Add a renderer to each template — the HTML `renderers` map and the DOCX one. Render
   text with `<RichText value={…} />` (HTML) and `docxRuns(value, baseOptions)` (Word) so
   the field picks up formatting for free.

It then appears in the *Add a section* menu automatically.

## Export notes

- **PDF** — the preview node is cloned at natural size (editor-only chrome marked
  `data-export-ignore` is stripped), rasterised with `html2canvas` at 2× and sliced across
  A4 pages with `jsPDF`. Output is pixel-identical to the preview; text is not selectable.
- **DOCX** — rebuilt with the `docx` library as native Word content: a shaded table for
  the banner, a two-column borderless table for the body, shaded nested tables for the
  education cards, real Word bullets, and right tab stops for the dates. Fully editable in
  Word/Google Docs.
- Both libraries are dynamically imported, so they are only downloaded when a user
  actually exports (initial JS is ~174 kB).
