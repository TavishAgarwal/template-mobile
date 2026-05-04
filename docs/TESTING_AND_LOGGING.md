# Testing, Logging & Reflection — Velvet

---

## AI Development Logs — `.claude-logs/`

Every session with an AI assistant must be logged here. This is a judging criterion.

### Log Format — `.claude-logs/session-001.md`

```markdown
# Session 001 — Phase 0–1: Bootstrap + UI Primitives
**Date:** YYYY-MM-DD
**Duration:** ~2 hours
**Phase:** 0 (Bootstrap) + 1 (UI Primitives)

## Goal
Get the app running, fonts loaded, and all primitive UI components built.

## Prompts Used

### Prompt 1 — Project Setup
> "I'm building Velvet, a Lox Club clone on the 8x Expo template. 
> Help me set up lib/supabase.ts, lib/theme.ts with the exact color tokens 
> from DESIGN_SYSTEM.md, and lib/typography.ts with the Playfair/DM Sans scale."

**Result:** ✅ All three lib files created correctly. Fonts load with useFonts().

### Prompt 2 — Button Component
> "Build components/ui/Button.tsx with GoldButton, GhostButton, and TextButton 
> variants. Use Reanimated for press animation (scale 0.98, opacity 0.85). 
> Import colors only from lib/theme.ts."

**Result:** ✅ All three variants work. Press animation smooth on both platforms.

### Prompt 3 — Avatar Component  
> "Build components/ui/Avatar.tsx. Shows image if uri provided, falls back to 
> initials using getInitials() from lib/utils.ts. Online dot is 10px SUCCESS 
> green, absolute bottom-right. Sizes: 32, 48, 56, 80px."

**Result:** ✅ Works. Had to fix initials background color (used BG_ELEVATED instead of ACCENT_DIM initially).

## Issues Encountered
- Fonts: Had to add `expo-font` plugin to app.json explicitly
- NativeWind v4: Required global.css import in _layout.tsx root

## What Worked Well
- The theme.ts token approach means zero color inconsistencies
- Reanimated press animations feel premium immediately

## What to Improve Next Session
- Build TextInputField with focus border animation
- Start on AuthContext
```

---

### Log Template — Copy for each session

```markdown
# Session 00X — [Phase Name]
**Date:** YYYY-MM-DD
**Duration:** 
**Phase:** 

## Goal


## Prompts Used

### Prompt 1 — [Topic]
> "[Exact prompt text]"

**Result:** ✅/❌ [What happened]

### Prompt 2 — [Topic]
> "[Exact prompt text]"

**Result:** ✅/❌ [What happened]

## Issues Encountered


## What Worked Well


## What to Improve Next Session

```

---

## Recommended Session Structure

Run one session per phase from IMPLEMENTATION_ORDER.md:

| Session | Phase | Target Duration |
|---------|-------|-----------------|
| 001 | Phase 0–1: Bootstrap + UI Primitives | 2 hrs |
| 002 | Phase 2: Auth + Context | 1 hr |
| 003 | Phase 3: Application Flow | 1 hr |
| 004 | Phase 4: Admin Flow | 1 hr |
| 005 | Phase 5–6: Onboarding + Core Screens | 2 hrs |
| 006 | Phase 7–8: Home Feed + Invites | 1.5 hrs |
| 007 | Phase 9–10: Admin Events + Notifications | 1 hr |
| 008 | Phase 11–12: Polish + Landing | 1 hr |

---

## Testing Strategy

### Manual Testing Checklist

Run through this checklist before any demo or screenshot session.

#### Auth Flow
- [ ] Landing page renders with no errors
- [ ] "Apply for Membership" → step1 opens
- [ ] OTP email login sends email
- [ ] Magic link opens app and creates session
- [ ] Role-based redirect works: applicant → /apply/submitted
- [ ] Role-based redirect works: member → /(tabs)/
- [ ] Role-based redirect works: admin → /(tabs)/ (with admin access)
- [ ] Sign out clears session and redirects to /

#### Application Flow
- [ ] Step 1: Name, email, city required — Next disabled if empty
- [ ] Step 2: Profession required — LinkedIn URL validated if provided
- [ ] Step 3: Essay min 100 chars enforced — character counter shows
- [ ] Step 4: Referral code shows green tick if valid, silent if invalid
- [ ] Submit → row appears in Supabase `applications` table
- [ ] /apply/submitted shows confirmation state

#### Admin Flow
- [ ] Admin can log in and reaches /(tabs)/ with admin access
- [ ] /admin shows stat cards with real counts
- [ ] Application queue shows pending applications
- [ ] Application review shows full essay + details
- [ ] Approve → profile role changes to 'member' in DB
- [ ] Reject → application status changes to 'rejected' in DB
- [ ] Toast shows on approve/reject
- [ ] Admin action sheet appears before confirm

#### Member Screens
- [ ] Home feed shows upcoming events section
- [ ] Home feed shows new members row
- [ ] Members tab shows grid of members
- [ ] Members search filters in real-time
- [ ] City/profession filters work
- [ ] Online Now filter works
- [ ] Grid/list toggle works
- [ ] Member profile taps open /member/[id]
- [ ] Send Message → creates/finds conversation → opens thread

#### Events
- [ ] Events tab shows event cards
- [ ] Filter tabs (All/In Person/Virtual/Going) work
- [ ] Event detail shows cover image, details, attendees
- [ ] RSVP button toggles going/maybe
- [ ] Optimistic update feels instant
- [ ] RSVP count updates after toggle

