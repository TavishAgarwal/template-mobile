# Component Reference — Velvet

Every reusable component in the codebase, its props, and exact usage. Implement these components first — screens compose them.

---

## Design Token Imports

Always import from `lib/theme.ts` and `lib/typography.ts`. Never hardcode hex values or font names in components.

```typescript
import { ACCENT, BG_SURFACE, TEXT_PRIMARY, TEXT_SECONDARY, BORDER_DEFAULT } from '@/lib/theme'
import { TYPE_SCALE } from '@/lib/typography'
```

---

## UI Primitives (`components/ui/`)

### `Text.tsx`

Wraps RN `Text` with Velvet typography system. All text in the app uses this — never raw `<Text>`.

```typescript
type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'bodyLg' | 'body' | 'bodySm' | 'label' | 'caption' | 'quote' | 'number'

interface VelvetTextProps extends TextProps {
  variant?: TextVariant       // default: 'body'
  color?: string              // default: TEXT_PRIMARY
  italic?: boolean
  uppercase?: boolean         // adds letterSpacing: 1.5
  className?: string          // NativeWind
}
```

Usage:
```tsx
<Text variant="h1">Welcome to Velvet</Text>
<Text variant="label" uppercase color={TEXT_SECONDARY}>Members</Text>
<Text variant="quote" italic>Not everyone gets in.</Text>
```

---

### `Button.tsx`

Three variants exported from one file.

```typescript
interface ButtonProps {
  label: string
  onPress: () => void
  loading?: boolean           // shows spinner, disables press
  disabled?: boolean
  fullWidth?: boolean         // default true
  size?: 'sm' | 'md' | 'lg'  // md = 52px height (default)
  icon?: React.ReactNode      // left icon slot
}

// Primary CTA — gold background, black text
export function GoldButton(props: ButtonProps)

// Secondary — transparent, gold border + text
export function GhostButton(props: ButtonProps)

// Inline / link-style — no background or border
export function TextButton(props: ButtonProps & { destructive?: boolean })
```

Usage:
```tsx
<GoldButton label="Apply for Membership" onPress={handleApply} />
<GhostButton label="← Back" onPress={goBack} />
<TextButton label="Sign Out" onPress={signOut} destructive />
```

Pressed state: `opacity: 0.85` + `scale: 0.98` via Reanimated `useAnimatedStyle`.

---

### `Card.tsx`

Generic surface card. Used throughout.

```typescript
interface CardProps {
  children: React.ReactNode
  padding?: number            // default 16
  style?: ViewStyle
  onPress?: () => void        // makes card tappable with press animation
  glow?: boolean              // adds gold glow shadow
}
```

Background: `BG_SURFACE (#141414)`, border: `BORDER_DEFAULT (#2A2A2A)`, radius: `12px`.

---

### `AppModal.tsx`

Bottom sheet modal using `@gorhom/bottom-sheet` or RN's built-in `Modal` + animated slide.

```typescript
interface AppModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: string[]       // default ['50%', '90%']
}
```

Background: `BG_ELEVATED (#1C1C1C)`. Has drag handle at top. Dismisses on backdrop tap.

---

### `StatusBadge.tsx`

Pill badge for roles and statuses.

```typescript
type BadgeStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted' | 'member' | 'admin' | 'going' | 'maybe' | 'virtual' | 'in_person'

interface StatusBadgeProps {
  status: BadgeStatus
  size?: 'sm' | 'md'
}
```

Color mapping:
```
pending    → WARNING (#E8B84C) bg dim + text
approved   → SUCCESS (#4CAF7C) bg dim + text
rejected   → ERROR (#E85C4C) bg dim + text
waitlisted → WARNING
member     → ACCENT bg dim + gold text
admin      → ACCENT bg + black text (solid)
going      → SUCCESS
maybe      → WARNING
virtual    → INFO (#4C8CE8) bg dim + text
in_person  → ACCENT bg dim + text
```

---

### `TextInputField.tsx`

Velvet-styled text input with label.

```typescript
interface TextInputFieldProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  error?: string              // shows red error text below
  hint?: string               // shows muted hint text below
  multiline?: boolean
  maxLength?: number
  showCharCount?: boolean     // shows "X / maxLength" when multiline
  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: 'none' | 'sentences' | 'words'
  secureTextEntry?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  editable?: boolean
}
```

Styling:
- Background: `BG_INPUT (#1A1A1A)`
- Border: `BORDER_DEFAULT` → focused: `ACCENT_BORDER`
- Label: `TYPE_SCALE.label`, `TEXT_SECONDARY`, uppercase
- Text: `TYPE_SCALE.body`, `TEXT_PRIMARY`
- Error: `TYPE_SCALE.caption`, `ERROR`

---

### `Avatar.tsx`

Member avatar with initials fallback.

