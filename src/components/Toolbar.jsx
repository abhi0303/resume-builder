import { templates } from '../templates'
import ThemeMenu from './ThemeMenu'

export default function Toolbar({ resume, dispatch, onExportPdf, onExportDocx, onLoadSample, onClear, busy }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <strong>Resume Builder</strong>
        <span>edit on the left · live A4 preview on the right</span>
      </div>

      <div className="topbar__group">
        <label htmlFor="template" style={{ fontSize: 12, color: '#a9c2cc' }}>
          Template
        </label>
        <select
          id="template"
          value={resume.templateId}
          onChange={(event) => dispatch({ type: 'SET_TEMPLATE', templateId: event.target.value })}
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} — {template.tagline}
            </option>
          ))}
        </select>
        <ThemeMenu theme={resume.theme} dispatch={dispatch} />
      </div>

      <div className="topbar__group">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onLoadSample}>
          Load sample
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
          Clear
        </button>
        <button type="button" className="btn" disabled={busy === 'docx'} onClick={onExportDocx}>
          {busy === 'docx' ? 'Building…' : 'Download DOCX'}
        </button>
        <button type="button" className="btn btn--primary" disabled={busy === 'pdf'} onClick={onExportPdf}>
          {busy === 'pdf' ? 'Rendering…' : 'Download PDF'}
        </button>
      </div>
    </header>
  )
}
