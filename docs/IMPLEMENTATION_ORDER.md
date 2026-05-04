# Implementation Order — Velvet

Build in this exact sequence. Each phase depends on the previous. Never skip ahead.

---

## Phase 0 — Project Bootstrap (30 min)

**Goal:** App runs, fonts load, Supabase connects.

1. Clone `github.com/8xsocial/template-mobile`
2. `npm install`
3. Install all required packages:
   ```bash
   npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
   npx expo install @tanstack/react-query
   npx expo install @gorhom/bottom-sheet react-native-gesture-handler react-native-reanimated
   npx expo install expo-image-picker expo-clipboard expo-sharing
   npx expo install expo-linear-gradient
   npx expo install lucide-react-native
   npx expo install @react-native-community/netinfo
   npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/dm-sans
   npm install i18next react-i18next
   npm install posthog-react-native
   ```
4. Create `.env.local`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
5. Set up `lib/supabase.ts`, `lib/queryClient.ts`, `lib/theme.ts`, `lib/typography.ts`
6. Set up fonts in root `app/_layout.tsx` with `useFonts()`
7. Verify: `npx expo start` → blank dark screen, no errors

---

## Phase 1 — Foundation Layer (1 hour)

**Goal:** All primitive UI components exist and render correctly.

Build in order:
1. `lib/theme.ts` — all color tokens
2. `lib/typography.ts` — TYPE_SCALE + font families
3. `lib/utils.ts` — `getInitials()`, `formatRelativeTime()`, `formatEventDate()`
4. `lib/mockData.ts` — realistic placeholder data for all entities
5. `lib/constants.ts` — APP_NAME, APP_TAGLINE, etc.
6. `components/ui/Text.tsx`
7. `components/ui/Button.tsx` (GoldButton, GhostButton, TextButton)
8. `components/ui/Card.tsx`
9. `components/ui/Avatar.tsx`
10. `components/ui/TextInputField.tsx`
11. `components/ui/StatusBadge.tsx`
12. `components/ui/SkeletonLoader.tsx`
13. `components/ui/GoldDivider.tsx`
14. `components/ui/AppModal.tsx`

**Verification:** Create a temporary dev screen that renders all components. Every component must look pixel-perfect before moving on.

---

## Phase 2 — Auth & Context (1 hour)

**Goal:** Login works. Session persists. Role routing works.

1. Run Supabase migration `001_init.sql` (profiles table + trigger)
2. `contexts/AuthContext.tsx` — session listener, profile fetch, role
3. `contexts/ToastContext.tsx` — useToast hook
4. `app/_layout.tsx` — auth guard + role routing
5. `app/(auth)/login.tsx` — OTP email login + Google/Apple
6. Test: Sign up → profile auto-created → role = 'applicant' → redirects to /apply/submitted

---

## Phase 3 — Application Flow (1 hour)

**Goal:** Full application submission works end-to-end.

1. Run migration `002_applications.sql`
2. `contexts/ApplicationContext.tsx` — multi-step form state
3. `components/application/StepProgress.tsx`
4. `components/application/ApplicationFormField.tsx`
5. `app/apply/_layout.tsx`
6. `app/apply/step1.tsx` — Name, email, city
7. `app/apply/step2.tsx` — Profession, company, LinkedIn
8. `app/apply/step3.tsx` — Essay (100-500 chars)
9. `app/apply/step4.tsx` — Instagram + referral code validation
10. `app/apply/submitted.tsx` — Confirmation
11. `app/index.tsx` — Landing page

Test: Full apply flow → check applications table in Supabase dashboard

---

## Phase 4 — Admin Flow (1 hour)

**Goal:** Admin can log in, see applications, approve/reject.

1. Manually set a user's role to 'admin' in Supabase
2. `hooks/useApplications.ts`
3. `hooks/useApplication.ts`
4. `components/admin/StatCard.tsx`
5. `components/admin/ApplicationRow.tsx`
6. `components/admin/AdminActionSheet.tsx`
7. `app/admin/_layout.tsx` — role guard
8. `app/admin/index.tsx` — dashboard with stats
9. `app/admin/applications/index.tsx` — application queue
10. `app/admin/applications/[id].tsx` — full review + approve/reject
11. Set up edge function `send-approval-email`
12. Set up edge function `send-rejection-email`

Test: Approve applicant → role changes to 'member' → email sent

---

## Phase 5 — Onboarding (30 min)

**Goal:** Newly approved member completes profile setup.

1. `app/(onboarding)/index.tsx` — avatar, bio, display name
2. `hooks/useProfile.ts` — own profile fetch + update mutation
3. Wire up image picker (expo-image-picker) + Supabase storage upload
4. On complete: set `onboarding_completed = true` → redirect to `/(tabs)/`

---

## Phase 6 — Core Member Screens (2 hours)

**Goal:** All 5 tab screens are functional and polished.

