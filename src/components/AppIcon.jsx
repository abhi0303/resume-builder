/** App mark: a CV page with its header band. Sits on the dark top bar, so the
 *  badge background of the installed icon is left off here. */
export default function AppIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="app-icon" role="img" aria-label="Resume Builder">
      <title>Resume Builder</title>
      <rect x="12" y="8" width="40" height="48" rx="5" fill="#ffffff" />
      <path d="M12 13a5 5 0 0 1 5-5h30a5 5 0 0 1 5 5v9H12z" fill="#3fa9bd" />
      <circle cx="21" cy="14.5" r="4" fill="#ffffff" />
      <rect x="29" y="10.5" width="17" height="2.6" rx="1.3" fill="#ffffff" opacity="0.85" />
      <rect x="29" y="15.6" width="11" height="2.6" rx="1.3" fill="#ffffff" opacity="0.6" />
      <rect x="18" y="29" width="28" height="3" rx="1.5" fill="#b9cbd2" />
      <rect x="18" y="36" width="28" height="3" rx="1.5" fill="#b9cbd2" />
      <rect x="18" y="43" width="17" height="3" rx="1.5" fill="#b9cbd2" />
    </svg>
  )
}
