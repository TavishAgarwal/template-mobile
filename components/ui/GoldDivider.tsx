import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ACCENT } from '@/lib/theme'

interface GoldDividerProps {
  style?: ViewStyle
}

/**
 * Thin decorative gold gradient divider.
 */
export function GoldDivider({ style }: GoldDividerProps) {
  return (
    <View style={[s.wrapper, style]}>
      <LinearGradient
        colors={['transparent', `${ACCENT}60`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.line}
      />
    </View>
  )
}

const s = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  line: {
    width: '80%',
    height: 1,
  },
})
