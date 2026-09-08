import ColorButton from './ui/ColorButton'

/** Renders whichever theme colours the active template declares. */
export default function ThemeMenu({ template, theme, dispatch }) {
  return (template.themeFields || []).map((field) => {
    const value = theme?.[field.key] || field.fallback
    return (
      <ColorButton
        key={field.key}
        className="tb-btn tb-btn--icon"
        title={field.title}
        align="right"
        value={value}
        swatches={field.swatches}
        onChange={(color) => dispatch({ type: 'UPDATE_THEME', patch: { [field.key]: color || field.fallback } })}
      >
        <span className="theme-chip" style={{ background: value }} />
        <span className="visually-hidden">{field.label}</span>
      </ColorButton>
    )
  })
}
