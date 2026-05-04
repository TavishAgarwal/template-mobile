/**
 * Velvet Typography System
 *
 * Playfair Display — editorial headings, display moments
 * DM Sans — body text, UI labels, readability
 *
 * These keys must match the font names loaded in app/_layout.tsx via useFonts().
 */

export const Fonts = {
  // Playfair Display
  playfairRegular:    'PlayfairDisplay_400Regular',
  playfairBold:       'PlayfairDisplay_700Bold',
  playfairItalic:     'PlayfairDisplay_400Regular_Italic',
  // DM Sans
  dmRegular:          'DMSans_400Regular',
  dmMedium:           'DMSans_500Medium',
  dmBold:             'DMSans_700Bold',
  // Legacy aliases for template compat
  regular:            'DMSans_400Regular',
  medium:             'DMSans_500Medium',
  semibold:           'DMSans_700Bold',
  bold:               'DMSans_700Bold',
  black:              'DMSans_700Bold',
}

/**
 * Map a fontWeight value to the matching font family name.
 */
export function weightToFamily(weight?: string | number | null): string | undefined {
  switch (String(weight ?? '400')) {
    case '500': return Fonts.dmMedium
    case '600':
    case '700':
    case 'bold': return Fonts.dmBold
    default: return Fonts.dmRegular
  }
}

/**
 * Velvet type scale — consistent size/lineHeight pairs.
 * Use these instead of hardcoding px values.
 */
export const TYPE_SCALE = {
  display:  { fontFamily: Fonts.playfairBold,    fontSize: 36, lineHeight: 44 },
  h1:       { fontFamily: Fonts.playfairBold,    fontSize: 28, lineHeight: 36 },
  h2:       { fontFamily: Fonts.playfairRegular, fontSize: 22, lineHeight: 30 },
  h3:       { fontFamily: Fonts.dmBold,          fontSize: 18, lineHeight: 26 },
  bodyLg:   { fontFamily: Fonts.dmRegular,       fontSize: 17, lineHeight: 26 },
  body:     { fontFamily: Fonts.dmRegular,       fontSize: 15, lineHeight: 23 },
  bodySm:   { fontFamily: Fonts.dmRegular,       fontSize: 13, lineHeight: 20 },
  label:    { fontFamily: Fonts.dmMedium,        fontSize: 12, lineHeight: 16, letterSpacing: 1.5 },
  caption:  { fontFamily: Fonts.dmRegular,       fontSize: 11, lineHeight: 16 },
  quote:    { fontFamily: Fonts.playfairItalic,  fontSize: 17, lineHeight: 28 },
  number:   { fontFamily: Fonts.playfairBold,    fontSize: 42, lineHeight: 50 },
} as const

// Legacy alias
export const TypeScale = {
  xs:   { fontSize: 11, lineHeight: 16 },
  sm:   { fontSize: 13, lineHeight: 18 },
  base: { fontSize: 15, lineHeight: 22 },
  lg:   { fontSize: 17, lineHeight: 24 },
  xl:   { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 38 },
  '4xl': { fontSize: 36, lineHeight: 44 },
} as const
