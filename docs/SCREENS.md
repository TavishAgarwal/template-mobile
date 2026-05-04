# Screen Specifications — Velvet

Detailed spec for every screen in the app. Implement each exactly as described.

---

## 1. Landing Page — `app/index.tsx`

**Purpose:** First impression. Conveys exclusivity. Drives application.

**Layout (top → bottom):**
```
StatusBar: light content

[HERO SECTION] — full screen height
  Background: radial gradient from #1C1400 to #0A0A0A
  Center content:
    Gold crown icon (32px, #C9A84C)
    "VELVET" — Playfair Display Bold 48px, #F5F5F0, letter-spacing 8px
    Gold divider (60px wide, 1px)
    "Not everyone gets in." — Playfair Italic 18px, #888880
    Spacing: 48px
    [Apply for Membership] — GoldButton, full width, 52px height
    [Already a member? Sign in] — ghost link, center, smaller text
  Bottom text: "X members. Y cities." (animated count-up numbers)

[ABOUT SECTION] — padding 24px
  "What is Velvet?" — Playfair 22px
  Body text (2-3 lines about the community)
  
  [3 FEATURE PILLS] — horizontal scroll
    Each: icon + label (Curated Members / Exclusive Events / Private Messaging)

[FOOTER]
  Privacy · Terms (small links)
  "© 2025 Velvet"
```

**Animations:**
- "VELVET" text fades + slides up on mount (staggered with tagline)
- Count-up animation on member/city numbers
- Gold shimmer on the brand name (subtle)

---

## 2. Application Step 1 — `app/apply/step1.tsx`

**Inputs:**
- Full Name (required)
- Email Address (required, validated)
- City (required, free text or picker)

**Header:** "Tell us about yourself." — Playfair 24px

**Bottom bar:** [Next →] GoldButton (disabled until valid)

---

## 3. Application Step 2 — `app/apply/step2.tsx`

**Inputs:**
- What do you do? (Profession — required)
- Company or Organization
- LinkedIn URL (optional, validated URL)

**Header:** "What do you do?" — Playfair 24px

**Bottom bar:** [← Back] [Next →] side by side

---

## 4. Application Step 3 — `app/apply/step3.tsx`

**Inputs:**
- "Why do you want to join Velvet?" — multiline TextInput, min 100 chars, max 500
- Character counter shown below (e.g., "243 / 500")

**Header:** "Make your case." — Playfair 24px
**Subheader:** "This is the most important part." — italic, muted

**Bottom bar:** [← Back] [Next →] (Next enabled when ≥ 100 chars)

---

## 5. Application Step 4 — `app/apply/step4.tsx`

**Inputs:**
- Instagram handle (@ prefix shown, optional)
- Referral code (optional — "Were you referred by a member?")

