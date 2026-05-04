# ✦ Velvet

**An invite-only mobile community app** — where curated connections meet luxury design.

Built with React Native, Expo Router, and Supabase. Inspired by apps like Lox Club, The League, and Raya.

---

## ✨ Features

### 🏠 Member Experience
- **Curated Feed** — Personalized home screen with new members, upcoming events, and community highlights
- **Member Directory** — Browse and search verified community members with rich profiles
- **Real-Time Messaging** — Private 1-on-1 conversations with message history and online status
- **Event Discovery** — Browse, RSVP, and attend exclusive in-person and virtual events
- **Profile Management** — Edit bio, profession, interests, and profile photo
- **Invite System** — Generate and share unique invite codes to bring friends into the community
- **Notifications** — Stay updated on new members, event reminders, and invite acceptances

### 🔐 Application Flow
- **4-Step Application** — Personal info → professional background → social presence → referral
- **Progress Tracking** — Visual step indicator with data persistence across steps
- **Post-Approval Onboarding** — Welcome screen + guided profile setup with interest picker

### 🛡️ Admin Dashboard
- **Application Review Queue** — Approve, reject, or waitlist applicants with one tap
- **Community Metrics** — Total members, pending applications, active events at a glance
- **Applicant Detail View** — Full application review with social links and referral info

### 🎨 Design System
- **Dark Luxury Theme** — Near-black (#0A0A0A) surfaces with warm gold (#C9A84C) accents
- **Editorial Typography** — Playfair Display for headlines + DM Sans for body text
- **9 UI Primitives** — Text, Button, Card, Avatar, TextInputField, StatusBadge, SkeletonLoader, GoldDivider, AppModal
- **Smooth Animations** — Reanimated-powered transitions, shimmer loading states, and micro-interactions

### 🔒 Security & Auth
- **OTP Authentication** — Phone/email magic link sign-in via Supabase Auth
- **Social Login** — Google and Apple OAuth support
- **3-Zone Route Protection** — Public → Onboarding → Authenticated navigation guards
- **Row Level Security** — Supabase RLS policies for data access control

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native + Expo SDK 55 |
| **Routing** | Expo Router v3 (file-based) |
| **Backend** | Supabase (Postgres + Auth + Realtime + Storage) |
| **State** | TanStack React Query + React Context |
| **Styling** | React Native StyleSheet + custom design tokens |
| **Typography** | Playfair Display + DM Sans (Google Fonts) |
| **Animations** | React Native Reanimated |
| **Analytics** | PostHog |
| **Error Tracking** | Sentry |
| **Subscriptions** | RevenueCat |
| **i18n** | i18next + expo-localization |

---

## 📁 Project Structure

```
velvet/
├── app/                        # Screens (Expo Router file-based routing)
│   ├── (auth)/                 # Login / signup
│   ├── (onboarding)/           # Post-approval welcome + profile setup
│   ├── (tabs)/                 # Main tabs: Home, Members, Events, Messages, Profile
│   ├── admin/                  # Admin dashboard + application review
│   ├── apply/                  # 4-step membership application
│   ├── event/[id].tsx          # Event detail with RSVP
│   ├── member/[id].tsx         # Member profile detail
│   ├── messages/[id].tsx       # Chat conversation
│   ├── notifications.tsx       # Notification center
│   ├── invites.tsx             # Invite code management
│   └── profile/edit.tsx        # Edit profile
├── components/
│   ├── ui/                     # 9 reusable UI primitives
│   ├── admin/                  # Admin-specific components
│   └── application/            # Application flow components
├── contexts/                   # React contexts (Auth, Application, Subscription, Toast)
├── hooks/                      # Data hooks (useMembers, useEvents, etc.)
├── lib/                        # Core utilities, theme, typography, Supabase client
├── types/                      # TypeScript interfaces
├── supabase/                   # Database migrations + edge functions
├── docs/                       # Architecture documentation
└── assets/                     # App icons and splash screen
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/velvet.git
cd velvet

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and add your API keys (see Environment Variables below)

# 4. Start the dev server
npx expo start

# 5. Open in browser, iOS Simulator, or Android Emulator
# Press 'w' for web, 'i' for iOS, 'a' for Android
```

---

## 🔑 Environment Variables

Create a `.env` file from `.env.example` and add your keys:

| Variable | Required | Service | How to Get |
|----------|----------|---------|------------|
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase | [supabase.com](https://supabase.com) → Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Supabase | Same as above |
| `EXPO_PUBLIC_SENTRY_DSN` | ❌ No | Sentry | [sentry.io](https://sentry.io) → Project → Client Keys |
| `SENTRY_AUTH_TOKEN` | ❌ No | Sentry | Sentry → Auth Tokens |
| `EXPO_PUBLIC_POSTHOG_KEY` | ❌ No | PostHog | [posthog.com](https://posthog.com) → Project Settings |
| `EXPO_PUBLIC_POSTHOG_HOST` | ❌ No | PostHog | Defaults to `https://us.i.posthog.com` |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` | ❌ No | RevenueCat | [revenuecat.com](https://revenuecat.com) → API Keys |
| `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` | ❌ No | RevenueCat | Same as above |

> **Note:** The app runs in mock data mode without any keys configured. Only Supabase is required for real functionality.

---

## 📱 Screens (22 total)

| Zone | Screen | Description |
|------|--------|-------------|
| **Public** | Landing | Brand hero with animated gold orbs |
| | Login | OTP + Google/Apple social auth |
| | Apply (4 steps) | Membership application flow |
| | Privacy / Terms | Legal pages |
| **Onboarding** | Welcome | Post-approval celebration |
| | Setup Profile | Bio, city, profession, interests |
| **Authenticated** | Home | Feed with members + events |
| | Members | Searchable member directory |
| | Events | Calendar with type badges |
| | Messages | Inbox with unread counts |
| | Profile | User profile with stats |
| | Member Detail | Full profile + message CTA |
| | Event Detail | RSVP + venue details |
| | Chat | Real-time message bubbles |
| | Invites | Generate/share invite codes |
| | Edit Profile | Update all fields |
| | Notifications | Type-mapped notification list |
| **Admin** | Dashboard | Community metrics overview |
| | Applications | Review queue |
| | Application Detail | Approve/reject/waitlist |

---

## 🗄️ Database

The Supabase schema includes:

- **profiles** — Member data, bio, profession, avatar, interests
- **applications** — Membership applications with review workflow
- **events** — Community events with RSVP tracking
- **conversations** & **messages** — Real-time messaging
- **invites** — Invite code generation and tracking
- **notifications** — In-app notification system

Migrations are in `supabase/migrations/`. Run them with:
```bash
npx supabase db push
```

---

## 📄 License

MIT

---

<p align="center">
  <strong>✦ Velvet</strong> — Not everyone gets in.
</p>
