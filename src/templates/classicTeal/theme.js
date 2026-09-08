import { isLight, mix } from '../../utils/color'

export const DEFAULT_BANNER = '#14384a'

/**
 * Banner text is derived from the chosen background rather than hard-coded, so
 * any colour — including a light one — stays readable. The defaults reproduce
 * the original design almost exactly.
 *
 * Lives apart from the React component so the DOCX builder can share it without
 * pulling in the renderer or its stylesheet.
 */
export function bannerPalette(background) {
  const light = isLight(background)
  return {
    name: light ? '#14384a' : '#ffffff',
    title: light ? mix(background, -0.55) : mix(background, 0.72),
    rule: light ? mix(background, -0.28) : mix(background, 0.28),
    contact: light ? mix(background, -0.62) : mix(background, 0.82),
    separator: light ? mix(background, -0.35) : mix(background, 0.45),
  }
}
