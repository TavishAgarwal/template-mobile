import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { Text } from './Text'
import { ACCENT, ACCENT_DIM, TEXT_PRIMARY, SUCCESS } from '@/lib/theme'
import { getInitials } from '@/lib/utils'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  url?: string | null
  name?: string | null
  size?: AvatarSize
  showOnline?: boolean
  isOnline?: boolean
  style?: ViewStyle
}

const SIZES: Record<AvatarSize, { wh: number; text: number; dot: number }> = {
  xs: { wh: 28, text: 11, dot: 8 },
  sm: { wh: 36, text: 13, dot: 10 },
  md: { wh: 48, text: 16, dot: 12 },
  lg: { wh: 64, text: 20, dot: 14 },
  xl: { wh: 96, text: 28, dot: 16 },
}

/**
 * Avatar with image or initials fallback + optional online indicator.
 */
export function Avatar({ url, name, size = 'md', showOnline = false, isOnline = false, style }: AvatarProps) {
  const sz = SIZES[size]
  const radius = sz.wh / 2

  return (
    <View style={[{ width: sz.wh, height: sz.wh }, style]}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={{ width: sz.wh, height: sz.wh, borderRadius: radius }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            s.fallback,
            { width: sz.wh, height: sz.wh, borderRadius: radius },
          ]}
        >
          <Text
            variant="body"
            color="accent"
            style={{ fontSize: sz.text, fontWeight: '700' }}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}

      {showOnline && isOnline && (
        <View
          style={[
            s.dot,
            {
              width: sz.dot,
              height: sz.dot,
              borderRadius: sz.dot / 2,
              borderWidth: sz.dot > 10 ? 2.5 : 2,
            },
          ]}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  fallback: {
    backgroundColor: ACCENT_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: SUCCESS,
    borderColor: '#0A0A0A',
  },
})