#### Messaging
- [ ] Messages tab shows conversation list
- [ ] Unread badge appears on tab icon
- [ ] Conversation row shows last message + timestamp
- [ ] Chat thread loads messages in order
- [ ] Send message appears immediately (optimistic)
- [ ] Realtime: message from other side appears without refresh
- [ ] Read receipts update
- [ ] Keyboard avoiding works (input stays above keyboard)

#### Invites
- [ ] My Invites screen shows codes + stats
- [ ] Generate button creates new code
- [ ] Copy button copies code to clipboard
- [ ] Share opens native share sheet
- [ ] Used codes show strikethrough

#### Polish
- [ ] All screens have loading skeleton (not spinner)
- [ ] All list screens have empty state
- [ ] All screens have error state with retry
- [ ] Offline banner appears when network drops
- [ ] Safe area respected on all screens (notch + home indicator)
- [ ] Keyboard avoiding on all input screens
- [ ] Back navigation works from all detail screens

---

## Screenshot Checklist

These are the screens judges will look at first. Get them perfect.

### Priority 1 — Must be pixel-perfect
1. Landing page (`/`)
2. Member directory (`/(tabs)/members`) — grid view, populated
3. Member profile (`/member/[id]`) — with avatar, bio, details
4. Admin application review (`/admin/applications/[id]`) — with essay
5. DM thread (`/messages/[id]`) — with messages bubbles

### Priority 2 — Should look great
6. Home feed (`/(tabs)/`) — all sections populated
7. Events board (`/(tabs)/events`) — with event cards
8. Event detail (`/event/[id]`) — with hero image
9. Admin dashboard (`/admin/`) — with real stat numbers
10. Application flow (`/apply/step3`) — essay step

### Priority 3 — Clean and functional
11. Login screen (`/(auth)/login`)
12. Profile screen (`/(tabs)/profile`)
13. Messages inbox (`/(tabs)/messages`)
14. My invites (`/invites`)
15. Onboarding (`/(onboarding)/`)

---

## REFLECTION.md Template

Ship this file with your submission. Be honest — judges reward self-awareness.

```markdown
# Velvet — Reflection

**Built by:** [Your name]  
**Time spent:** ~X hours  
**Date:** YYYY-MM-DD

---

## What I Built

Velvet is a hyper-curated, application-gated mobile community app — a Lox Club clone 
built on Expo + Supabase. Members apply, admins approve, and the community lives inside 
a dark luxury mobile experience.

**Core flows delivered:**
- ✅ Multi-step application form with validation
- ✅ Admin approval dashboard with approve/reject/waitlist
- ✅ Member directory with search and filters
- ✅ Events board with RSVP (optimistic updates)
- ✅ Direct messaging with Realtime
- ✅ Invite code system
- ✅ Role-based routing and auth guards

---

## What Was Easy

- **Supabase RLS** — The row-level security policies map cleanly to the role model. 
  Once the patterns clicked, every new table took ~5 minutes to secure correctly.

- **TanStack Query** — The `placeholderData` pattern from mockData.ts meant screens 
  never flashed empty. Zero loading spinners for content — pure skeleton shimmer.

- **Design system** — Having all tokens in lib/theme.ts from the start eliminated 
  all color decisions mid-build. Every component just imports and uses.

---

## What Was Hard

- **Realtime + TanStack Query coordination** — Getting the Supabase Realtime 
  subscription to update TanStack Query cache correctly (without duplicates) 
  required careful deduplication logic in useSendMessage.

- **Keyboard avoiding on Android** — iOS `padding` behavior and Android `height` 
  behavior needed different treatment. The chat input was the trickiest.

- **RLS for conversations** — The double-ended UNIQUE constraint and `OR` query 
  patterns for conversations took iteration to get right.

---

## What I'd Change

1. **Notifications** — In-app notifications are wired but could be richer. 
   Push notifications (Expo Notifications + APNs) would make the demo more live.

2. **Member search** — Current search is client-side filtered. At scale, 
   this should be Postgres full-text search (`to_tsvector`).

3. **Admin analytics** — The stat cards use `COUNT(*)` queries. A proper 
   analytics view with time-series charts would make the admin dashboard more powerful.

4. **Image optimization** — Avatars are served raw from Supabase Storage. 
   A CDN with image resizing (Cloudflare Images or imgproxy) would help performance.

---

## AI-Assisted Development

Every component and screen was built with AI assistance (Claude). The key discipline 
was treating AI as a fast executor of well-specified prompts, not a decision-maker.

**What worked:**
- Giving the full design spec (exact colors, typography, dimensions) in every prompt
- Showing the TypeScript interface before asking for implementation
- Asking for one component at a time, not "build the whole app"

**What didn't:**
- Asking for "refactor X" without specifying the exact outcome — led to 
  over-engineered rewrites
- Not checking the generated RLS policies carefully — had two bugs in policies 
  that blocked valid queries

**Total AI prompts:** ~[X] across [N] sessions  
**Logs:** See `.claude-logs/` for full session notes

---

## Honest Assessment

[Write 2-3 sentences about what the app genuinely does well vs what's incomplete 
or rough around the edges. Judges value honesty over marketing.]
```

---

## Quick Debug Commands

```bash
# Check if Supabase is reachable
curl $EXPO_PUBLIC_SUPABASE_URL/rest/v1/ \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_ANON_KEY"

# Clear all caches and restart
npx expo start --clear

# Check TypeScript errors
npx tsc --noEmit

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator  
npx expo run:android

# Check bundle size
npx expo export --platform ios
```
