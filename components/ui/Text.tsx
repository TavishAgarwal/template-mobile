import React from 'react'
import { Text as RNText, type TextProps, StyleSheet, type TextStyle } from 'react-native'
import { TYPE_SCALE, Fonts } from '@/lib/typography'
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, ACCENT } from '@/lib/theme'

type Variant = keyof typeof TYPE_SCALE
type ColorKey = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'inverse' | 'error' | 'success'

interface VelvetTextProps extends TextProps {
  variant?: Variant
  color?: ColorKey
  uppercase?: boolean
  align?: TextStyle['textAlign']
}

const COLOR_MAP: Record<ColorKey, string> = {
  primary:   TEXT_PRIMARY,
  secondary: TEXT_SECONDARY,
  tertiary:  TEXT_TERTIARY,
  accent:    ACCENT,
  inverse:   '#0A0A0A',
  error:     '#E85C4C',
  success:   '#4CAF7C',
}

/**
 * Variant-based Text component for Velvet.
 * Uses Playfair Display for editorial variants and DM Sans for body/UI.
 *
 * @example
 *   <Text variant="h1">Welcome to Velvet</Text>
 *   <Text variant="body" color="secondary">Supporting copy</Text>
 *   <Text variant="label" uppercase>SECTION HEADER</Text>
 */
export function Text({ variant = 'body', color = 'primary', uppercase, align, style, ...props }: VelvetTextProps) {
  const scale = TYPE_SCALE[variant]

  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily: scale.fontFamily,
          fontSize: scale.fontSize,
          lineHeight: scale.lineHeight,
          color: COLOR_MAP[color],
          textTransform: uppercase ? 'uppercase' : undefined,
          textAlign: align,
          letterSpacing: 'letterSpacing' in scale ? (scale as unknown as { letterSpacing: number }).letterSpacing : undefined,
        },
        style,
      ]}
    />
  )
}