```typescript
interface AvatarProps {
  uri?: string | null
  name: string                // used for initials fallback
  size?: number               // default 48
  showOnline?: boolean
  isOnline?: boolean
  onPress?: () => void
}
```

Initials background: `ACCENT_DIM`. Initials text: `ACCENT`. Online dot: 10px, `SUCCESS` green, absolute bottom-right.

---

### `SkeletonLoader.tsx`

Shimmer placeholder for loading states.

```typescript
interface SkeletonLoaderProps {
  width: number | string
  height: number
  borderRadius?: number       // default 8
  style?: ViewStyle
}
```

Shimmer: animated `LinearGradient` from `#1C1C1C` → `#2A2A2A` → `#1C1C1C`, moving left-to-right on 1.2s loop.

---

### `GoldDivider.tsx`

Thin decorative gold horizontal line.

```typescript
interface GoldDividerProps {
  width?: number | string     // default '100%'
  style?: ViewStyle
}
```

Height: `1px`, color: `ACCENT_BORDER`.

---

## Application Components (`components/application/`)

### `StepProgress.tsx`

```typescript
interface StepProgressProps {
  currentStep: number         // 1-based
  totalSteps: number          // 4
  labels?: string[]           // optional step labels
}
```

- Animated progress bar: gold fill, width = `(currentStep / totalSteps) * 100%`, spring animation
- Step dots: filled gold (completed/current), grey (upcoming)

---

### `ApplicationFormField.tsx`

```typescript
interface ApplicationFormFieldProps extends TextInputFieldProps {
  stepHint?: string           // small italic prompt text above input
}
```

Wraps `TextInputField` with extra `stepHint` above and consistent vertical spacing.

---

## Member Components (`components/members/`)

### `MemberCard.tsx`

Grid card (2-column layout in directory).

```typescript
interface MemberCardProps {
  member: {
    id: string
    display_name: string
    avatar_url?: string
    profession?: string
    company?: string
    city?: string
    is_online?: boolean
  }
  onPress: (id: string) => void
}
```

Layout:
```
[Avatar — 120px height, full card width, cover fit]
[Name — Playfair 15px]
[Profession — DM Sans 13px muted]
[City — gold pill tag, 11px]
[Online dot — top-right overlay if online]
```

---

### `MemberListItem.tsx`

Row layout for list-view toggle.

```typescript
interface MemberListItemProps {
  member: MemberCardProps['member']
  onPress: (id: string) => void
}
```

Layout: `[Avatar 48px] [Name + Profession] [City pill] [Chevron]` horizontal row.

---

### `MemberFilter.tsx`

```typescript
interface MemberFilterProps {
  activeCity?: string
  activeProfession?: string
  showOnlineOnly: boolean
  cities: string[]
  professions: string[]
  onCityChange: (city?: string) => void
  onProfessionChange: (profession?: string) => void
  onOnlineToggle: () => void
}
```

Horizontal scroll of filter pills. Active pill: gold bg, black text. Inactive: ghost.

---

## Event Components (`components/events/`)

### `EventCard.tsx`

```typescript
interface EventCardProps {
  event: {
    id: string
    title: string
    cover_image_url?: string
    event_type: 'in_person' | 'virtual'
    starts_at: string
    location?: string
    rsvp_count: number
  }
  onPress: (id: string) => void
  compact?: boolean           // shorter version for home feed horizontal scroll
}
```

Full-width card with cover image hero. Date badge (gold) absolute top-right. Type pill absolute top-left.

---

### `EventBadge.tsx`

```typescript
interface EventBadgeProps {
  type: 'virtual' | 'in_person'
  size?: 'sm' | 'md'
}
```

Small pill: "Virtual" (blue) or "In Person" (gold).

---

### `RSVPButton.tsx`

```typescript
interface RSVPButtonProps {
  eventId: string
  currentStatus?: 'going' | 'maybe' | 'not_going' | null
  onStatusChange?: (status: string) => void
}
```

Shows toggle buttons. "Going ✓" = gold filled when selected. Uses `useEventRsvp` hook internally.

---

## Message Components (`components/messages/`)

### `ConversationRow.tsx`

```typescript
interface ConversationRowProps {
  conversation: {
    id: string
    other_member: {
      id: string
      display_name: string
      avatar_url?: string
      is_online?: boolean
    }
    last_message?: string
    last_message_at?: string
    unread_count?: number
  }
  onPress: (id: string) => void
}
```

---

### `MessageBubble.tsx`

```typescript
interface MessageBubbleProps {
  content: string
  isOwn: boolean
  createdAt: string
  showTimestamp?: boolean
  isRead?: boolean            // only shown on own messages
}
```

Own: `ACCENT_DIM` bg, right-aligned, border-radius `16 16 4 16`.
Theirs: `#1C1C1C` bg, left-aligned, border-radius `16 16 16 4`.

---

### `MessageInput.tsx`

```typescript
interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}
```

Fixed at bottom. Dark input field, gold send arrow button. Clears on send. Respects keyboard avoiding.

