import { templates } from '../templates'
import AppIcon from './AppIcon'
import ThemeMenu from './ThemeMenu'
import SampleMenu from './SampleMenu'
import OverflowMenu from './OverflowMenu'

/**
 * Application bar.
 *
 * Every control is one height, one radius and one type size, grouped by purpose:
 * what the CV *is* on the left (template, colour) and what to *do* with it on the
 * right, ending in the single primary action. On a phone the secondary actions
 * collapse into one overflow menu rather than wrapping onto a second row.
 */
export default function Toolbar({ resume, template, dispatch, onExportPdf, onExportDocx, onLoadSample, onClear, busy }) {
  return (
    <header className="topbar">
      <div className="topbar__brand" title="Resume Builder">
        <AppIcon size={28} />
        <span className="visually-hidden">Resume Builder</span>
      </div>

      <div className="topbar__group topbar__group--doc">
        <select
          id="template"
          className="tb-select"
          aria-label="Template"
          value={resume.templateId}
          onChange={(event) => dispatch({ type: 'SET_TEMPLATE', templateId: event.target.value })}
        >
          {templates.map((item) => (
            <option key={item.id} value={item.id} title={item.description}>
              {item.name}
            </option>
          ))}
        </select>
        <ThemeMenu template={template} theme={resume.theme} dispatch={dispatch} />
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__group topbar__group--actions">
        <SampleMenu onPick={onLoadSample} className="tb-btn topbar__optional" />
        <button type="button" className="tb-btn topbar__optional" onClick={onClear}>
          Clear
        </button>
        <span className="tb-divider topbar__optional" />
        <button type="button" className="tb-btn tb-btn--outline topbar__optional" disabled={busy === 'docx'} onClick={onExportDocx}>
          {busy === 'docx' ? 'Building…' : 'DOCX'}
        </button>
        <button type="button" className="tb-btn tb-btn--primary" disabled={busy === 'pdf'} onClick={onExportPdf}>
          {busy === 'pdf' ? 'Rendering…' : 'PDF'}
        </button>
      </div>

      <OverflowMenu onLoadSample={onLoadSample} onExportDocx={onExportDocx} onClear={onClear} busy={busy} />
    </header>
  )
}