### Tab bar first:
1. `components/TabBar.tsx` — custom animated gold tab bar
2. `app/(tabs)/_layout.tsx`

### Then each tab:
3. `hooks/useMembers.ts`
4. `components/members/MemberCard.tsx`
5. `components/members/MemberListItem.tsx`
6. `components/members/MemberFilter.tsx`
7. `app/(tabs)/members.tsx` — directory with search + filter
8. `app/member/[id].tsx` — member profile detail

9. `hooks/useEvents.ts`
10. `components/events/EventCard.tsx`
11. `components/events/EventBadge.tsx`
12. `components/events/RSVPButton.tsx`
13. `hooks/useEventRsvp.ts`
14. `app/(tabs)/events.tsx` — events board
15. `app/event/[id].tsx` — event detail

16. `hooks/useConversations.ts`
17. `hooks/useMessages.ts`
18. `components/messages/ConversationRow.tsx`
19. `components/messages/MessageBubble.tsx`
20. `components/messages/MessageInput.tsx`
21. `app/(tabs)/messages.tsx` — DM inbox
22. `app/messages/[id].tsx` — chat thread

23. `app/(tabs)/profile.tsx` — own profile
24. `app/profile/edit.tsx` — edit profile

25. `hooks/useUnreadCount.ts`
26. `components/OfflineBanner.tsx`

---

## Phase 7 — Home Feed (1 hour)

**Goal:** Home tab is beautiful and shows real data.

1. `components/home/HomeFeedSection.tsx`
2. `components/home/NewMembersRow.tsx`
3. `components/home/UpcomingEventBanner.tsx`
4. `app/(tabs)/index.tsx` — full home feed with all sections

---

## Phase 8 — Invite System (30 min)

**Goal:** Members can generate and share invite codes.

1. Run migration `005_invites.sql`
2. `hooks/useInvites.ts`
3. `lib/inviteUtils.ts` — generate code, validate
4. `components/invites/InviteCodeCard.tsx`
5. `components/invites/InviteStats.tsx`
6. `app/invites.tsx` — my invites screen

---

## Phase 9 — Admin Event Creation (30 min)

1. `app/admin/events/create.tsx`
2. `app/admin/members/index.tsx`

---

## Phase 10 — Notifications (30 min)

1. Run migration `006_notifications.sql`
2. `hooks/useNotifications.ts`
3. Realtime subscription for notifications
4. Badge count on messages tab

---

## Phase 11 — Polish & QA (1 hour)

**Goal:** Every screen looks exactly as specced. All flows work end-to-end.

1. Add empty states to all list screens
2. Add error states with retry
3. Add loading skeletons everywhere
4. Test full flow: Apply → Admin approves → Onboard → Browse members → RSVP event → DM member → Share invite
5. Fix any navigation edge cases
6. Ensure keyboard avoiding works on all input screens
7. Test on both iOS and Android (or at least both simulators)

---

## Phase 12 — Landing & Public Pages (30 min)

1. `app/index.tsx` — polish landing page (count-up animation, shimmer)
2. `app/privacy.tsx` — Privacy policy (static)
3. `app/terms.tsx` — Terms of service (static)

---

## Dependency Graph

```
Phase 0 (Bootstrap)
  └─ Phase 1 (UI Primitives)
       └─ Phase 2 (Auth)
            ├─ Phase 3 (Apply Flow)
            └─ Phase 4 (Admin)
                 └─ Phase 5 (Onboarding)
                      └─ Phase 6 (Member Screens)
                           ├─ Phase 7 (Home Feed)
                           ├─ Phase 8 (Invites)
                           └─ Phase 10 (Notifications)
                                └─ Phase 9 (Admin Events)
                                     └─ Phase 11 (Polish)
                                          └─ Phase 12 (Landing)
```

---

## What to Build Next When Stuck

If you're not sure what to build next, check this priority list:
1. Does the basic auth flow work? (login → role redirect)
2. Can an admin approve an application?
3. Can a member browse the directory?
4. Can a member RSVP to an event?
5. Can members DM each other?
6. Does the invite system work?

These 6 things are the core demo path. Everything else is polish.

---

## Common Gotchas

- **Fonts not loading**: Always `await` `useFonts()` and show a `SplashScreen` until loaded
- **Supabase RLS blocking queries**: Check that RLS policies are set correctly for each table. Member queries require role = 'member'.
- **Realtime not working**: Enable replication on the table in Supabase dashboard → Database → Replication
- **Image uploads failing**: Check storage bucket policies — avatars and event-covers should be public read
- **`useLocalSearchParams` returning undefined**: Ensure the file is in the correct Expo Router path (e.g., `app/member/[id].tsx` not `app/member/id.tsx`)
- **Android keyboard avoiding**: Use `KeyboardAvoidingView` with `behavior="height"` on Android and `behavior="padding"` on iOS
- **Bottom safe area**: Always wrap fixed-bottom buttons with `useSafeAreaInsets().bottom` to avoid home indicator overlap