---

## Admin Components (`components/admin/`)

### `StatCard.tsx`

```typescript
interface StatCardProps {
  label: string
  value: number | string
  color?: string              // accent color for value text
  icon?: React.ReactNode
  onPress?: () => void
}
```

`TYPE_SCALE.number` (42px Playfair Bold) for value display.

---

### `ApplicationRow.tsx`

```typescript
interface ApplicationRowProps {
  application: {
    id: string
    full_name: string
    city: string
    profession: string
    created_at: string
    status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
  }
  onPress: (id: string) => void
  onQuickApprove?: (id: string) => void
  onQuickReject?: (id: string) => void
}
```

Swipeable row using `react-native-gesture-handler` `Swipeable`. Green reveal on right swipe (approve), red on left (reject).

---

### `AdminActionSheet.tsx`

```typescript
interface AdminActionSheetProps {
  visible: boolean
  onClose: () => void
  applicationId: string
  applicantName: string
  action: 'approve' | 'reject' | 'waitlist'
  onConfirm: () => Promise<void>
}
```

Bottom sheet confirmation before destructive admin actions. Shows action-specific copy and confirm button.

---

## Home Components (`components/home/`)

### `HomeFeedSection.tsx`

```typescript
interface HomeFeedSectionProps {
  title: string
  seeAllRoute?: string
  children: React.ReactNode
}
```

Section header row (`title` left, "See all →" right) + content below.

---

### `NewMembersRow.tsx`

```typescript
interface NewMembersRowProps {
  members: Array<{ id: string; display_name: string; avatar_url?: string }>
  onMemberPress: (id: string) => void
}
```

Horizontal `ScrollView` of `Avatar` (56px) + first name below, in `HomeFeedSection`.

---

### `UpcomingEventBanner.tsx`

```typescript
interface UpcomingEventBannerProps {
  event: EventCardProps['event']
  onPress: (id: string) => void
}
```

Prominent full-width card with cover image, overlay gradient, and RSVP button overlaid at bottom.

---

## Invite Components (`components/invites/`)

### `InviteCodeCard.tsx`

```typescript
interface InviteCodeCardProps {
  invite: {
    id: string
    code: string
    used_by?: { display_name: string } | null
    used_at?: string | null
    expires_at?: string | null
  }
  onCopy: (code: string) => void
  onShare: (code: string) => void
}
```

Gradient card (`#1C1C1C` → `#141414`). Code in Playfair 28px gold monospace-style. Copy icon button. Used codes shown with strikethrough + grey.

---

### `InviteStats.tsx`

```typescript
interface InviteStatsProps {
  used: number
  remaining: number
}
```

Horizontal stat row showing usage counters.

---

## Global Components (`components/`)

### `TabBar.tsx`

Custom animated tab bar. Gold active icon + label. Inactive: `TEXT_TERTIARY`. Animated indicator dot slides between tabs.

Icons: `Users`, `Calendar`, `MessageCircle`, `User` (Lucide). Plus `Shield` for admin.

Active tab: icon color `ACCENT`, label color `ACCENT`.
Inactive: `TEXT_TERTIARY`.

---

### `OfflineBanner.tsx`

Appears when `NetInfo` detects offline. Slides down from top. Amber background, white text: "You're offline. Some features may not work."

---

## Shared TypeScript Types

Create `types/index.ts`:

```typescript
export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  city: string | null
  profession: string | null
  company: string | null
  linkedin_url: string | null
  instagram_handle: string | null
  bio: string | null
  role: 'applicant' | 'pending' | 'member' | 'admin'
  invite_code: string | null
  invited_by: string | null
  invite_count: number
  is_online: boolean
  last_seen_at: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  user_id: string
  email: string
  full_name: string
  city: string
  profession: string
  company: string | null
  linkedin_url: string | null
  instagram_handle: string | null
  why_join: string
  referral_code: string | null
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  profile?: Profile
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_type: 'in_person' | 'virtual'
  location: string | null
  address: string | null
  virtual_link: string | null
  cover_image_url: string | null
  starts_at: string
  ends_at: string | null
  capacity: number | null
  rsvp_count: number
  is_published: boolean
  created_by: string
  created_at: string
}

export interface EventRsvp {
  id: string
  event_id: string
  user_id: string
  status: 'going' | 'maybe' | 'not_going'
  created_at: string
}

export interface Conversation {
  id: string
  member_1_id: string
  member_2_id: string
  last_message: string | null
  last_message_at: string | null
  created_at: string
  other_member?: Profile
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface Invite {
  id: string
  code: string
  created_by: string
  used_by: string | null
  used_at: string | null
  expires_at: string | null
  created_at: string
  used_by_profile?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: 'application_approved' | 'new_message' | 'event_reminder' | 'new_member' | 'invite_accepted' | 'application_rejected'
  title: string
  body: string | null
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}
```
