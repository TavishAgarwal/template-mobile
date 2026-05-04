# Velvet — Exclusive Invite-Only Community App
## Project Overview & Vision

---

## What We're Building

**Velvet** is a hyper-curated, application-gated mobile community — a Lox Club clone built on the 8x React Native Expo template. Users apply for membership, admins approve or reject, and approved members get access to a luxurious member directory, curated events, direct messaging, and an invite referral system.

**Brand Positioning:** "Where interesting people find each other."  
**Aesthetic:** Dark luxury — deep blacks, warm gold accents, editorial typography, soft glows. Think a private members' club meets a gallery opening.

---

## Core User Flows

### Flow 1 — Application (Unauthenticated)
```
Landing → Apply → Multi-step Form → Submission Confirmation → Wait Screen
```

### Flow 2 — Admin Review (Admin Role)
```
Login → Admin Dashboard → Application Queue → Review Profile → Approve/Reject → Notify
```

### Flow 3 — Member Onboarding (Newly Approved)
```
Approval Email → OTP Login → Profile Setup → Welcome Screen → Member Home
```

### Flow 4 — Member Daily Use
```
Home Feed → Member Directory (browse/filter) → Member Profile → DM Thread → Events Board → Event Detail
```

### Flow 5 — Invite Flow
```
Profile → My Invites → Generate Invite Link → Share → Referee Applies → Track Status
```

---

## App Screens Inventory

### Public Screens (unauthenticated)
| Screen | Route | Description |
|--------|-------|-------------|
| Landing | `/` | Hero, brand story, apply CTA |
| Application Step 1 | `/apply/step1` | Name, email, city |
| Application Step 2 | `/apply/step2` | Profession, company, LinkedIn |
| Application Step 3 | `/apply/step3` | Why do you want to join? (essay) |
| Application Step 4 | `/apply/step4` | Instagram handle, referral code |
| Application Submitted | `/apply/submitted` | Confirmation + "We'll be in touch" |
| Login | `/(auth)/login` | OTP email login |

### Member Screens (authenticated, approved)
| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/(tabs)/` | Feed — events, new members, activity |
| Members | `/(tabs)/members` | Directory with filter/search |
| Events | `/(tabs)/events` | Events board — virtual + in-person |
| Messages | `/(tabs)/messages` | DM inbox |
| Profile | `/(tabs)/profile` | Own profile + settings |
| Member Detail | `/member/[id]` | Another member's profile |
| Event Detail | `/event/[id]` | Event info + RSVP |
| DM Thread | `/messages/[id]` | Chat with a member |
| My Invites | `/invites` | Generate + track invites |
| Edit Profile | `/profile/edit` | Edit own profile fields |

### Admin Screens (authenticated, admin role)
| Screen | Route | Description |
|--------|-------|-------------|
| Admin Dashboard | `/admin` | Stats overview |
| Application Queue | `/admin/applications` | Pending review list |
| Application Review | `/admin/applications/[id]` | Full application, approve/reject |
| Member Management | `/admin/members` | All members, suspend/remove |
| Event Creation | `/admin/events/create` | Create new event |

---

## Tech Stack

| Layer | Package |
|-------|---------|
| Framework | Expo ~55 + React Native 0.83 |
| Language | TypeScript |
| Routing | Expo Router (file-based) |
| Styling | NativeWind + Tailwind CSS |
| Backend | Supabase (auth + DB + realtime + storage) |
| Data Fetching | TanStack Query v5 |
| Animations | React Native Reanimated 4 |
| Icons | Lucide React Native + Expo Vector Icons |
| i18n | i18next |

---

## Roles

| Role | Value in DB | Access |
|------|-------------|--------|
| Applicant | `applicant` | Apply only, no member access |
| Pending | `pending` | Applied, awaiting review |
| Member | `member` | Full member access |
| Admin | `admin` | Member access + admin dashboard |

Role is stored in `profiles.role` and checked in route guards.

---

## Brand Identity

- **App Name:** Velvet
- **Tagline:** "Not everyone gets in."
- **Primary Color:** `#C9A84C` (warm gold)
- **Background:** `#0A0A0A` (near black)
- **Surface:** `#141414` (card background)
- **Border:** `#2A2A2A` (subtle dividers)
- **Text Primary:** `#F5F5F0` (warm white)
- **Text Secondary:** `#888880` (muted)
- **Font Display:** Playfair Display (headings — editorial luxury)
- **Font Body:** DM Sans (clean, modern body text)

---

## Competitive Reference

**Lox Club** (loxclub.com) — The reference app. Key design patterns to match or exceed:
- Application-gated onboarding with multi-step form
- Curated, photo-forward member directory
- Simple DM system (not a full chat product)
- Events with RSVP
- Strong brand identity throughout — the app feels like a place, not just a product
- Dark, premium aesthetic
- Exclusivity signals: "X members online", invite counts shown

---

## Success Criteria (Judging)

1. **Screenshots** — Every major screen must look polished. No placeholder text, no unstyled components.
2. **End-to-end demo** — The full loop must work: apply → admin approves → member logs in → browses directory → RSVPs to event → sends DM → invites someone.
3. **AI development logs** — Prompts and iterations are tracked in `.claude-logs/`.
4. **Code quality** — Clean architecture, typed everything, no `any`, meaningful component names.
5. **Reflection doc** — Honest write-up shipped as `REFLECTION.md`.
