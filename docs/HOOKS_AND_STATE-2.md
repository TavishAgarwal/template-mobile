# Hooks & State Management — Velvet

All client state follows a strict pattern: **server state via TanStack Query**, **UI state via local useState**, **global app state via React Context**.

---

## Context Architecture

### `contexts/AuthContext.tsx`

The most critical context. Every role-based guard and personalization depends on this.

```typescript
interface AuthContextValue {
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) setProfile(data as Profile)
    setLoading(false)
  }

  async function refreshProfile() {
    if (session?.user.id) await fetchProfile(session.user.id)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
    queryClient.clear()
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

---

### `contexts/ToastContext.tsx`

Global toast system. One toast at a time. Auto-dismiss after 3s.

```typescript
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

// Usage anywhere in the app:
const { showToast } = useToast()
showToast('Application approved!', 'success')
showToast('Something went wrong.', 'error')
showToast('Copied to clipboard.', 'info')
```

**Toast UI:** Slides up from bottom (above tab bar). Gold border for success, red for error, amber for warning, blue for info. 3s auto-dismiss with fade-out. Tap to dismiss early.

---

### `contexts/ApplicationContext.tsx`

Holds the multi-step application form state across all 4 steps.

```typescript
interface ApplicationFormData {
  // Step 1
  full_name: string
  email: string
  city: string
  // Step 2
  profession: string
  company: string
  linkedin_url: string
  // Step 3
  why_join: string
  // Step 4
  instagram_handle: string
  referral_code: string
}

interface ApplicationContextValue {
  formData: ApplicationFormData
  updateField: (field: keyof ApplicationFormData, value: string) => void
  currentStep: number
  setStep: (step: number) => void
  submitApplication: () => Promise<void>
  isSubmitting: boolean
  submitError: string | null
}

// State is fully preserved when navigating between steps.
// On step4 submit → INSERT into applications table → navigate to /apply/submitted
```

---

## Hook Reference — Full Detail

### `hooks/useProfile.ts`

```typescript
export function useProfile() {
  const { profile: authProfile } = useAuth()

  return useQuery({
    queryKey: ['profile', authProfile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authProfile!.id)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!authProfile?.id,
    initialData: authProfile ?? undefined,
    staleTime: 1000 * 60 * 5, // 5 min — profile doesn't change often
  })
}

export function useUpdateProfile() {
  const { refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async (updates: Partial<Profile> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', updates.id)
        .select()
        .single()
      if (error) throw error
      return data as Profile
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['members'] })
      await refreshProfile() // sync AuthContext
    },
  })
}
```

---

### `hooks/useMembers.ts`

```typescript
interface MemberFilters {
  city?: string
  profession?: string
  onlineOnly?: boolean
  search?: string
}

export function useMembers(filters?: MemberFilters) {
  return useQuery({
    queryKey: ['members', filters],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .in('role', ['member', 'admin'])
        .order('created_at', { ascending: false })

      if (filters?.city) query = query.eq('city', filters.city)
      if (filters?.profession) query = query.eq('profession', filters.profession)
      if (filters?.onlineOnly) query = query.eq('is_online', true)
      if (filters?.search) {
        query = query.or(
          `display_name.ilike.%${filters.search}%,profession.ilike.%${filters.search}%,city.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query
      if (error) throw error
      return data as Profile[]
    },
    placeholderData: mockMembers,
  })
}

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
    placeholderData: () =>
      queryClient.getQueryData<Profile[]>(['members'])?.find(m => m.id === id),
  })
}
```

---

### `hooks/useEvents.ts`

```typescript
type EventFilter = 'all' | 'in_person' | 'virtual' | 'going'

export function useEvents(filter: EventFilter = 'all') {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['events', filter],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('starts_at', { ascending: true })

      if (filter === 'in_person') query = query.eq('event_type', 'in_person')
      if (filter === 'virtual') query = query.eq('event_type', 'virtual')
      if (filter === 'going') {
        // Subquery: get events user has RSVPed 'going' to
        const { data: rsvps } = await supabase
          .from('event_rsvps')
          .select('event_id')
          .eq('user_id', profile!.id)
          .eq('status', 'going')
        const eventIds = rsvps?.map(r => r.event_id) ?? []
        query = query.in('id', eventIds)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Event[]
    },
    placeholderData: mockEvents,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          rsvps:event_rsvps(
            user_id,
            status,
            profile:profiles(id, display_name, avatar_url)
          )
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Event & { rsvps: EventRsvp[] }
    },
    enabled: !!id,
  })
}
```

---

### `hooks/useEventRsvp.ts`

```typescript
export function useEventRsvp(eventId: string) {
  const { profile } = useAuth()

  // Get current RSVP status
  const { data: rsvp } = useQuery({
    queryKey: ['rsvp', eventId, profile?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('event_rsvps')
        .select('status')
        .eq('event_id', eventId)
        .eq('user_id', profile!.id)
        .maybeSingle()
      return data
    },
    enabled: !!profile?.id && !!eventId,
  })

  const toggle = useMutation({
    mutationFn: async (newStatus: 'going' | 'maybe' | 'not_going') => {
      const { error } = await supabase
        .from('event_rsvps')
        .upsert(
          { event_id: eventId, user_id: profile!.id, status: newStatus },
          { onConflict: 'event_id,user_id' }
        )
      if (error) throw error
    },
    onMutate: async (newStatus) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['rsvp', eventId] })
      const previous = queryClient.getQueryData(['rsvp', eventId])
      queryClient.setQueryData(['rsvp', eventId, profile?.id], { status: newStatus })
      return { previous }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['rsvp', eventId, profile?.id], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvp', eventId] })
      queryClient.invalidateQueries({ queryKey: ['event', eventId] })
    },
  })

  return {
    status: rsvp?.status ?? null,
    toggle: toggle.mutate,
    loading: toggle.isPending,
  }
}
```

---

### `hooks/useConversations.ts`

```typescript
export function useConversations() {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['conversations', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          member_1:profiles!conversations_member_1_id_fkey(id, display_name, avatar_url, is_online),
          member_2:profiles!conversations_member_2_id_fkey(id, display_name, avatar_url, is_online)
        `)
        .or(`member_1_id.eq.${profile!.id},member_2_id.eq.${profile!.id}`)
        .order('last_message_at', { ascending: false })

      if (error) throw error

      return data?.map(conv => ({
        ...conv,
        other_member: conv.member_1_id === profile!.id ? conv.member_2 : conv.member_1,
      })) as Conversation[]
    },
    enabled: !!profile?.id,
    placeholderData: mockConversations,
  })
}

