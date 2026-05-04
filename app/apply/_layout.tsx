import { Stack } from 'expo-router'
import { ApplicationProvider } from '@/contexts/ApplicationContext'
import { BG_BASE } from '@/lib/theme'

export default function ApplyLayout() {
  return (
    <ApplicationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: BG_BASE },
        }}
      />
    </ApplicationProvider>
  )
}
