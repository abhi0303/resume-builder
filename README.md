# Resume Builder

A front-end-only CV editor: edit on the left, see a live A4 page on the right, download
the result as **PDF** or **DOCX**. No backend — the document lives in `localStorage`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Design system

Controls share tokens rather than each picking their own size, which is what keeps the bar
and the editor looking like one app:

| Token | Value | Used by |
| --- | --- | --- |
| `--control-h` | 34px | bar buttons, template select, `.btn`, download actions |
| `--control-h-sm` | 28px | `.btn--sm`, inline column selects |
| `--radius-sm` / `--radius` / `--radius-lg` | 8 / 10 / 14px | controls / cards, menus, popovers / dialogs |

Section cards follow the same idea. The header is sticky and fully opaque, so while you
scroll a long section you can still see which one you are in and where the next begins.
An opaque strip (`.app__editor::before`, also sticky) is pinned above the headers and
spans the gutters, so content scrolling into the band between the toolbar and a stuck
header is masked rather than showing through and being sliced by the header's edge. It reads in
two rows — the heading itself, then what the section **is** (type, column) beside what you
can **do** with it (heading colour, reorder, hide, duplicate). Delete ends the heading row
behind a thin divider, drawn as a circled cross.

Both rows wrap rather than overflow, so on a narrow phone a control drops onto another
line inside the card instead of spilling past its edge; only the heading input and the
column select flex, and under 500px the character counter yields first (the cap is still
enforced by `maxLength`) so delete always keeps its place.

Two constraints keep that header reliable, and both are easy to break by accident:
nothing inside the editor may create a stacking context — a disabled control muted with
`opacity` paints in the positioned layer and lands *on top* of the pinned header, so
disabled states mute with colour instead — and the header itself carries no `z-index`, so
the heading-colour popover is not trapped inside it. While pinned it also drops its corner
radius (`useStuck`, via `IntersectionObserver`), because rounded corners over a straight
card edge let the white body show through behind them.

Surfaces step in three tones — tinted editor ground (`--editor-bg`), white cards, and a
deeper header again (`--card-head`) — so each card reads as its own container. Controls are drawn from one
line-icon set rather than text glyphs, so visibility is an eye that becomes a struck-through
eye when hidden. Under 500px the meta takes its own line and the actions align right
beneath it, so the header keeps a predictable shape instead of interleaving.

The app bar groups by purpose — what the CV **is** on the left (template, theme colour),
what to **do** with it on the right — with exactly one primary action (PDF, filled teal),
one outlined secondary (DOCX) and the rest plain. On phones the bar stays a single row:
the template select flexes to fill, PDF remains, and samples, DOCX and Clear fold into a
single overflow menu.

## Install it as an app (PWA)

The build is installable and works offline: `manifest.webmanifest`, maskable and Apple
touch icons, `theme-color`, and a service worker (`public/sw.js`) that serves navigations
network-first — so a new deploy is picked up when online — and content-hashed build assets
cache-first. The worker only registers in production builds, so `npm run dev` is unaffected.

Install from Chrome/Edge ("Install app") or iOS Safari ("Add to Home Screen"). Your CV
lives in `localStorage`, so it survives being offline and reopening the app.

`start_url`, `scope`, the icon paths and the service-worker registration are all relative
to the deployed base, so one build works at the domain root or under a sub-path — this
repo publishes to GitHub Pages under `/resume-builder/` (see `vite.config.js`).

### On a phone

Below 860px the split becomes one pane at a time with an **Edit / Preview** switcher at
the bottom, in thumb reach. Below 560px paired fields stack, and the longest button labels
shorten ("Download DOCX" becomes "DOCX"). Inputs are 16px on small screens so iOS does not
zoom when a field takes focus, tap targets grow on touch pointers, the layout uses `dvh`
so the collapsing address bar does not clip it, and safe-area insets keep the top bar clear
of the notch.

## Templates

Two ship today, picked from the top bar. The document is template-agnostic — the same CV
renders in either, and switching never drops content.

| Template | Look | Suits |
| --- | --- | --- |
| **Classic Teal** (default) | Dark rounded banner, teal rules, shaded education cards | Academic and research profiles |
| **Modern Minimal** | No banner, plain typographic header, ruled grey headings, one accent colour | Technology and product profiles |

