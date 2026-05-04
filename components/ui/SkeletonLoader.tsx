import React, { useEffect } from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { BG_SURFACE, BORDER_DEFAULT } from '@/lib/theme'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

/**
 * Shimmer skeleton loader for loading states.
 */
export function SkeletonLoader({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const translateX = useSharedValue(-300)

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    )
  }, [])

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: BG_SURFACE,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.06)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}

/**
 * Card-shaped skeleton for list loading states.
 */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[s.card, style]}>
      <View style={s.row}>
        <SkeletonLoader width={48} height={48} borderRadius={24} />
        <View style={s.lines}>
          <SkeletonLoader width={140} height={14} />
          <SkeletonLoader width={90} height={12} />
        </View>
      </View>
      <SkeletonLoader height={12} style={{ marginTop: 12 }} />
      <SkeletonLoader width={200} height={12} style={{ marginTop: 6 }} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lines: {
    flex: 1,
    gap: 6,
  },
})
