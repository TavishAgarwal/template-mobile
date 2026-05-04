# Architecture & File Structure — Velvet

Built on the **8x React Native Expo template** (`github.com/8xsocial/template-mobile`).

---

## Full File Tree

```
velvet/
├── app/
│   ├── _layout.tsx                    # Root layout — auth guard + role routing
│   ├── index.tsx                      # Landing page (public)
│   ├── privacy.tsx                    # Privacy policy
│   ├── terms.tsx                      # Terms of service
│   │
│   ├── apply/
│   │   ├── _layout.tsx                # Application flow layout (step progress)
│   │   ├── step1.tsx                  # Name, email, city
│   │   ├── step2.tsx                  # Profession, company, LinkedIn
│   │   ├── step3.tsx                  # Why join essay
│   │   ├── step4.tsx                  # Instagram + referral code
│   │   └── submitted.tsx              # Success confirmation
│   │
│   ├── (auth)/
│   │   └── login.tsx                  # OTP email + social login
│   │
│   ├── (onboarding)/
│   │   └── index.tsx                  # Profile photo + bio setup (post-approval)
│   │
│   ├── (tabs)/
│   │   ├── _layout.tsx                # Tab bar (Home, Members, Events, Messages, Profile)
│   │   ├── index.tsx                  # Home feed
│   │   ├── members.tsx                # Member directory
│   │   ├── events.tsx                 # Events board
│   │   ├── messages.tsx               # DM inbox
│   │   └── profile.tsx                # Own profile
│   │
│   ├── member/
│   │   └── [id].tsx                   # Another member's profile
│   │
│   ├── event/
│   │   └── [id].tsx                   # Event detail + RSVP
│   │
│   ├── messages/
│   │   └── [id].tsx                   # DM thread / chat screen
│   │
│   ├── invites.tsx                    # My invites screen
│   ├── profile/
│   │   └── edit.tsx                   # Edit own profile
│   │
│   └── admin/
│       ├── _layout.tsx                # Admin layout (role guard)
│       ├── index.tsx                  # Admin dashboard
│       ├── applications/
│       │   ├── index.tsx              # Application queue
│       │   └── [id].tsx              # Individual application review
│       ├── members/
│       │   └── index.tsx              # Member management
│       └── events/
│           └── create.tsx             # Create new event
│
├── components/
│   ├── ui/
│   │   ├── Text.tsx                   # Velvet-styled Text (Playfair/DM Sans aware)
│   │   ├── Button.tsx                 # GoldButton, GhostButton, TextButton
│   │   ├── Card.tsx                   # Generic surface card
│   │   ├── AppModal.tsx               # Bottom sheet modals
│   │   ├── StatusBadge.tsx            # Role/status pill badges
│   │   ├── TextInputField.tsx         # Dark-themed text input
│   │   ├── Avatar.tsx                 # Member avatar with online indicator
│   │   ├── SkeletonLoader.tsx         # Shimmer loading skeleton
│   │   └── GoldDivider.tsx            # Decorative gold line divider
│   │
│   ├── application/
│   │   ├── StepProgress.tsx           # Step dots + animated progress bar
│   │   └── ApplicationFormField.tsx  # Labelled input for apply flow
│   │
│   ├── members/
│   │   ├── MemberCard.tsx             # Card in directory grid/list
│   │   ├── MemberListItem.tsx         # Row in list view
│   │   └── MemberFilter.tsx           # Filter bar (city, profession)
│   │
│   ├── events/
│   │   ├── EventCard.tsx              # Card in events board
│   │   ├── EventBadge.tsx             # "Virtual" / "In Person" pill
│   │   └── RSVPButton.tsx             # Going/Maybe/Not Going toggle
│   │
│   ├── messages/
│   │   ├── ConversationRow.tsx        # Row in DM inbox
│   │   ├── MessageBubble.tsx          # Chat bubble (own vs theirs)
│   │   └── MessageInput.tsx           # Compose bar at bottom of thread
│   │
│   ├── admin/
│   │   ├── ApplicationRow.tsx         # Row in application queue
│   │   ├── StatCard.tsx               # Dashboard stat card
│   │   └── AdminActionSheet.tsx       # Approve/reject/waitlist action sheet
│   │
│   ├── home/
│   │   ├── HomeFeedSection.tsx        # Section header + horizontal scroll
│   │   ├── NewMembersRow.tsx          # Horizontal scroll of new member avatars
│   │   └── UpcomingEventBanner.tsx    # Prominent upcoming event card
│   │
│   ├── invites/
│   │   ├── InviteCodeCard.tsx         # Displays a single invite code
│   │   └── InviteStats.tsx            # X invites used, X remaining
│   │
│   ├── TabBar.tsx                     # Custom animated gold tab bar
│   └── OfflineBanner.tsx              # Mid-session offline indicator
│
├── contexts/
│   ├── AuthContext.tsx                # Supabase session + profile + role
│   ├── ToastContext.tsx               # useToast() hook
│   └── ApplicationContext.tsx         # Multi-step application form state
│
├── hooks/
│   ├── useProfile.ts                  # Own profile data
│   ├── useMembers.ts                  # Member directory + single member
│   ├── useEvents.ts                   # Events list + single event
│   ├── useEventRsvp.ts                # RSVP state + toggle
│   ├── useConversations.ts            # DM inbox
│   ├── useMessages.ts                 # Messages in a thread + realtime
│   ├── useApplications.ts             # Admin: applications list
│   ├── useApplication.ts              # Admin: single application
│   ├── useInvites.ts                  # Own invites
│   ├── useNotifications.ts            # In-app notifications
│   └── useUnreadCount.ts              # Badge count for messages tab
│
├── lib/
│   ├── constants.ts                   # APP_NAME='Velvet', APP_TAGLINE, etc.
│   ├── theme.ts                       # All color tokens (ACCENT = '#C9A84C')
│   ├── typography.ts                  # Font scale + loaded font families
│   ├── supabase.ts                    # Supabase client
│   ├── queryClient.ts                 # TanStack Query client config
│   ├── analytics.ts                   # PostHog event tracking
│   ├── inviteUtils.ts                 # Generate invite codes, validate
│   ├── mockData.ts                    # Placeholder data for hooks
│   └── utils.ts                       # getInitials, formatRelativeTime, etc.
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_init.sql               # profiles table + auth trigger
│   │   ├── 002_applications.sql       # applications table
│   │   ├── 003_events.sql             # events + event_rsvps tables
│   │   ├── 004_messaging.sql          # conversations + messages tables
│   │   ├── 005_invites.sql            # invites table
│   │   └── 006_notifications.sql      # notifications table
│   └── functions/
│       ├── send-approval-email/       # Edge function
│       └── notify-on-message/         # Edge function
│
├── assets/
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
│
├── locales/
│   └── en.json                        # English strings
│
├── __tests__/
│   └── utils.test.ts
│
├── .claude-logs/                      # AI development session logs
│   └── session-001.md
│
├── docs/                              # This folder
│   ├── PROJECT_OVERVIEW.md
│   ├── DATABASE_SCHEMA.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md                # This file
│   └── SCREENS.md
│
├── app.json
├── eas.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── REFLECTION.md
└── README.md
```

