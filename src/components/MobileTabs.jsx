/** Pane switcher shown only on narrow screens, where a side-by-side split is
 *  unusable. Sits at the bottom so it stays in reach on a phone. */
export default function MobileTabs({ view, onChange }) {
  const tab = (id, label, path) => (
    <button
      type="button"
      className={`mobile-tab${view === id ? ' mobile-tab--on' : ''}`}
      aria-pressed={view === id}
      onClick={() => onChange(id)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  )

  return (
    <nav className="mobile-tabs" aria-label="Switch between editing and preview">
      {tab('edit', 'Edit', 'M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16z')}
      {tab('preview', 'Preview', 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5')}
    </nav>
  )
}
