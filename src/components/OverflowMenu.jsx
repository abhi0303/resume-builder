import MenuButton from './ui/MenuButton'
import { SAMPLES } from '../data/samples'

/** Everything that does not fit the phone header, in one tidy menu. */
export default function OverflowMenu({ onLoadSample, onExportDocx, onClear, busy }) {
  return (
    <MenuButton className="tb-btn tb-btn--icon topbar__more" title="More actions" label={<span aria-hidden="true">⋯</span>}>
      <div className="menu__label">Load sample</div>
      {SAMPLES.map((sample) => (
        <button type="button" key={sample.id} className="menu__item" role="menuitem" onClick={() => onLoadSample(sample.id)}>
          <span className="menu__title">{sample.person}</span>
          <span className="menu__hint">{sample.template}</span>
        </button>
      ))}
      <div className="menu__sep" />
      <button type="button" className="menu__item" role="menuitem" disabled={busy === 'docx'} onClick={onExportDocx}>
        <span className="menu__title">{busy === 'docx' ? 'Building…' : 'Download DOCX'}</span>
        <span className="menu__hint">Editable Word document</span>
      </button>
      <button type="button" className="menu__item menu__item--danger" role="menuitem" onClick={onClear}>
        <span className="menu__title">Clear CV</span>
        <span className="menu__hint">Start from a blank document</span>
      </button>
    </MenuButton>
  )
}