export function useOrCreateConversation() {
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async (otherMemberId: string) => {
      // Check if conversation already exists (either member order)
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(member_1_id.eq.${profile!.id},member_2_id.eq.${otherMemberId}),` +
          `and(member_1_id.eq.${otherMemberId},member_2_id.eq.${profile!.id})`
        )
        .maybeSingle()

      if (existing) return existing.id

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          member_1_id: profile!.id,
          member_2_id: otherMemberId,
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id as string
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
```

---

### `hooks/useMessages.ts`

```typescript
export function useMessages(conversationId: string) {
  const { profile } = useAuth()

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      if (error) throw error

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', profile!.id)
        .eq('is_read', false)

      return data as Message[]
    },
    enabled: !!conversationId,
  })

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return

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
        // Mark read immediately if we're in the conversation
        if (payload.new.sender_id !== profile?.id) {
          supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId, profile?.id])

  return query
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: user!.id, content })
        .select()
        .single()
      if (error) throw error

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({ last_message: content, last_message_at: new Date().toISOString() })
        .eq('id', conversationId)

      return data as Message
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['messages', data.conversation_id],
        (old: Message[] = []) => {
          if (old.find(m => m.id === data.id)) return old
          return [...old, data]
        }
      )
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })
}
```

---

### `hooks/useApplications.ts`

```typescript
interface ApplicationFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'waitlisted'
}

export function useApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      let query = supabase
        .from('applications')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false })

      if (filters?.status) query = query.eq('status', filters.status)

      const { data, error } = await query
      if (error) throw error
      return data as Application[]
    },
    placeholderData: mockApplications,
  })
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, profile:profiles(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Application
    },
    enabled: !!id,
  })
}

export function useReviewApplication() {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({
      applicationId,
      action,
      adminNotes,
    }: {
      applicationId: string
      action: 'approve' | 'reject' | 'waitlist'
      adminNotes?: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'waitlisted'

      const { data: application, error } = await supabase
        .from('applications')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: user!.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select('*, profile:profiles(*)')
        .single()

      if (error) throw error

      // On approval: update profile role, trigger email
      if (action === 'approve') {
        await supabase
          .from('profiles')
          .update({ role: 'member' })
          .eq('id', application.user_id)

        await supabase.functions.invoke('send-approval-email', {
          body: {
            applicationId,
            applicantEmail: application.email,
            applicantName: application.full_name,
          },
        })
      }

      if (action === 'reject') {
        await supabase.functions.invoke('send-rejection-email', {
          body: {
            applicationId,
            applicantEmail: application.email,
            applicantName: application.full_name,
          },
        })
      }

      return application
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] })
      const msg = variables.action === 'approve'
        ? 'Member approved ✓'
        : variables.action === 'reject'
        ? 'Application rejected.'
        : 'Added to waitlist.'
      showToast(msg, variables.action === 'approve' ? 'success' : 'info')
    },
  })
}
```

---

### `hooks/useInvites.ts`

```typescript
export function useInvites() {
  const { profile } = useAuth()

  return useQuery({
    queryKey: ['invites', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invites')
        .select('*, used_by_profile:profiles!invites_used_by_fkey(id, display_name, avatar_url)')
        .eq('created_by', profile!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Invite[]
    },
    enabled: !!profile?.id,
  })
}

export function useGenerateInvite() {
  const { profile, refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!profile || profile.invite_count <= 0) throw new Error('No invites remaining')

      // Generate code in DB via function
      const { data: code } = await supabase.rpc('generate_invite_code')

      const { data, error } = await supabase
        .from('invites')
        .insert({ code, created_by: profile.id })
        .select()
        .single()
      if (error) throw error

      // Decrement invite count
      await supabase
        .from('profiles')
        .update({ invite_count: profile.invite_count - 1 })
        .eq('id', profile.id)

      return data as Invite
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      await refreshProfile()
    },
  })
}

export function useValidateInviteCode(code: string) {
  return useQuery({
    queryKey: ['invite-validate', code],
    queryFn: async () => {
      const { data } = await supabase
        .from('invites')
        .select('id, code, used_by')
        .eq('code', code.toUpperCase())
        .is('used_by', null)
        .maybeSingle()
      return { valid: !!data }
    },
    enabled: code.length >= 6,
    staleTime: 0, // Always check fresh
  })
}
```

---

### `hooks/useNotifications.ts`

```typescript
export function useNotifications() {
  const { profile } = useAuth()

  const query = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data as Notification[]
    },
    enabled: !!profile?.id,
  })

  // Realtime subscription
  useEffect(() => {
    if (!profile?.id) return

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${profile.id}`,
      }, (payload) => {
        queryClient.setQueryData(
          ['notifications', profile.id],
          (old: Notification[] = []) => [payload.new as Notification, ...old]
        )
        showToast(payload.new.title, 'info')
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.id])

  return query
}

