/** Line icons for the editor chrome. Stroked with currentColor so they inherit
 *  button state, and all on one 24px grid so they optically match. */
const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" className="ui-icon" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

export const ChevronDown = () => (
  <Svg>
    <path d="M6 9l6 6 6-6" />
  </Svg>
)

export const ChevronRight = () => (
  <Svg>
    <path d="M9 6l6 6-6 6" />
  </Svg>
)

export const ArrowUp = () => (
  <Svg>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Svg>
)

export const ArrowDown = () => (
  <Svg>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
)

export const Eye = () => (
  <Svg>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)

export const EyeOff = () => (
  <Svg>
    <path d="M10.7 5.1A11 11 0 0 1 12 5c6.4 0 10 7 10 7a19 19 0 0 1-3.2 4.2M6.5 6.6A18.9 18.9 0 0 0 2 12s3.6 7 10 7a10.8 10.8 0 0 0 4.3-.9" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M3 3l18 18" />
  </Svg>
)

export const Copy = () => (
  <Svg>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2.5 2.5 0 0 1 2.5-2.5H15" />
  </Svg>
)

export const CloseCircle = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
  </Svg>
)

export const Close = () => (
  <Svg>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