**Referral code behavior:** If a valid code exists in `invites` table, show a green "✓ Valid invite code" confirmation. Invalid codes show nothing (silent fail — don't discourage).

**Header:** "Almost there." — Playfair 24px

**Bottom bar:** [← Back] [Submit Application] GoldButton

**On submit:** Show loading spinner, then navigate to `/apply/submitted`

---

## 6. Application Submitted — `app/apply/submitted.tsx`

**Layout:**
```
Gold checkmark icon (large, animated scale-in)
"Application Received." — Playfair Bold 28px
"We'll review your application and be in touch." — body text, muted
---
"What happens next:" — label
  • We review every application personally.
  • We email you within 7 days.
  • If approved, you'll receive a login link.
---
[Sign in to check status] — ghost link (for returning applicants)
```

**State:** If user is authenticated and role = 'pending', show their status here dynamically.

---

## 7. Login — `app/(auth)/login.tsx`

**Layout:**
```
"VELVET" wordmark (smaller)
"Welcome back." — Playfair 24px
Email input
[Send Login Link] — GoldButton
"Or continue with" — divider
[Continue with Google] — white button, Google icon
[Continue with Apple] — black button, Apple icon
```

**OTP flow:** After email submit, show "Check your inbox." confirmation screen with resend option.

---

## 8. Onboarding — `app/(onboarding)/index.tsx`

**Shown once after first approval login.**

**Layout:**
```
"Welcome to Velvet." — Playfair Bold 28px
"Let's complete your profile." — muted body

[Avatar picker] — large circle, tap to choose from camera/library
  Shows initials placeholder until photo selected

[Display Name] — pre-filled from application
[Bio] — "Introduce yourself in a sentence or two." (multiline, 160 char max)
[City] — pre-filled from application

[Complete Profile] — GoldButton
```

---

## 9. Home Feed — `app/(tabs)/index.tsx`

**Header:**
```
"Good [morning/evening], [First Name]." — Playfair 22px
Date line — DM Sans muted
```

**Sections:**
```
[UPCOMING EVENTS]
  Horizontal scroll of EventCard components (compact version)
  "See all →" link

[NEW MEMBERS]
  Horizontal avatar scroll — 7-8 most recently approved members
  Each: avatar + first name below
  Tap → /member/[id]

[THE CIRCLE — X members online]
  Small online indicator grid (avatars of currently online members)

[RECENT ACTIVITY]
  Feed items:
  - "[Name] joined Velvet" (new member)
  - "[Name] is going to [Event]" (RSVP)
  - "[Name] referred [Name]" (invite accepted)
  Each item: avatar, text, timestamp
```

---

## 10. Member Directory — `app/(tabs)/members.tsx`

**Header:**
```
"Members" — Playfair 28px
"X people in the circle" — muted caption
```

**Filter bar (horizontal scroll, sticky):**
```
[All] [By City ▾] [By Profession ▾] [Online Now]
```

**Grid view:** 2-column MemberCard grid  
**Toggle:** Grid / List view (icon button top right)

**MemberCard shows:**
- Photo (full card top, 120px height)
- Name (Playfair 15px)
- Profession + Company
- City (gold pill)
- Online dot (if online)

**Search:** Search bar above filter — live filter on display_name, profession, city

---

## 11. Events Board — `app/(tabs)/events.tsx`

**Header:**
```
"Events" — Playfair 28px
```

**Filter tabs:** [All] [In Person] [Virtual] [Going]

**EventCard (full width):**
- Cover image (180px, full width)
- Date badge (absolute top-right corner)
- Event type pill (top-left)
- Title (Playfair 18px)
- Location / Platform
- RSVP count ("12 going")
- [RSVP] button

**Empty state (no events):** "Something's coming. Watch this space."

---

## 12. Messages Inbox — `app/(tabs)/messages.tsx`

**Header:** "Messages" — Playfair 28px

**Search bar** for filtering conversations.

**Conversation rows:**
- Avatar (48px) with online dot
- Name (DM Sans bold 15px)
- Last message preview (truncated 1 line, muted)
- Timestamp (right aligned, small)
- Unread badge (gold circle with count)

**New message FAB:** Gold `+` button (bottom right) → member picker to start new conversation

**Empty state:** "Your conversations await." + "Find a member and say hello."

---

## 13. Profile — `app/(tabs)/profile.tsx`

**Layout:**
```
[Avatar — 80px] [Display name — Playfair 22px]
[Profession] · [City]
[Bio — 2 lines, expandable]

[STATS ROW]
  Member Since · Invites Used · Events RSVPed

[ACTIONS]
  [Edit Profile] — ghost button
  [My Invites] — row with invite count badge → /invites

[SETTINGS SECTION]
  Notifications (toggle)
  Privacy settings
  [Sign Out] — destructive text button
```

**Admin badge:** If role = 'admin', show gold "ADMIN" badge under name.

---

## 14. Member Profile — `app/member/[id].tsx`

**Layout:**
```
[Back button]
[Avatar — 80px + online dot]
[Name — Playfair 24px]
[Profession at Company]
[City pill]
[Bio]
[Mutual connections count — if applicable]

[CTA BUTTONS]
  [Send Message] — GoldButton
  [LinkedIn ↗] — ghost button (if url exists)

[EVENTS IN COMMON] — if any mutual RSVPs
```

---

## 15. Event Detail — `app/event/[id].tsx`

**Layout:**
```
[Cover image — full width hero]
[Title — Playfair 24px on dark overlay]

[DETAIL CARDS]
  📅 Date & Time (formatted)
  📍 Location / Platform (with map link if in-person)
  👥 X people going (avatar stack of first 5 + count)

[DESCRIPTION — full body text]

[GOING section]
  Avatar strip of RSVPed members (horizontal scroll)
  "See all X →"

[BOTTOM FIXED BAR]
  [Going ✓] / [RSVP] — GoldButton
  [Maybe] — ghost button
```

---

## 16. DM Thread — `app/messages/[id].tsx`

**Header:**
```
[Back] [Avatar 36px] [Name] [Online dot]
```

**Message list (FlatList, inverted):**
- Own messages: right-aligned, ACCENT_DIM bg, gold border
- Their messages: left-aligned, #1C1C1C bg
- Timestamps on long gaps
- Read receipts (small "Read" text under last own message)

**Input bar (fixed bottom, above keyboard):**
- Text input (dark bg, rounded)
- Send button (gold arrow icon)
- Keyboard avoiding behavior

---

## 17. My Invites — `app/invites.tsx`

**Header:**
```
"Your Invites" — Playfair 28px
"Share Velvet with people worth knowing." — italic muted
```

**Stats row:** "X invites used" · "X remaining"

**Invite code list:**
- Each code shown as `InviteCodeCard`
- Status: Available / Used (by [Name]) / Expired
- Copy button on available codes
- Share sheet on long press

**Generate invite:** If invite_count > 0, [Generate New Invite Link] button

---

## 18. Edit Profile — `app/profile/edit.tsx`

**Fields:**
- Profile photo (with replace option)
- Display name
- Bio (160 char limit)
- City
- Profession
- Company
- LinkedIn URL
- Instagram handle

**Save:** [Save Changes] GoldButton (bottom fixed)  
**Unsaved changes warning:** Alert if navigating away with unsaved changes

---

## 19. Admin Dashboard — `app/admin/index.tsx`

**Header:** Crown icon + "Admin" label

**Stat cards (2x2 grid):**
- Pending Applications (count, amber)
- Total Members (count, gold)
- Events This Month (count, blue)
- Messages Today (count, green)

**Quick actions:**
- [Review Applications] → /admin/applications (with pending count badge)
- [Create Event] → /admin/events/create
- [Manage Members] → /admin/members

**Recent activity log:** last 10 admin actions (approval, rejection, event created)

---

## 20. Application Queue — `app/admin/applications/index.tsx`

**Header:** "Applications" + count

**Filter tabs:** [Pending] [Approved] [Rejected] [All]

**Sort:** Newest first (default) / Oldest first

**ApplicationRow:**
- Name + city + profession
- Applied N days ago
- Status badge
- [Review →] tap to full review

**Swipe actions:**
- Swipe left → Approve (green) / Reject (red) quick actions

---

## 21. Application Review — `app/admin/applications/[id].tsx`

**Full layout:**
```
[← Back to queue]
[Name — Playfair 24px]  [Status badge]
[Email] [City]

[DETAILS SECTION]
  Profession: [value]
  Company: [value]
  LinkedIn: [link if present]
  Instagram: @[handle if present]
  Applied via invite: [code if present]

[ESSAY SECTION — highlighted card]
  "Why I want to join:"
  [Their essay answer — full text, Playfair italic quote style]

[ADMIN NOTES]
  [Text area for private notes]

[ACTION BAR — fixed bottom]
  [✕ Reject] [→ Waitlist] [✓ Approve]
  (Red ghost) (Amber ghost) (Gold filled)
```

**On Approve:**
- Confirmation bottom sheet: "Approve [Name]? They'll receive an email with login access."
- [Confirm Approval] → update DB → trigger email function → show success toast

**On Reject:**
- Bottom sheet: "Reject [Name]? This action can't be undone."
- [Confirm Rejection] → update DB → trigger rejection email

---

## 22. Member Management — `app/admin/members/index.tsx`

**Header:** "Members" + total count

**Search + filter by city/profession**

**Member rows:**
- Avatar, name, email, join date, role badge
- [⋯] options: Suspend / Promote to Admin / Revoke Invites

---

## 23. Create Event — `app/admin/events/create.tsx`

**Fields:**
- Cover image upload (from camera or library)
- Event title
- Event type: [In Person] / [Virtual] toggle
- Date + Time picker
- End time picker (optional)
- Location (address) OR Virtual link
- Capacity (optional)
- Full description

**Preview:** [Preview Card] shows EventCard as it'll appear to members

**Actions:** [Save as Draft] [Publish Event]
