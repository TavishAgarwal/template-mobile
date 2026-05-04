import React from 'react'
import { View, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Text } from '@/components/ui/Text'
import { GoldButton } from '@/components/ui/Button'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { ACCENT, ACCENT_DIM, BG_BASE } from '@/lib/theme'
import { APP_NAME } from '@/lib/constants'

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[s.root, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }]}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={s.content}>
        {/* Gold crest icon */}
        <View style={s.crest}>
          <Text style={s.crestEmoji}>✦</Text>
        </View>

        <Text variant="display" color="primary" align="center" style={{ marginTop: 24 }}>
          Welcome to{'\n'}{APP_NAME}
        </Text>

        <GoldDivider style={{ marginVertical: 20 }} />

        <Text variant="body" color="secondary" align="center" style={{ paddingHorizontal: 20 }}>
          Your application has been approved. You're now part of a curated community
          of the curious and the creative.
        </Text>

        <Text variant="bodySm" color="tertiary" align="center" style={{ marginTop: 16, paddingHorizontal: 32 }}>
          Let's set up your profile so other members can find you.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={s.footer}>
        <GoldButton
          title="Set Up My Profile"
          onPress={() => router.push('/(onboarding)/setup-profile')}
          fullWidth
        />
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_BASE, justifyContent: 'space-between' },
  content: { alignItems: 'center', paddingHorizontal: 24 },
  crest: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: ACCENT_DIM,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: `${ACCENT}30`,
  },
  crestEmoji: { fontSize: 36, color: ACCENT },
  footer: { paddingHorizontal: 24 },
})
