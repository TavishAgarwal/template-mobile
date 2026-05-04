import { Stack } from 'expo-router'
import { BG_BASE } from '@/lib/theme'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BG_BASE },
        animation: 'slide_from_right',
      }}
    />
  )
}
