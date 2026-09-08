import ColorButton, { SURFACE_SWATCHES } from './ui/ColorButton'

const DEFAULT_BANNER = '#14384a'

/** Template-level colours. Text inside the banner re-contrasts automatically. */
export default function ThemeMenu({ theme, dispatch }) {
  const bannerBg = theme?.bannerBg || DEFAULT_BANNER
  return (
    <ColorButton
      className="btn btn--ghost btn--sm btn--theme"
      title="Header background colour"
      align="right"
      value={bannerBg}
      swatches={SURFACE_SWATCHES}
      onChange={(color) => dispatch({ type: 'UPDATE_THEME', patch: { bannerBg: color || DEFAULT_BANNER } })}
    >
      <span className="theme-chip" style={{ background: bannerBg }} />
      Header colour
    </ColorButton>
  )
}