---

## Auth Routing Logic

Three zones, handled in `app/_layout.tsx`:

```
Zone 1 — Public (no session)
  → /              (landing)
  → /apply/*       (application flow)
  → /(auth)/login  (OTP login)
  → /privacy, /terms

Zone 2 — Approved Pending Onboarding (session exists, role = 'member', onboarding_completed = false)
  → /(onboarding)/ (profile setup)

Zone 3 — Member (session, role = 'member' or 'admin', onboarding done)
  → /(tabs)/*
  → /member/[id]
  → /event/[id]
  → /messages/[id]
  → /invites
  → /profile/edit

Zone 4 — Admin only (role = 'admin')
  → /admin/*
```

### Role-Based Redirects
```typescript
// app/_layout.tsx logic
if (!session) → redirect to '/'
if (session && role === 'applicant') → redirect to '/apply/submitted' (show status)
if (session && role === 'pending') → redirect to '/apply/submitted' (show pending)
if (session && role === 'member' && !onboarding_completed) → /(onboarding)/
if (session && role === 'member') → /(tabs)/
if (session && role === 'admin') → /(tabs)/ (with admin tab or banner)
```

---

## State Management

| Concern | Solution |
|---------|---------|
| Auth session + user profile | `AuthContext` (React Context + Supabase listener) |
| Server data (members, events, etc.) | TanStack Query hooks |
| Application form state | `ApplicationContext` (multi-step state preserved across steps) |
| UI state (filters, search) | Local `useState` in screen |
| Toast notifications | `ToastContext` |
| Realtime messages | Supabase Realtime subscription in `useMessages` |

---

## Data Flow — Application → Approval

```
1. User fills multi-step form
   → ApplicationContext holds state across step1 → step4
   → On step4 submit: INSERT into applications table
   → Profile role stays 'applicant'

2. Admin sees application in queue
   → useApplications() fetches all pending applications
   → Admin taps application → full review screen

3. Admin clicks "Approve"
   → UPDATE applications SET status='approved', reviewed_by=admin_id, reviewed_at=now()
   → UPDATE profiles SET role='member', invite_code=generate_invite_code()
   → Call edge function: send-approval-email (sends login link to applicant)
   → Create notification: type='application_approved'

4. Applicant receives email, clicks link
   → Supabase magic link → opens app → session created
   → Auth routing detects role='member', onboarding_completed=false
   → Redirects to /(onboarding)/ for profile setup

5. Onboarding completed
   → UPDATE profiles SET onboarding_completed=true, avatar_url, bio, ...
   → Redirect to /(tabs)/ home feed
```

---

## Realtime — DM Messages

```typescript
// hooks/useMessages.ts
useEffect(() => {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => {
      queryClient.setQueryData(['messages', conversationId], (old) => [...old, payload.new])
    })
    .subscribe()
  
  return () => { supabase.removeChannel(channel) }
}, [conversationId])
```

---

## Key Architectural Decisions

1. **No separate backend server** — Supabase handles all data, auth, edge functions, realtime. Keeps complexity minimal for a hackathon timeline.

2. **File-based routing (Expo Router)** — Adding a screen = adding a file. No router config needed.

3. **TanStack Query everywhere** — Consistent loading/error/refetch handling. `placeholderData` from `mockData.ts` ensures screens never flash empty.

4. **ApplicationContext for multi-step form** — Prevents state loss when navigating between steps. Final submit happens only at the end.

5. **Role stored in `profiles.role`** — Checked at the RLS level in Supabase (can't be spoofed) and at the app routing level for UX.

6. **Invite codes are generated server-side** — Using Postgres `generate_invite_code()` function, triggered on approval. Prevents client-side manipulation.
