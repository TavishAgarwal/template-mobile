# API & Data Layer — Velvet

All data flows through **Supabase** + **TanStack Query v5**. No custom REST API. No Redux.

---

## Supabase Client — `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Keep session alive when app comes to foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
```

---

## TanStack Query Setup — `lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // 2 minutes
      gcTime: 1000 * 60 * 10,         // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

Wrap `_layout.tsx` with:
```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

---

## Hook Patterns

### Standard read hook (list)
```typescript
// hooks/useMembers.ts
export function useMembers(filters?: MemberFilters) {
  return useQuery({
    queryKey: ['members', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'member')
        .order('created_at', { ascending: false })

      if (filters?.city) query = query.eq('city', filters.city)
      if (filters?.onlineOnly) query = query.eq('is_online', true)

      const { data, error } = await query
      if (error) throw error
      return data as Profile[]
    },
    placeholderData: mockMembers, // from lib/mockData.ts — no flash of empty
  })
}
```

### Standard read hook (single)
```typescript
export function useMember(id: string) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!id,
  })
}
```

### Mutation hook pattern
```typescript
export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', updates.id!)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}
```

---

## All Hooks Reference

### `hooks/useProfile.ts`
```typescript
// Own profile — reads from AuthContext first, then queries if needed
export function useProfile() {
  const { profile } = useAuth()
  return useQuery({
    queryKey: ['profile', profile?.id],
    queryFn: () => fetchProfile(profile!.id),
    enabled: !!profile?.id,
    initialData: profile ?? undefined,
  })
}
```

### `hooks/useMembers.ts`
```typescript
export function useMembers(filters?: {
  city?: string
  profession?: string
  onlineOnly?: boolean
  search?: string
})

export function useMember(id: string)
```

### `hooks/useEvents.ts`
```typescript
export function useEvents(filter?: 'in_person' | 'virtual' | 'going')
export function useEvent(id: string)
export function useCreateEvent() // admin only — mutation
```

### `hooks/useEventRsvp.ts`
```typescript
export function useEventRsvp(eventId: string) {
  // Returns: { status, toggle, loading }
  // toggle(newStatus: 'going' | 'maybe' | 'not_going') => upserts to event_rsvps
}
```

### `hooks/useConversations.ts`
```typescript
export function useConversations()
// Returns list of conversations with other_member joined
// Sorted by last_message_at DESC

export function useOrCreateConversation(otherMemberId: string)
// Finds existing or creates new conversation, returns conversation_id
```

### `hooks/useMessages.ts`
```typescript
export function useMessages(conversationId: string)
// Returns messages + sets up Realtime subscription for live updates

export function useSendMessage()
// Mutation: INSERT into messages + UPDATE conversations.last_message
```

### `hooks/useApplications.ts`
```typescript
// Admin only
export function useApplications(filter?: {
  status?: 'pending' | 'approved' | 'rejected' | 'waitlisted'
})

export function useApplication(id: string)
// Single application with profile data joined

export function useReviewApplication()
// Mutation: approve | reject | waitlist
// On approve: updates profiles.role to 'member', calls send-approval-email edge fn
// On reject: calls send-rejection-email edge fn
```

### `hooks/useInvites.ts`
```typescript
export function useInvites()
// Own invites — joined with used_by profile

export function useGenerateInvite()
// Mutation: INSERT invite + decrement profiles.invite_count

export function useValidateInviteCode(code: string)
// Checks if code exists in invites table and is unused
```

### `hooks/useNotifications.ts`
```typescript
export function useNotifications()
// Own notifications — sorted by created_at DESC
// Sets up Realtime subscription

export function useMarkNotificationRead()
// Mutation: UPDATE notifications SET is_read = true
```

### `hooks/useUnreadCount.ts`
```typescript
export function useUnreadCount()
// Returns { count: number }
// Queries messages WHERE is_read = false AND sender_id != me
// Refreshes via Realtime subscription
```

---

## Supabase Queries — Common Patterns

### Join profiles on conversations
```typescript
const { data } = await supabase
  .from('conversations')
  .select(`
    *,
    member_1:profiles!conversations_member_1_id_fkey(id, display_name, avatar_url, is_online),
    member_2:profiles!conversations_member_2_id_fkey(id, display_name, avatar_url, is_online)
  `)
  .or(`member_1_id.eq.${userId},member_2_id.eq.${userId}`)
  .order('last_message_at', { ascending: false })
