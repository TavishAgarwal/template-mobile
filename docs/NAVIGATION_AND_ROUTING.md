# Navigation & Routing — Velvet

Built on **Expo Router v3** (file-based routing). Every file in `app/` automatically becomes a route.

---

## Route Map

```
/                          → app/index.tsx            (Landing — public)
/privacy                   → app/privacy.tsx           (Public)
/terms                     → app/terms.tsx             (Public)

/apply/step1               → app/apply/step1.tsx
/apply/step2               → app/apply/step2.tsx
/apply/step3               → app/apply/step3.tsx
/apply/step4               → app/apply/step4.tsx
/apply/submitted           → app/apply/submitted.tsx

/(auth)/login              → app/(auth)/login.tsx

/(onboarding)/             → app/(onboarding)/index.tsx

/(tabs)/                   → app/(tabs)/index.tsx      (Home feed)
/(tabs)/members            → app/(tabs)/members.tsx
/(tabs)/events             → app/(tabs)/events.tsx
/(tabs)/messages           → app/(tabs)/messages.tsx
/(tabs)/profile            → app/(tabs)/profile.tsx

/member/[id]               → app/member/[id].tsx
/event/[id]                → app/event/[id].tsx
/messages/[id]             → app/messages/[id].tsx
/invites                   → app/invites.tsx
/profile/edit              → app/profile/edit.tsx

/admin/                    → app/admin/index.tsx
/admin/applications/       → app/admin/applications/index.tsx
/admin/applications/[id]   → app/admin/applications/[id].tsx
/admin/members/            → app/admin/members/index.tsx
/admin/events/create       → app/admin/events/create.tsx
```

---

## Root Layout — `app/_layout.tsx`

This is the auth guard. It listens to `AuthContext` and redirects based on session + role.

```typescript
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSegments } from 'expo-router'

export default function RootLayout() {
  const { session, profile, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === '(auth)'
    const inApplyGroup = segments[0] === 'apply'
    const inPublic = segments[0] === undefined || segments[0] === 'privacy' || segments[0] === 'terms'

    if (!session) {
      // Not logged in — allow public + apply + auth routes only
      if (!inPublic && !inApplyGroup && !inAuthGroup) {
        router.replace('/')
      }
      return
    }

    // Logged in — guard based on role
    const role = profile?.role

    if (role === 'applicant' || role === 'pending') {
      if (!inApplyGroup) router.replace('/apply/submitted')
      return
    }

    if (role === 'member' && !profile?.onboarding_completed) {
      if (segments[0] !== '(onboarding)') router.replace('/(onboarding)/')
      return
    }

    if (role === 'member' || role === 'admin') {
      // Block admin routes for non-admins
      if (segments[0] === 'admin' && role !== 'admin') {
        router.replace('/(tabs)/')
        return
      }
      // If in auth/apply/onboarding routes, push to main app
      if (inAuthGroup || inApplyGroup || segments[0] === '(onboarding)') {
        router.replace('/(tabs)/')
      }
    }
  }, [session, profile, loading, segments])

  if (loading) return <SplashScreen /> // custom splash

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="apply" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="admin" />
    </Stack>
  )
}
```

---

## Tab Layout — `app/(tabs)/_layout.tsx`

```typescript
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'
import { useAuth } from '@/contexts/AuthContext'

export default function TabsLayout() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  return (
    <Tabs tabBar={(props) => <TabBar {...props} isAdmin={isAdmin} />}>
      <Tabs.Screen name="index"    options={{ title: 'Home' }} />
      <Tabs.Screen name="members"  options={{ title: 'Members' }} />
      <Tabs.Screen name="events"   options={{ title: 'Events' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile' }} />
    </Tabs>
  )
}
```

---

## Apply Layout — `app/apply/_layout.tsx`

Wraps application steps with `ApplicationContext` and step progress UI.

```typescript
import { Stack } from 'expo-router'
import { ApplicationProvider } from '@/contexts/ApplicationContext'
import { StepProgress } from '@/components/application/StepProgress'

export default function ApplyLayout() {
  return (
    <ApplicationProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          header: ({ route }) => {
            const step = parseInt(route.name.replace('step', '')) || 0
            return step > 0 ? <StepProgress currentStep={step} totalSteps={4} /> : null
          }
        }}
      />
    </ApplicationProvider>
  )
}
```

---

## Admin Layout — `app/admin/_layout.tsx`

Role guard — bounces non-admins.

```typescript
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout() {
  const { profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.replace('/(tabs)/')
    }
  }, [profile])

  if (profile?.role !== 'admin') return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="applications/index" />
      <Stack.Screen name="applications/[id]" />
      <Stack.Screen name="members/index" />
      <Stack.Screen name="events/create" />
    </Stack>
  )
}
```

---

## Navigation Patterns

### Push a stack screen
```typescript
import { useRouter } from 'expo-router'
const router = useRouter()
router.push(`/member/${memberId}`)
router.push(`/event/${eventId}`)
router.push(`/messages/${conversationId}`)
```

### Replace (no back)
```typescript
router.replace('/(tabs)/')
router.replace('/apply/submitted')
```

### Go back
```typescript
router.back()
```

### Link component (declarative)
```typescript
import { Link } from 'expo-router'
<Link href="/privacy">Privacy Policy</Link>
<Link href={`/member/${id}`} asChild>
  <TouchableOpacity>...</TouchableOpacity>
</Link>
```

### Access route params
```typescript
import { useLocalSearchParams } from 'expo-router'
const { id } = useLocalSearchParams<{ id: string }>()
```

---

## Screen Transition Animations

Set globally in `app/_layout.tsx`:
```typescript
<Stack
  screenOptions={{
    animation: 'fade_from_bottom', // or 'slide_from_right'
    contentStyle: { backgroundColor: '#0A0A0A' }
  }}
/>
```

Per-screen override:
```typescript
<Stack.Screen
  name="member/[id]"
  options={{ animation: 'slide_from_right' }}
/>
```

---

## Deep Linking

Configure in `app.json`:
```json
{
  "expo": {
    "scheme": "velvet",
    "web": { "bundler": "metro" }
  }
}
```

Deep link examples:
- `velvet://member/abc123` → Member profile
- `velvet://event/xyz789` → Event detail
- `velvet://apply/step1` → Application start

---

## Tab Bar Badges

Unread message count badge on Messages tab:
```typescript
// In TabBar.tsx — reads from useUnreadCount()
const { count } = useUnreadCount()
// Pass as badge prop to tab icon
```

Admin pending applications badge:
```typescript
// Only shown when role === 'admin'
const { data } = useApplications({ status: 'pending' })
// Badge count = data?.length
```