Each ships a sample document — **Load sample ▾** offers Abhinav Singh (Classic Teal) and
Addison Harris (Modern Minimal), and loading one brings its template with it. A fresh
visit starts on Classic Teal with the Abhinav Singh sample.

Templates may present the same data differently: grouped tags are a bulleted list in
Classic Teal and comma-separated prose in Modern Minimal, and titled cards run two-up in
Modern Minimal's main column so certifications stay compact.

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

Seven block shapes are available: summary paragraph, experience timeline, bullet list,
education cards, grouped tags, **titled cards** (title + description, with an optional
icon — projects, achievements, certifications) and **rated lists** (a label with a level
out of five — languages, proficiencies).

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

- **Template colour** — in the top bar; each template declares what it exposes via
  `themeFields`. Classic Teal offers a header background (its banner text re-contrasts
  automatically from the background's relative luminance, so a pale banner switches to
  dark text instead of turning white-on-white); Modern Minimal offers its accent colour.
- **Heading colour** — the swatch beside each section heading. Its panel carries an
  **Apply to all headings** checkbox: ticked (the default), one pick repaints every
  heading; unticked, it changes only that section. The choice is remembered.
  Clearing a heading colour returns it to the template's own accent.

Heading colour drives both the heading text and its rule, in the preview, the PDF and the
DOCX. Section heading *text* stays plain — its type styling belongs to the template.

### Dialogs

Confirmations (delete a section, load a sample, clear the CV) and the download prompt use
in-app modals rather than `window.confirm`/`window.prompt`, so they match the design. Both
return promises:

```js
if (await confirm({ title: 'Delete section?', danger: true })) …
const name = await prompt({ title: 'Download PDF', input: { defaultValue, suffix: '.pdf' } })
```

Escape and the backdrop cancel; Enter confirms.

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
  data/sampleResume.js     seed document (Abhinav Singh)
  data/developerResume.js  second sample (Addison Harris)
  data/samples.js          the sample picker's list
  state/resumeReducer.js   generic reducer — knows list shapes, not meanings
  state/ResumeContext.jsx  provider + debounced localStorage persistence
  state/FormattingContext.jsx  links the focused field to the formatting toolbar
  state/DialogContext.jsx  promise-based confirmation modals
  state/useSplitPane.js    drag-to-resize split, persisted separately from the CV
  utils/color.js           hex parsing, luminance and mixing for contrast-safe theming
  templates/index.js       template registry
  templates/classicTeal/   ClassicTeal.jsx + classicTeal.css + docx.js + theme.js
  templates/modernMinimal/ ModernMinimal.jsx + modernMinimal.css + docx.js + theme.js
  utils/swatches.js        shared colour swatch sets
  components/AppIcon.jsx   the app mark shown in the top bar
  components/MobileTabs.jsx  Edit/Preview switcher for narrow screens
public/
  icon.svg, icon-*.png     app icons (192, 512, maskable, apple-touch)
  manifest.webmanifest     PWA manifest
  sw.js                    offline service worker
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
  themeFields: [                             // colours the top bar offers for it
    { key: 'accent', label: 'Accent colour', title: 'Accent colour',
      fallback: '#3cb9d2', swatches: ACCENT_SWATCHES },
  ],
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

Both download buttons open a dialog to name the file first. It is pre-filled from the CV's
own header (`ABHINAV_SINGH_CV`) and the extension is fixed alongside the field, so the name
follows whoever the CV is for and can be changed per download. Names are sanitised —
illegal characters and path segments are stripped, and a blank name is rejected.

- **PDF** — the preview node is cloned at natural size (editor-only chrome marked
  `data-export-ignore` is stripped), rasterised with `html2canvas` at 2× and sliced across
  A4 pages with `jsPDF`. Output is pixel-identical to the preview; text is not selectable.
- **DOCX** — rebuilt with the `docx` library as native Word content: a shaded table for
  the banner, a two-column borderless table for the body, shaded nested tables for the
  education cards, real Word bullets, and right tab stops for the dates. Fully editable in
  Word/Google Docs.
- Both libraries are dynamically imported, so they are only downloaded when a user
  actually exports (initial JS is ~174 kB).