```

Then in code, determine `other_member`:
```typescript
const conversation = {
  ...raw,
  other_member: raw.member_1_id === userId ? raw.member_2 : raw.member_1
}
```

### Join applications with profile
```typescript
const { data } = await supabase
  .from('applications')
  .select('*, profile:profiles(*)')
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
```

### Event RSVPs with attendees
```typescript
const { data } = await supabase
  .from('event_rsvps')
  .select('*, profile:profiles(id, display_name, avatar_url)')
  .eq('event_id', eventId)
  .eq('status', 'going')
  .limit(10)
```

### Upsert RSVP
```typescript
const { error } = await supabase
  .from('event_rsvps')
  .upsert(
    { event_id: eventId, user_id: userId, status: newStatus },
    { onConflict: 'event_id,user_id' }
  )
```

---

## Edge Function Calls

### Send approval email
```typescript
const { error } = await supabase.functions.invoke('send-approval-email', {
  body: { applicationId, applicantEmail, applicantName }
})
```

### Send rejection email
```typescript
const { error } = await supabase.functions.invoke('send-rejection-email', {
  body: { applicationId, applicantEmail, applicantName }
})
```

---

## Optimistic Updates

For RSVP toggle (feels instant):
```typescript
useMutation({
  mutationFn: toggleRsvp,
  onMutate: async (newStatus) => {
    await queryClient.cancelQueries({ queryKey: ['event', eventId] })
    const previous = queryClient.getQueryData(['event', eventId])
    queryClient.setQueryData(['event', eventId], (old: Event) => ({
      ...old,
      myRsvpStatus: newStatus,
      rsvp_count: newStatus === 'going' ? old.rsvp_count + 1 : old.rsvp_count - 1
    }))
    return { previous }
  },
  onError: (_, __, context) => {
    queryClient.setQueryData(['event', eventId], context?.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['event', eventId] })
  }
})
```

---

## Mock Data — `lib/mockData.ts`

Used as `placeholderData` in all hooks so screens never flash empty on first load.

```typescript
export const mockMembers: Profile[] = [
  {
    id: 'mock-1',
    display_name: 'Alexandra Chen',
    profession: 'Venture Capitalist',
    company: 'Sequoia Capital',
    city: 'San Francisco',
    avatar_url: null,
    bio: 'Early-stage investor. Previously founded two companies.',
    role: 'member',
    // ... rest of Profile fields
  },
  // 5-8 more realistic mock members
]

export const mockEvents: Event[] = [
  {
    id: 'mock-event-1',
    title: 'Velvet Rooftop Mixer',
    event_type: 'in_person',
    location: 'The Standard, New York',
    starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    rsvp_count: 47,
    // ...
  }
]

export const mockConversations: Conversation[] = [/* ... */]
export const mockApplications: Application[] = [/* ... */]
```

---

## Error Handling

All hooks follow this pattern — errors surface to the UI via `isError` + `error`:

```typescript
const { data, isLoading, isError, error } = useMembers()

if (isError) {
  return <ErrorState message={error.message} onRetry={() => refetch()} />
}
```

Global error tracking via PostHog in `lib/analytics.ts`:
```typescript
export function trackError(error: Error, context?: Record<string, unknown>) {
  posthog.capture('error', { message: error.message, ...context })
}
```

---

## Realtime Setup — Messages

In `hooks/useMessages.ts`:
```typescript
useEffect(() => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: Message[] = []) => [...old, payload.new as Message]
      )
      // Also mark as read if we're viewing the conversation
      markMessagesRead(conversationId)
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [conversationId])
```

In `hooks/useNotifications.ts`:
```typescript
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      queryClient.setQueryData(
        ['notifications'],
        (old: Notification[] = []) => [payload.new as Notification, ...old]
      )
      showToast(payload.new.title, 'info')
    })
    .subscribe()

  return () => { supabase.removeChannel(channel) }
}, [userId])
```

---

## Storage — File Uploads

### Upload avatar
```typescript
async function uploadAvatar(userId: string, uri: string): Promise<string> {
  const ext = uri.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`
  
  const response = await fetch(uri)
  const blob = await response.blob()
  const arrayBuffer = await new Response(blob).arrayBuffer()
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, {
      contentType: `image/${ext}`,
      upsert: true
    })
  
  if (error) throw error
  
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}
```

### Upload event cover
```typescript
async function uploadEventCover(eventId: string, uri: string): Promise<string> {
  const path = `${eventId}/cover.jpg`
  // ... same pattern as avatar
}
```
