import React from 'react'
import { Pressable, StyleSheet, ActivityIndicator, type ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Text } from './Text'
import { ACCENT, ACCENT_BORDER, BG_SURFACE, TEXT_PRIMARY, TEXT_INVERSE, BORDER_DEFAULT } from '@/lib/theme'
import { adjustBrightness } from '@/lib/utils'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type ButtonVariant = 'gold' | 'ghost' | 'text' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  title: string
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  style?: ViewStyle
  fullWidth?: boolean
}

const SIZE: Record<ButtonSize, { h: number; px: number; fontSize: number }> = {
  sm: { h: 38, px: 16, fontSize: 13 },
  md: { h: 48, px: 24, fontSize: 15 },
  lg: { h: 56, px: 32, fontSize: 16 },
}

/**
 * Velvet Button — three variants:
 * • gold: primary CTA with gradient
 * • ghost: outlined, subtle
 * • text: minimal label button
 * • destructive: red for dangerous actions
 */
export function Button({
  title, onPress, variant = 'gold', size = 'md',
  disabled = false, loading = false, icon, style, fullWidth,
}: ButtonProps) {
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }) }
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }) }

  const sz = SIZE[size]
  const isDisabled = disabled || loading

  if (variant === 'text') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} hitSlop={8}>
        <Text
          variant="bodySm"
          color="accent"
          style={[{ opacity: isDisabled ? 0.4 : 1 }]}
        >
          {title}
        </Text>
      </Pressable>
    )
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        animStyle,
        { opacity: isDisabled ? 0.5 : 1, width: fullWidth ? '100%' : undefined },
        style,
      ]}
    >
      {variant === 'gold' ? (
        <LinearGradient
          colors={[ACCENT, adjustBrightness(ACCENT, -20)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.base, { height: sz.h, paddingHorizontal: sz.px }]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={TEXT_INVERSE} />
          ) : (
            <>
              {icon}
              <Text variant="bodySm" color="inverse" style={{ fontWeight: '700', fontSize: sz.fontSize }}>{title}</Text>
            </>
          )}
        </LinearGradient>
      ) : (
        <Animated.View
          style={[
            s.base,
            {
              height: sz.h,
              paddingHorizontal: sz.px,
              backgroundColor: variant === 'destructive' ? 'rgba(232,92,76,0.12)' : BG_SURFACE,
              borderWidth: 1,
              borderColor: variant === 'destructive' ? 'rgba(232,92,76,0.30)' : BORDER_DEFAULT,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={variant === 'destructive' ? '#E85C4C' : TEXT_PRIMARY} />
          ) : (
            <>
              {icon}
              <Text
                variant="bodySm"
                color={variant === 'destructive' ? 'error' : 'primary'}
                style={{ fontWeight: '600', fontSize: sz.fontSize }}
              >
                {title}
              </Text>
            </>
          )}
        </Animated.View>
      )}
    </AnimatedPressable>
  )
}

// Convenience aliases
export function GoldButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="gold" {...props} />
}

export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="ghost" {...props} />
}

export function TextButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="text" {...props} />
}

const s = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
})