export function useMarkNotificationRead() {
  const { profile } = useAuth()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
    },
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(
        ['notifications', profile?.id],
        (old: Notification[] = []) =>
          old.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
    },
  })
}
```

---

### `hooks/useUnreadCount.ts`

```typescript
export function useUnreadCount() {
  const { profile } = useAuth()

  const query = useQuery({
    queryKey: ['unread-count', profile?.id],
    queryFn: async () => {
      // Get conversations for this user
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`member_1_id.eq.${profile!.id},member_2_id.eq.${profile!.id}`)

      if (!conversations?.length) return { count: 0 }

      const convIds = conversations.map(c => c.id)
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', convIds)
        .neq('sender_id', profile!.id)
        .eq('is_read', false)

      if (error) throw error
      return { count: count ?? 0 }
    },
    enabled: !!profile?.id,
    refetchInterval: 30000, // Poll every 30s as fallback
  })

  // Realtime — decrement on read, increment on new unread message
  useEffect(() => {
    if (!profile?.id) return

    const channel = supabase
      .channel('unread-count')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['unread-count'] })
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['unread-count'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile?.id])

  return query
}
```

---

## Local State Patterns

### Search + Filter (screens)

```typescript
// In members.tsx
const [search, setSearch] = useState('')
const [activeCity, setActiveCity] = useState<string | undefined>()
const [showOnlineOnly, setShowOnlineOnly] = useState(false)
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

// Debounce search to avoid hammering the API
const debouncedSearch = useDebounce(search, 300)

const { data: members, isLoading } = useMembers({
  search: debouncedSearch,
  city: activeCity,
  onlineOnly: showOnlineOnly,
})
```

### `useDebounce` utility hook

```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

### Keyboard-aware input (screens with TextInput)

```typescript
// Use in any screen with TextInput near the bottom
import { KeyboardAvoidingView, Platform } from 'react-native'

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  {/* content */}
</KeyboardAvoidingView>
```

---

## Query Key Conventions

| Entity | List key | Single key |
|--------|----------|------------|
| Profile | `['profile', userId]` | — |
| Members | `['members', filters]` | `['member', id]` |
| Events | `['events', filter]` | `['event', id]` |
| RSVPs | `['rsvp', eventId, userId]` | — |
| Conversations | `['conversations', userId]` | — |
| Messages | `['messages', conversationId]` | — |
| Applications | `['applications', filters]` | `['application', id]` |
| Invites | `['invites', userId]` | — |
| Notifications | `['notifications', userId]` | — |
| Unread Count | `['unread-count', userId]` | — |

---

## Invalidation Rules

When X changes → invalidate Y:

| Mutation | Invalidates |
|----------|-------------|
| Update profile | `['profile']`, `['members']` |
| Send message | `['conversations']`, `['unread-count']` |
| Toggle RSVP | `['rsvp', eventId]`, `['event', eventId]`, `['events']` |
| Approve application | `['applications']`, `['application', id]` |
| Generate invite | `['invites']`, `['profile']` |
| Mark notification read | `['notifications']` |
