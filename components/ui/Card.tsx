import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { BG_SURFACE, BORDER_DEFAULT, ACCENT_GLOW } from '@/lib/theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  glow?: boolean
}

/**
 * Dark surface card with optional gold glow.
 */
export function Card({ children, style, glow = false }: CardProps) {
  return (
    <View
      style={[
        s.card,
        glow && s.glow,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: BG_SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_DEFAULT,
    padding: 16,
  },
  glow: {
    borderColor: ACCENT_GLOW,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
})
